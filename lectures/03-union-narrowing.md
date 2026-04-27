# 03. ユニオン型と絞り込み (narrowing)

> Day 1 午後 / 講義 50 分 + ミニ演習 30 分 / 対応する Day3 課題: 02

## ゴール

- ユニオン型 (`A | B`) とリテラル型を書ける
- `typeof` / `in` / `instanceof` で型を絞り込める
- ユーザー定義型ガードを書ける
- **Discriminated Union** (タグ付きユニオン) を設計できる
- `never` で網羅性チェックができる

ここは TS の中で **最も実務頻出** の章です。気合を入れてください。

## ユニオン型

```ts
type StringOrNumber = string | number;

function double(x: StringOrNumber) {
  return x + x;  // ❌ string と number で振る舞いが違う
}
```

ユニオン型は **「どちらか一方」** を表します。そのままでは両方に共通する操作しかできません:

```ts
function len(x: string | string[]) {
  return x.length;  // ✅ どちらにも .length がある
}
```

異なる型を扱うには **絞り込む** 必要があります。

## リテラル型

```ts
type Tier = "gold" | "silver" | "bronze";

function discount(tier: Tier): number {
  if (tier === "gold") return 0.1;
  if (tier === "silver") return 0.05;
  return 0;
}

discount("platinum"); // ❌ Tier に存在しない
```

文字列ユニオンは **enum の代わり** によく使います。

## 絞り込みの手段

### typeof

```ts
function format(x: string | number): string {
  if (typeof x === "string") {
    return x.toUpperCase();   // x: string
  }
  return x.toFixed(2);        // x: number
}
```

`typeof` で絞り込めるのは **プリミティブ型**: `"string" | "number" | "boolean" | "undefined" | "object" | "function" | "symbol" | "bigint"`

### in

```ts
type Cat = { purrs: boolean; name: string };
type Dog = { barks: boolean; name: string };

function describe(animal: Cat | Dog) {
  if ("purrs" in animal) {
    return animal.purrs;   // animal: Cat
  }
  return animal.barks;     // animal: Dog
}
```

### instanceof

```ts
function handle(err: Error | string) {
  if (err instanceof Error) {
    return err.message;
  }
  return err;
}
```

## ユーザー定義型ガード

`typeof` / `in` で表現できないときは **自分で型ガードを書きます**:

```ts
type Cat = { kind: "cat"; purrs: boolean };

function isCat(animal: unknown): animal is Cat {
  return (
    typeof animal === "object" &&
    animal !== null &&
    "kind" in animal &&
    (animal as { kind: unknown }).kind === "cat"
  );
}

const x: unknown = getFromApi();
if (isCat(x)) {
  x.purrs;  // ✅ x: Cat に絞り込まれている
}
```

`animal is Cat` の **`is`** が型ガードの目印です。「`true` を返したら呼び出し元では `animal` を `Cat` として扱ってよい」と TS に伝えます。

## Discriminated Union (タグ付きユニオン)

実務で **最重要** のパターンです。

```ts
type Loading = { status: "loading" };
type Success = { status: "success"; data: string };
type Failure = { status: "failure"; error: string };

type State = Loading | Success | Failure;
```

`status` という共通プロパティ (= タグ) を持たせると、TS は自動で絞り込んでくれます:

```ts
function render(state: State) {
  if (state.status === "loading") {
    return "Loading...";
    // state: Loading
  }
  if (state.status === "success") {
    return state.data;
    // state: Success — data にアクセスできる
  }
  return state.error;
  // state: Failure
}
```

タグなしだと:

```ts
type BadState = { data: string } | { error: string };

function render(state: BadState) {
  if ("data" in state) state.data;  // 動くが、プロパティ名で絞り込むのは脆い
}
```

**タグを必ず1つ持たせる** のが鉄則です。

## never による網羅性チェック

```ts
function render(state: State): string {
  switch (state.status) {
    case "loading": return "Loading...";
    case "success": return state.data;
    case "failure": return state.error;
    default:
      const _exhaustive: never = state;  // ✅ ここに来るはずがない
      return _exhaustive;
  }
}
```

ここで `State` に新しいバリアントを追加すると:

```ts
type State = Loading | Success | Failure | { status: "idle" };
```

`default` 節で **コンパイルエラー**:

```
Type '{ status: "idle" }' is not assignable to type 'never'.
```

→ 「すべてのケースを処理し忘れている」とコンパイラが教えてくれる。これが **網羅性チェック** です。

## ミニ演習 (30 分)

```ts
// 1. 図形の面積を計算する関数を Discriminated Union で書く
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  /* TODO: switch で書く。default で never チェックを入れる */
}

// 2. 上記に { kind: "triangle"; base: number; height: number } を追加
//    コンパイルエラーが出ることを確認、修正する
```

## 講師向けメモ

- ここは **必ず手を動かしてもらう**。読むだけだと絶対わからない
- 「タグなしでも `in` で絞れますよね」と聞かれたら「動くが脆い、リファクタで死ぬ」と答える
- `never` は怖がる人が多いので、「来ない場所」を表すと丁寧に説明
- React 研修の reducer / props バリアントで再登場するので、ここを甘くするとあとで詰む
