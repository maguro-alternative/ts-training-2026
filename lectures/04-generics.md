# 04. ジェネリクス

## ゴール

- ジェネリクスを **なぜ使うか** を説明できる
- 関数・型エイリアスにジェネリクスを付けられる
- `extends` 制約を書ける
- `keyof` と組み合わせて使える

## なぜジェネリクスが必要か

「配列の最初の要素を返す関数」を書きたい:

### ❌ any で書く

```ts
function first(arr: any[]): any {
  return arr[0];
}

const x = first([1, 2, 3]);   // x: any
x.toUpperCase();              // 通ってしまう (実行時エラー)
```

`any` だと **呼び出し側の型情報が失われる**。

### ❌ 型ごとに書く

```ts
function firstNumber(arr: number[]): number | undefined { return arr[0]; }
function firstString(arr: string[]): string | undefined { return arr[0]; }
// ...無限に必要
```

### ✅ ジェネリクス

```ts
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const x = first([1, 2, 3]);     // x: number | undefined
const y = first(["a", "b"]);    // y: string | undefined
```

`<T>` は **型のプレースホルダ**。呼び出し時に TS が自動で埋めてくれます。

## 型パラメータの書き方

```ts
function identity<T>(x: T): T {
  return x;
}

// 明示的に渡すこともできる (普段は不要)
identity<string>("それでも！");

// 通常は推論
identity("それでも！");  // T は string と推論
```

## 複数の型パラメータ

```ts
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

const chihaya = pair("Chihaya Kisaragi", 16);  // [string, number]
const unicorn = pair("RX-0", "Unicorn Gundam")  // [string, string]
```

## extends 制約

「何でも入る」と困る場面があります:

```ts
function len<T>(x: T): number {
  return x.length;  // ❌ T に length があるとは限らない
}
```

`extends` で制約を付けます:

```ts
function len<T extends { length: number }>(x: T): number {
  return x.length;  // ✅
}

len("それでも！");   // ✅ string は length を持つ
len([1, 2]);    // ✅ array は length を持つ
len(123);       // ❌ number は length を持たない
```

## keyof との組み合わせ

オブジェクトのプロパティを安全に取り出す関数:

```ts
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const jojo = { name: "Jonathan Joestar", age: 19 };
const n = pick(jojo, "name");   // n: string
const a = pick(jojo, "age");    // a: number
const x = pick(jojo, "stand");  // ❌ "stand" は keyof jojo に含まれない
```

ここがジェネリクスの真骨頂:

- `K extends keyof T`: K は T のキーのどれか
- 戻り値 `T[K]`: T の K プロパティの型 (= 値の型)

## 型エイリアスのジェネリクス

```ts
type Box<T> = { value: T };

const b1: Box<number> = { value: 200 };
const b2: Box<string> = { value: "ok" };
```

実務でよく見るパターン:

```ts
type ApiResponse<T> = {
  status: "ok" | "error";
  data: T;
};

type UserResponse = ApiResponse<{ id: string; name: string }>;
```

## ジェネリクスのベストプラクティス

- **使われる型パラメータだけ書く**: 1回しか出てこないなら不要
- **意味のある名前を付ける**: 単純なら `T`、対の関係なら `K, V`、複数なら `TInput, TOutput`
- **制約を付けすぎない**: 「とりあえず extends」は読みにくくなる

## 演習

### Part A — 写経

```ts
// 1. identity 関数 (型をそのまま返す)
function identity<T>(x: T): T {
  return x;
}
const n = identity(3000);      // n: number
const s = identity("FEVER");   // s: string

// 2. 配列の最初の要素 (空なら undefined)
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const a = first([1, 2, 3]);     // a: number | undefined
const b = first(["x", "y"]);    // b: string | undefined

// 3. 2つの値をペアにする
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
const p = pair("Jonathan Joestar", 19);      // p: [string, number]

// 4. extends 制約 — length を持つ何かの長さを返す
function len<T extends { length: number }>(x: T): number {
  return x.length;
}
len("それでも！");   // ✅
len([1, 2, 3]);    // ✅
// len(42);        // ❌ コメントアウトを外して確認
```

### Part B — 自分で書く

```ts
// 1. 配列の最後の要素 (空なら undefined)
function last</* TODO */>(arr: T[]): /* TODO */ {
  /* TODO */
}

// 2. 配列の先頭 n 個を返す
function take</* TODO */>(arr: T[], n: number): T[] {
  /* TODO */
}

// 3. オブジェクトのキーから値を取り出す (型安全に)
function pick</* TODO */>(obj: T, key: K): /* TODO */ {
  return obj[key];
}

const jojo = { name: "Jonathan Joestar", age: 19 };
const name = pick(jojo, "name");   // name: string
const age = pick(jojo, "age");     // age: number
// pick(jojo, "stand");            // ❌ "email" は存在しない

// 4. 2つのオブジェクトをマージ
function merge</* TODO */>(a: A, b: B): A & B {
  return { ...a, ...b };
}
const m = merge({ name: "Jonathan Joestar" }, { age: 19 });
// m: { name: string; age: number }

// 5. 配列を「キーごとにグループ化」する関数
//    items[i][key] が同じものをまとめる
//    例: groupBy([{attribute:"Princess",...}, {attribute:"Fairy",...}], "attribute")
//        → { princess: [...], fairy: [...] }
function groupBy</* TODO */>(items: T[], key: K): /* TODO */ {
  /* TODO */
}
```

### Part C — 任意

```ts
// 1. Promise<T> を unwrap する型レベルのヘルパー (Day 2-07 への伏線)
//    ヒント: infer を使う (このタイミングでは未習なので任意)

// 2. 型パラメータ 2つの map (Array.prototype.map の型版)
function mymap</* TODO */>(arr: T[], fn: (x: T) => U): U[] {
  return arr.map(fn);
}

const upper = mymap(["a", "b"], (s) => s.toUpperCase());  // string[]
const lens = mymap(["jo", "jo"], (s) => s.length);       // number[]

// 3. 「2つの配列を zip する」関数
//    zip([1, 2], ["a", "b"]) → [[1, "a"], [2, "b"]]
function zip</* TODO */>(a: A[], b: B[]): [A, B][] {
  /* TODO */
}
```

## 講師向けメモ

- 最初のスライドで **「any との違い」** を必ず体感させる。ここを軽く流すと「ジェネリクス何が嬉しいの」となる
- `<T>` を読みにくいと感じる人が多い。「JS の関数の `(x)` の型版」と説明
- `keyof` は次の章 (ユーティリティ型) でフル活用するので、必ず触れる
- React 研修で `useState<T>`、汎用コンポーネント、Context で再登場することを予告
