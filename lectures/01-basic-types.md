# 01. 基本型

> Day 1 午前 / 講義 40 分 + ミニ演習 20 分 / 対応する Day3 課題: 01

## ゴール

- プリミティブ型 / 配列 / タプル を書き分けられる
- 関数の引数・戻り値に型を付けられる
- `let` / `const` で **型推論** がどう変わるかを理解する

## プリミティブ型

```ts
const name: string = "Taro";
const age: number = 25;
const isAdmin: boolean = false;
const nothing: null = null;
const notYet: undefined = undefined;
```

実務では明示的に書かず、**推論に任せる** ことが多いです:

```ts
const name = "Taro";   // 推論: string
let age = 25;          // 推論: number
```

ただし「初期値はないが型は決めたい」ときは明示します:

```ts
let name: string;      // まだ未代入
name = "Taro";
```

## let と const の推論差

```ts
const tier = "gold";   // 推論: "gold" (リテラル型)
let tier2 = "gold";    // 推論: string
```

- `const` は値が変わらないので **リテラル型** に推論される
- `let` は再代入される前提なので **広い型 (string)** に推論される

これは後で出てくる **ユニオン型** と組み合わせて重要になります。

## 配列とタプル

```ts
const ids: number[] = [1, 2, 3];
const names: Array<string> = ["A", "B"];   // 別の書き方

// タプル: 長さと型を固定
const point: [number, number] = [10, 20];
const entry: [string, number] = ["age", 25];
```

`number[]` と `[number, number]` の違い:

```ts
const a: number[] = [1, 2];
a.push(3);          // ✅
const b: [number, number] = [1, 2];
b.push(3);          // ⚠️ TS は通すことがある (push は弱い)
const [x, y, z] = b; // ❌ z は存在しない (長さ2)
```

## 関数の型

```ts
function add(a: number, b: number): number {
  return a + b;
}

// アロー関数
const mul = (a: number, b: number): number => a * b;

// 戻り値型は推論されるので省略可 (公開APIでは明示推奨)
const sub = (a: number, b: number) => a - b;  // 推論: number
```

### void と never

```ts
function log(msg: string): void {
  console.log(msg);
  // 戻り値を使わない関数
}

function fail(msg: string): never {
  throw new Error(msg);
  // 「決して戻らない」関数
}
```

`never` は Day 1 後半の **網羅性チェック** で再登場します。

## any と unknown (チラ見せ)

```ts
let x: any;       // 何でも入る + 何にでも代入できる (危険)
let y: unknown;   // 何でも入る + 使う前に絞り込みが必要 (安全)

x.toUpperCase();  // ✅ 通る (が、実行時に落ちるかも)
y.toUpperCase();  // ❌ 'unknown' なので使えない

if (typeof y === "string") {
  y.toUpperCase();  // ✅ 絞り込み済みなので OK
}
```

- `any` は 「型チェックを諦める」 = TS をやる意味がない
- 外部から来るデータは `unknown` で受けて、検証してから使う (Day 2 で詳しく)

## ミニ演習 (20 分)

```ts
// 1. 以下を埋めてください
function square(/* TODO */) {
  return n * n;
}

// 2. 数値配列の合計を返す関数
function sum(/* TODO */) {
  return numbers.reduce((a, b) => a + b, 0);
}

// 3. 名前と年齢を受け取って "Taro (25)" 形式で返す
function format(/* TODO */) {
  return `${name} (${age})`;
}
```

## 講師向けメモ

- 「const ならリテラル型、let なら広い型」だけは必ず手元で動かしてもらう
- `any` の説明はこの章では深入りしない (Day 2 の 06 章で本気で扱う)
- Day3 課題01 の予告として「`any` を直すだけの単純作業に見えるが、`expectTypeOf` で引数・戻り値の両方が見られている」ことを伝える
