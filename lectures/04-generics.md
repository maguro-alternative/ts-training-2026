# 04. ジェネリクス

> Day 2 午前 / 講義 50 分 + ミニ演習 30 分 / 対応する Day3 課題: 03

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
identity<string>("hello");

// 通常は推論
identity("hello");  // T は string と推論
```

## 複数の型パラメータ

```ts
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

const p = pair("age", 25);  // [string, number]
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

len("hello");   // ✅ string は length を持つ
len([1, 2]);    // ✅ array は length を持つ
len(123);       // ❌ number は length を持たない
```

## keyof との組み合わせ

オブジェクトのプロパティを安全に取り出す関数:

```ts
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Taro", age: 25 };
const n = pick(user, "name");   // n: string
const a = pick(user, "age");    // a: number
const x = pick(user, "email");  // ❌ "email" は keyof user に含まれない
```

ここがジェネリクスの真骨頂:

- `K extends keyof T`: K は T のキーのどれか
- 戻り値 `T[K]`: T の K プロパティの型 (= 値の型)

## 型エイリアスのジェネリクス

```ts
type Box<T> = { value: T };

const b1: Box<number> = { value: 42 };
const b2: Box<string> = { value: "hi" };
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

## ミニ演習 (30 分)

```ts
// 1. 配列を「キーごとにグループ化」する関数
//    例: groupBy([{tier:"gold",...}, ...], "tier") → { gold: [...], silver: [...] }
function groupBy</* TODO */>(items: T[], key: K): /* TODO */ {
  /* TODO: 実装 */
}

// 2. 2つのオブジェクトをマージする関数 (Object.assign 風)
function merge</* TODO */>(a: A, b: B): A & B {
  return { ...a, ...b };
}

const m = merge({ name: "Taro" }, { age: 25 });
// m: { name: string; age: number } になればOK
```

## 講師向けメモ

- 最初のスライドで **「any との違い」** を必ず体感させる。ここを軽く流すと「ジェネリクス何が嬉しいの」となる
- `<T>` を読みにくいと感じる人が多い。「JS の関数の `(x)` の型版」と説明
- `keyof` は次の章 (ユーティリティ型) でフル活用するので、必ず触れる
- React 研修で `useState<T>`、汎用コンポーネント、Context で再登場することを予告
