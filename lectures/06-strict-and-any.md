# 06. strict と any との戦い方

## ゴール

- `strict` モードの中身を説明できる
- `any` を避けるべき理由を **実例で** 言える
- `unknown` と `any` を使い分けられる
- 型アサーション (`as`) の正しい使い方を知る

## strict モードとは

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

`strict: true` は以下の **複数の厳格チェックを一括ON** するスイッチです:

| 設定 | やってくれること |
|------|-----------------|
| `noImplicitAny` | 暗黙の `any` を禁止 |
| `strictNullChecks` | `null` / `undefined` を別の型として扱う |
| `strictFunctionTypes` | 関数の引数の互換性を厳しくチェック |
| `strictBindCallApply` | `bind` / `call` / `apply` を型チェック |
| `strictPropertyInitialization` | クラスプロパティの初期化漏れを禁止 |
| `noImplicitThis` | `this` が `any` になるのを禁止 |
| `alwaysStrict` | 出力JSに `"use strict"` を付ける |

このリポジトリでは **すべて ON** です。実務でも基本これで書きます。

### strictNullChecks の重要さ

OFF だと:

```ts
function len(s: string): number {
  return s.length;
}
len(null);  // ✅ 通ってしまう (実行時に落ちる)
```

ON だと:

```ts
len(null);  // ❌ 'null' は string に代入できない
```

`null` を許容したい場合は明示:

```ts
function len(s: string | null): number {
  return s?.length ?? 0;
}
```

`null` / `undefined` を **型に明示する** 文化が strict の本質です。

## any はなぜダメか

### ❌ 型チェックを諦める

```ts
function parseUser(json: any) {
  return {
    id: json.id,
    name: json.name.toUpperCase(),  // 通る
  };
}

parseUser({ id: 1, naem: "Taro" });  // typo: name → naem
// 実行時: undefined.toUpperCase() で落ちる
```

### ❌ 伝染する

```ts
function getValue(): any { return 42; }

const x = getValue();   // x: any
const y = x + "hello";  // y: any (number + string なのに警告なし)
const z = y.foo.bar;    // z: any (実行時に落ちる)
```

`any` は触れたものすべてを `any` 化します (型のがん細胞)。

## any vs unknown

`unknown` も「何が来るかわからない」を表しますが、**使う前に絞り込みが必要** です:

```ts
function parse(json: any) {
  return json.foo.bar;       // ✅ 通ってしまう
}

function parse(json: unknown) {
  return json.foo.bar;       // ❌ unknown には .foo がない
}

function parse(json: unknown) {
  if (
    typeof json === "object" &&
    json !== null &&
    "foo" in json
  ) {
    // ここで json: object & Record<"foo", unknown>
    // 細かい絞り込みが必要
  }
}
```

**外から来るデータは `any` ではなく `unknown` で受ける** が鉄則です。

## 型アサーション `as`

「TS の型推論より、書いた人のほうが情報を持っている」場面:

```ts
const el = document.getElementById("app") as HTMLDivElement;
el.innerHTML = "...";
```

`getElementById` の戻り値は `HTMLElement | null` ですが、設計上必ず `<div id="app">` がある場合は `as` で絞り込みます。

### 危険な as

```ts
const x = "hello" as unknown as number;  // 嘘
console.log(x.toFixed(2));               // 実行時に落ちる
```

`as` は **コンパイラに「黙れ」と言う最終手段**。理由をコメントに残すこと。

### 安全な代替

```ts
function isHTMLDivElement(el: unknown): el is HTMLDivElement {
  return el instanceof HTMLDivElement;
}

const el = document.getElementById("app");
if (el && isHTMLDivElement(el)) {
  el.innerHTML = "...";  // 型ガードで安全に絞り込み
}
```

## any を避ける戦略

| 状況 | 取るべき型 |
|------|-----------|
| 外部 API のレスポンス | `unknown` + 型ガード or バリデーション |
| 関数の汎用入力 | ジェネリクス `<T>` |
| ライブラリの型がない | 自分で `.d.ts` を書く / DefinitelyTyped を入れる |
| 一時的に逃げたい | `// FIXME: any` と理由付きコメントを残す |

## 演習

### Part A — any 1個ずつ直す

```ts
// 1. any を string に直す
function shout(s: any): string {
  return s.toUpperCase() + "!";
}
// ↓ 直してみる
function shout2(/* TODO */): string {
  return s.toUpperCase() + "!";
}

// 2. unknown と絞り込み
function double(x: unknown): number {
  if (typeof x === "number") return x * 2;
  if (typeof x === "string") return Number(x) * 2;
  throw new Error("unsupported");
}

// 3. strictNullChecks の感触をつかむ
function greet(name: string | null): string {
  // return `Hello, ${name.toUpperCase()}!`;   // ❌ name が null かも
  /* TODO: ?. と ?? を使って書き直す */
  return /* TODO */;
}
```

### Part B — parseQueryString のリファクタ

```ts
// 以下のコードは any だらけ。strict で通るように直してください。
// ロジックは変えない。

function parseQueryString(qs: any) {
  const result: any = {};
  qs.split("&").forEach((pair: any) => {
    const [k, v] = pair.split("=");
    result[k] = decodeURIComponent(v);
  });
  return result;
}

const q = parseQueryString("name=Taro&age=25");
console.log(q.name);
```

ヒント:
- 入力は `string`
- 戻り値は `Record<string, string>`
- `forEach` の中の `pair` は推論に任せられる

```ts
// もう 1 問: any を消す
function sumByKey(items: any, key: any): number {
  return items.reduce((acc: any, item: any) => acc + item[key], 0);
}

// 例: sumByKey([{p:100}, {p:200}], "p") → 300
//
// ヒント: ジェネリクスを使う。K extends keyof T、T[K] extends number など
```

### Part C — 任意

```ts
// 1. unknown のレスポンスを安全に検証する型ガード
//    { id: string; name: string } の形か検証
type UserDto = { id: string; name: string };

function isUserDto(x: unknown): x is UserDto {
  /* TODO */
}

const json: unknown = JSON.parse('{"id":"u1","name":"Taro"}');
if (isUserDto(json)) {
  console.log(json.name);  // 安全
}

// 2. 安全な型アサーション (理由コメント付き)
//    DOM 要素を取り出すときに as を使う場面と、型ガードで書き換える場面の比較
const el1 = document.getElementById("app") as HTMLDivElement;  // ❌ 雑

function isHTMLDivElement(x: unknown): x is HTMLDivElement {
  return x instanceof HTMLDivElement;
}

const el2 = document.getElementById("app");
if (el2 && isHTMLDivElement(el2)) {
  /* TODO: el2 を使う */
}
```

## 講師向けメモ

- 「any 禁止」を強く言う回。新卒は「とりあえず any」で逃げる癖がつくと一生抜けない
- `unknown` は最初は使いづらく感じるが、**「面倒だから絞り込む」が型安全の入り口** と説明
- `as` の悪用は実コードでも起きる。「**`as` は最後の手段、書くなら理由をコメント**」と強調
- Day 3 の課題05 は本気でこれを問う回。「Day 3 で泣きます」と予告しておく
