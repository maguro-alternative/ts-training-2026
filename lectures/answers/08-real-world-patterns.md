# 08. 実務パターン (API型・型ガード・Result) — 演習の答え

## Part A — API レスポンス型を写経

- `handle(res)` の中で:
  - `if (res.status === "success")` の中では `res.users` にアクセスできる(他のケースには `users` がない)
  - 次の `if (res.errorType === "server")` で `ValidationError` と `ServerError` が分岐され、 `res.retryAfter` にアクセスできるのは `ServerError` 側だけ
- **2層の Discriminated Union**(`status` で成功/失敗、 失敗の中で `errorType` で更に分岐)が現実的な API レスポンス設計の定石

## Part B — 商品取得 API + Result 型

### 1. `ProductResponse` と `handleProduct`

```ts
type ProductResponse =
  | { status: "ok"; product: { id: string; name: string; price: number } }
  | { status: "not_found"; productId: string }
  | { status: "error"; message: string };

function handleProduct(res: ProductResponse): string {
  switch (res.status) {
    case "ok":
      return `${res.product.name} (¥${res.product.price})`;
    case "not_found":
      return `product ${res.productId} not found`;
    case "error":
      return `error: ${res.message}`;
    default:
      const _exhaustive: never = res;
      return _exhaustive;
  }
}
```

ポイント:
- 3つの結果を **1つのユニオン型** で表現
- `switch (res.status)` で **タグ判別** → 各ブランチで型が絞り込まれる
- `default` の `never` チェックで「ケース追加忘れ」を型レベルで防ぐ

### 2. `Result<T, E>`

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

ポイント:
- **`ok` フラグで成功/失敗を判別** する Discriminated Union
- 成功側は `value: T`、 失敗側は `error: E` を持つ
- 例外を投げる代わりに「正常な値として失敗も返す」 → 呼び出し側が必ず両方扱う

### 3. `safeJsonParse`

```ts
function safeJsonParse(s: string): Result<unknown, string> {
  try {
    return { ok: true, value: JSON.parse(s) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
```

ポイント:
- `JSON.parse` は不正な JSON で **例外を投げる** ので、 そのままだと「成功も失敗もあり得る」が型上見えない
- `Result` で包むと、 **戻り値の型** に失敗の可能性が現れる
- `catch (e)` の `e` は **`unknown`**(`useUnknownInCatchVariables: true` がデフォルト)なので、 `instanceof Error` で絞ってから `.message` にアクセス

**呼び出し側の安全性**:

```ts
const r1 = safeJsonParse('{"x":1}');
if (r1.ok) {
  console.log(r1.value);   // r1.value は unknown (中身は別途検証が必要)
} else {
  console.error(r1.error); // r1.error は string
}
```

`ok` フラグで型が絞り込まれるので、 失敗ケースを **忘れずに扱う** ことが TS で強制される。

## Part C — 任意

### 1. `searchUsers`(fetch + 検証)

```ts
function isApiResponse(x: unknown): x is ApiResponse {
  if (typeof x !== "object" || x === null) return false;
  const obj = x as { status?: unknown; errorType?: unknown };

  if (obj.status === "success") {
    return "users" in obj && Array.isArray((obj as { users: unknown }).users);
  }
  if (obj.status === "error") {
    return obj.errorType === "validation" || obj.errorType === "server";
  }
  return false;
}

async function searchUsers(q: string): Promise<ApiResponse> {
  const res = await fetch(`/api/users?q=${encodeURIComponent(q)}`);
  const json: unknown = await res.json();
  if (!isApiResponse(json)) {
    throw new Error("invalid API response shape");
  }
  return json;
}
```

ポイント:
- `await res.json()` の戻り値は **`any`**(これがTSの伝統的弱点)→ **`unknown`** に明示
- 型ガード関数で **形を検証** してから `ApiResponse` として返す
- 検証に失敗したら例外を投げる(`Result` で包んでもよい)
- `encodeURIComponent(q)` を忘れない(URL インジェクション対策)

**実務での解**: 手書きの型ガードは大変なので、 **Zod** などのバリデーションライブラリを使う。 講義本編の `## fetch して型を付ける` 節で見た通り:

```ts
import { z } from "zod";

const ApiResponseSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    users: z.array(z.object({ id: z.string(), name: z.string() })),
  }),
  z.object({ status: z.literal("error"), errorType: z.literal("validation"), message: z.string() }),
  z.object({
    status: z.literal("error"),
    errorType: z.literal("server"),
    message: z.string(),
    retryAfter: z.number(),
  }),
]);

async function searchUsers(q: string): Promise<ApiResponse> {
  const res = await fetch(`/api/users?q=${encodeURIComponent(q)}`);
  return ApiResponseSchema.parse(await res.json());
}
```

スキーマから **型と検証ロジックが両方** 得られるのが Zod の強み。 「型の定義 = ランタイムバリデータ」になる。

### 2. `ok` / `err` ヘルパー(写経)

```ts
function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}
function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}
```

ポイント:
- 成功は **「エラー型 `never`」** で返す(エラー側のユニオン分岐に巻き込まれない)
- 失敗は **「値型 `never`」** で返す
- 呼び出し側で `Result<X, Y>` として扱うと、 `never` がユニオンに吸収されて消える

これにより:
```ts
const r: Result<number, string> = ok(42);  // OK
// r.value は number、r.error は string として呼び出し側で扱える
```

### 3. `safeJsonParse2`(ヘルパー利用版)

```ts
function safeJsonParse2(s: string): Result<unknown, string> {
  try {
    return ok(JSON.parse(s));
  } catch (e) {
    return err(e instanceof Error ? e.message : String(e));
  }
}
```

ポイント:
- 関数本体が **「成功なら ok、 失敗なら err」** という意図がそのまま読める
- リテラルオブジェクトの組み立てが消えて、 ロジックが見やすくなる
- これが **「Result パターンを実務に持ち込むときの定型コード」** の最終形

実務では `neverthrow` のようなライブラリが `Result` 型 + ヘルパー + `map` / `andThen` などのメソッドチェーンを提供してくれる。 興味があれば調べてみるとよい。
