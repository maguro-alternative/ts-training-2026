# 06. strict と any との戦い方 — 演習の答え

## Part A — any 1個ずつ直す

### 1. `shout` の `any` を `string` に

```ts
function shout(s: string): string {
  return s.toUpperCase() + "!";
}
```

ポイント: 引数の意図(文字列を受け取る)が `string` に揃った。 `any` だと `s.toUpperCase()` が **何のチェックもなく通ってしまう**(数値を渡しても実行時エラーまで分からない)。

### 2. `double`(写経)

- `x` が `unknown` のとき、 **絞り込み前にメソッドを呼ぶとエラー**:

```ts
function double(x: unknown): number {
  return x * 2;   // ❌ Object is of type 'unknown'.
}
```

- `typeof` で絞り込むと使える、 という体験

### 3. `greet` を `?.` / `??` で書き直す

```ts
function greet(name: string | null): string {
  return `Hello, ${name?.toUpperCase() ?? "anonymous"}!`;
}
```

ポイント:
- **`?.`(オプショナルチェーン)**: `name` が `null` なら `name?.toUpperCase()` 全体が `undefined` を返す
- **`??`(Nullish 合体)**: 左が `null` / `undefined` のとき右に置き換える
- 出力例: `greet(null)` → `"Hello, anonymous!"`, `greet("taro")` → `"Hello, TARO!"`

**「strictNullChecks のおかげで `null` チェックを忘れるとコンパイルエラー」** が体感できればOK。

## Part B — `parseQueryString` のリファクタ

### `parseQueryString`

```ts
function parseQueryString(qs: string): Record<string, string> {
  const result: Record<string, string> = {};
  qs.split("&").forEach((pair) => {
    const [k, v] = pair.split("=");
    result[k] = decodeURIComponent(v);
  });
  return result;
}
```

ポイント:
- 入力 `qs: string`、 戻り値 `Record<string, string>`
- `forEach` の引数 `pair` は **`split` の結果から `string` に推論される**(明示不要)
- `[k, v] = pair.split("=")` も同様に推論される

**より厳密に書くなら**(`noUncheckedIndexedAccess` 有効時):

```ts
function parseQueryString(qs: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const pair of qs.split("&")) {
    const [k, v] = pair.split("=");
    if (k === undefined || v === undefined) continue;
    result[k] = decodeURIComponent(v);
  }
  return result;
}
```

タプル分割代入で `undefined` が混入し得る場面を扱うが、 入門段階では深入りしなくてOK。

### `sumByKey`

```ts
function sumByKey<T, K extends keyof T>(items: T[], key: K): number {
  return items.reduce<number>((acc, item) => {
    const v = item[key];
    return acc + (typeof v === "number" ? v : 0);
  }, 0);
}
```

ポイント:
- `T extends keyof T` で **`items` の要素のキーに限定**
- `item[key]` の型は `T[K]` だが、 任意の値型を許すので **`typeof v === "number"` で絞り込み** が必要

**より厳しく書く別解**(`T[K]` が `number` だけを許すように制約):

```ts
function sumByKey<
  T,
  K extends keyof T,
>(items: T[], key: K): number {
  // T[K] が number に extends されることを使い手側で保証してもらう
  return items.reduce((acc, item) => acc + Number(item[key]), 0);
}
```

または、 型レベルで「数値プロパティを持つキーだけを許す」:

```ts
type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

function sumByKey<T, K extends NumericKeys<T>>(items: T[], key: K): number {
  return items.reduce((acc, item) => acc + (item[key] as number), 0);
}

sumByKey([{ p: 100 }, { p: 200 }], "p");  // ✅
// sumByKey([{ p: "100" }], "p");        // ❌ "p" は string なので候補に入らない
```

## Part C — 任意

### 1. `isUserDto`

```ts
function isUserDto(x: unknown): x is UserDto {
  return (
    typeof x === "object" &&
    x !== null &&
    "id" in x &&
    "name" in x &&
    typeof (x as { id: unknown }).id === "string" &&
    typeof (x as { name: unknown }).name === "string"
  );
}
```

実務では Zod / Valibot を使うのが普通。

### 2. 型ガードによる安全な DOM 取得

```ts
const el2 = document.getElementById("app");
if (el2 && isHTMLDivElement(el2)) {
  el2.classList.add("active");
  // el2 はここで HTMLDivElement に絞られている
}
```

ポイント:
- `document.getElementById` は **`HTMLElement | null`** を返す
- そのまま `as HTMLDivElement` でキャストすると、 **実際にspanだったときに気付けない**(`as` は型チェックをスキップする)
- `instanceof HTMLDivElement` で型ガードすれば、 **ランタイムにもチェック** が走るので安全

**`as` の良い使い方**:

```ts
// app に対応する要素は必ず div として配置されている前提 (index.html の構造で保証)
const el = document.getElementById("app") as HTMLDivElement;
```

理由がないと書けないなら `as` は避ける、 を覚える。
