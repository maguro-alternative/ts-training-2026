# 01. 基本型 — 演習の答え

## Part A — 写経 + 動作確認

```ts
const n = 42;                 // 推論: 42       (number リテラル型)
let   m = 42;                 // 推論: number
const t = "eternal harmony";  // 推論: "eternal harmony" (string リテラル型)
let   s = "my song";          // 推論: string
```

`const` だと **リテラル型** に絞られ、 `let` だと **広い型**(`number` / `string`)になる、を体感できればOK。

## Part B — 自分で型を付ける

### 1. `shout`

```ts
function shout(s: string): string {
  return s.toUpperCase() + "!";
}
```

文字列を受け取って文字列を返す、シンプルな型付け。

### 2. `max`

```ts
function max(numbers: number[]): number | undefined {
  if (numbers.length === 0) return undefined;
  return Math.max(...numbers);
}
```

ポイント: 空配列のとき `undefined` を返すので、戻り値型は `number | undefined`。
戻り値型を省略しても TS が推論で `number | undefined` を導けるが、 明示しておく方が意図が伝わる。

### 3. `evens`

```ts
function evens(numbers: number[]): number[] {
  return numbers.filter((n) => n % 2 === 0);
}
```

`filter` の戻り値は元の配列と同じ型(`number[]`)になる。
`Array<number>` と書いてもOK。

### 4. `format`

```ts
function format(name: string, age: number): string {
  return `${name} (${age})`;
}
```

複数引数の基本形。テンプレートリテラルで埋め込み。

### 5. `firstName`

```ts
function firstName(names: string[]): string {
  return names[0] ?? "anonymous";
}
```

ポイント: `names[0]` の型は **`string`(`string | undefined` ではない)** が TS のデフォルト挙動(`noUncheckedIndexedAccess: false` 時)。
`?? "anonymous"` は実行時には機能するが、 型上は冗長になっている。

**より厳しく書くなら**: `tsconfig.json` で `noUncheckedIndexedAccess: true` を有効にすると `names[0]` が `string | undefined` になり、 `??` が型上も必要になる。
本研修では深入りせず「実行時の安全策として `??` を使っているのは良い習慣」と説明すれば十分。

## Part C — 任意

### 1. `log`(any を使わない)

**解法A: `unknown` + 型ガード**

```ts
function log(value: unknown): void {
  if (typeof value === "string") {
    console.log(`[string] ${value}`);
  } else if (typeof value === "number") {
    console.log(`[number] ${value}`);
  } else if (value === null) {
    console.log(`[null]`);
  } else {
    console.log(`[other]`, value);
  }
}
```

ポイント:
- `unknown` で受けると **絞り込み(型ガード)なしには中身に触れない** → 安全
- `any` のように「型チェックを諦める」のではなく、 「使う直前に検証する」発想
- 「外部からくるデータは `unknown` で受け、検証してから使う」が実務の鉄則

**解法B: ジェネリクス**

```ts
function log<T>(value: T): T {
  console.log(value);
  return value;
}

const n = log(42);       // T = number
const s = log("hello");  // T = string
```

ポイント:
- 中身に触らず通すだけなら、ジェネリクスで **呼び出し側の型情報を保持** できる
- 「Day 2 のジェネリクス章への伏線」 として `<T>` を見せておくと良い

### 2. `BinaryOp`(関数型エイリアス)

```ts
type BinaryOp = (a: number, b: number) => number;

const add2: BinaryOp = (a, b) => a + b;
const mul2: BinaryOp = (a, b) => a * b;
```

ポイント:
- `BinaryOp` 側で引数・戻り値型を定義しているので、 `add2` / `mul2` 側では型注釈を省略できる(**コンテキスト型付け**)
- 同じシグネチャの関数を何度も書くときに **重複を減らせる**
- リテラル型ユニオン(`type Tier = "gold" | "silver" | "bronze"`)などと並んで「`type` だからこそ書ける」典型例
