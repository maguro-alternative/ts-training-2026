# 08. 実務パターン (API型・型ガード・Result)

> Day 2 午後 / 講義 40 分 + ミニ演習 30 分 / 対応する Day3 課題: 07

## ゴール

- 外部 API レスポンスを型で安全に扱える
- `unknown` から型ガードで絞り込める / バリデーションライブラリの使いどころがわかる
- Result 型 / Discriminated Union を組み合わせて実務的なエラー処理を書ける

ここは Day 3 の課題07 への直接的な準備です。

## API レスポンスの型付け

架空のユーザー検索 API:

### 成功レスポンス

```json
{ "status": "success", "users": [{ "id": "u1", "name": "Taro" }] }
```

### 失敗レスポンス (2種類)

```json
{ "status": "error", "errorType": "validation", "message": "query is required" }
```

```json
{ "status": "error", "errorType": "server", "message": "internal", "retryAfter": 30 }
```

`retryAfter` は **server エラーのときだけ** 存在します。

### 型に起こす

```ts
type SuccessResponse = {
  status: "success";
  users: { id: string; name: string }[];
};

type ValidationError = {
  status: "error";
  errorType: "validation";
  message: string;
};

type ServerError = {
  status: "error";
  errorType: "server";
  message: string;
  retryAfter: number;
};

type ApiResponse = SuccessResponse | ValidationError | ServerError;
```

ここで重要なのは:

- **status と errorType の二段構えのタグ** で絞り込む
- `retryAfter` を `ApiResponse` に直接書かない (= ServerError にしか持たせない)

### 使う側

```ts
function handle(res: ApiResponse) {
  if (res.status === "success") {
    return res.users;
    // res: SuccessResponse
  }
  // ここで res: ValidationError | ServerError
  if (res.errorType === "server") {
    setTimeout(retry, res.retryAfter * 1000);
    // res: ServerError — retryAfter にアクセスできる
    return;
  }
  showError(res.message);
  // res: ValidationError
}
```

## fetch して型を付ける

```ts
async function searchUsers(q: string): Promise<ApiResponse> {
  const res = await fetch(`/api/search?q=${q}`);
  const json: unknown = await res.json();
  return /* ここでどう ApiResponse として扱うか? */;
}
```

問題は `res.json()` の戻り値が `Promise<any>` (TS 標準) だが、**実際には何が来るか TS にはわからない** こと。

### 危険な実装

```ts
const json = await res.json();
return json as ApiResponse;  // ❌ サーバーが嘘をついたら破綻
```

### 型ガードで検証

```ts
function isApiResponse(x: unknown): x is ApiResponse {
  if (typeof x !== "object" || x === null) return false;
  if (!("status" in x)) return false;
  // ... 細かく検証
  return true;
}

const json: unknown = await res.json();
if (!isApiResponse(json)) {
  throw new Error("Invalid API response");
}
return json;  // ApiResponse
```

手で書くと面倒ですが、**外部データは検証しないと安全ではない** です。

### バリデーションライブラリ (実務での解)

[Zod](https://zod.dev/) などを使うと、型と検証を一気に書けます:

```ts
import { z } from "zod";

const SuccessResponse = z.object({
  status: z.literal("success"),
  users: z.array(z.object({ id: z.string(), name: z.string() })),
});

const ApiResponse = z.discriminatedUnion("status", [
  SuccessResponse,
  // ValidationError, ServerError も書く
]);

const json: unknown = await res.json();
const parsed = ApiResponse.parse(json);  // 失敗したら例外
// parsed の型は自動推論される
```

研修では深入りしませんが、「実務ではこう書く」と知っておいてください。

## Result 型パターン

例外を投げない・型で成功/失敗を扱う:

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function parseNumber(s: string): Result<number, string> {
  const n = Number(s);
  if (Number.isNaN(n)) return { ok: false, error: "not a number" };
  return { ok: true, value: n };
}

const r = parseNumber("42");
if (r.ok) {
  console.log(r.value);  // r.value: number
} else {
  console.error(r.error);  // r.error: string
}
```

- 例外と違って **呼び出し側に処理を強制できる**
- Discriminated Union で TS が自動絞り込み
- React の状態管理でもこのパターンが多用されます

## ミニ演習 (30 分)

```ts
// 1. 商品取得 API の型を Discriminated Union で定義してください
//    成功: { status: "ok", product: { id: string, name: string, price: number } }
//    NotFound: { status: "not_found", productId: string }
//    Error: { status: "error", message: string }

type ProductResponse = /* TODO */;

function handle(res: ProductResponse) {
  /* TODO: switch で書き分ける。default で never チェック */
}

// 2. Result 型を使って、文字列をJSON parse する関数を書く
//    成功: { ok: true, value: unknown }
//    失敗: { ok: false, error: string }

type Result<T, E> = /* TODO */;

function safeJsonParse(s: string): Result<unknown, string> {
  /* TODO */
}
```

## 講師向けメモ

- ここまでの章すべての集大成。Day 3 課題07 はここの応用なので、**演習を必ずやってもらう**
- Zod の話は深入りしない。「ライブラリで楽できる」を知らせるだけで十分
- 「`fetch().json()` の戻り値が `any` で危ない」は意外と盲点。実例として強調
- Result 型は React 研修でも (`useFetch` の状態など) 出てくると予告
- 最後に「Day 3 はこの内容を体に染み込ませる日」と言って終わる
