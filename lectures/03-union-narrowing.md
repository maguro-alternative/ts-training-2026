# 03. ユニオン型と絞り込み (narrowing)

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
type Member = "mirai" | "shizuka" | "tsubasa";
type Attribute = "Princess" | "Fairy" | "Angel"

function attribute(member: Member): Attribute {
  if (member === "mirai") return "Princess";
  if (member === "shizuka") return "Fairy";
  return "Angel";
}

attribute("tsumugi"); // ❌ Member に存在しない
```

文字列ユニオンは **enum の代わり** によく使います。

## 絞り込みの手段

### typeof
型を調べることができます。

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
プロパティ名の有無を調べられます。

```ts
type UnicornGundam = { hyperMegaRancher: boolean; name: string };
type ΞGundam = { funnelMissile: boolean; name: string };

function describe(gundam: UnicornGundam | ΞGundam) {
  if ("hyperMegaRancher" in gundam) {
    return gundam.hyperMegaRancher;   // gundam: UnicornGundam
  }
  return gundam.funnelMissile;     // gundam: ΞGundam
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
type ExpandBey = { blade: "expand"; bullet: string, mainBody: string };

function isExpand(beyblade: unknown): beyblade is ExpandBey {
  return (
    typeof beyblade === "object" &&
    beyblade !== null &&
    "blade" in beyblade &&
    (beyblade as { blade: unknown }).blade === "expand"
  );
}

const x: unknown = getFromApi();
if (isExpand(x)) {
  x.bullet;  // ✅ x: ExpandBey に絞り込まれている
}
```

`beyblade is ExpandBey` の **`is`** が型ガードの目印です。「`true` を返したら呼び出し元では `beyblade` を `ExpandBey` として扱ってよい」と TS に伝えます。

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

## 演習

### Part A — 写経 + typeof / in による絞り込み

```ts
// 1. typeof で string と number を絞り込む
function format(x: string | number): string {
  if (typeof x === "string") {
    return x.toUpperCase();   // x: string
  }
  return x.toFixed(2);        // x: number
}

console.log(format("hello"));
console.log(format(3.14));

// 2. リテラル型ユニオンと switch
type Member = "mirai" | "shizuka" | "tsubasa";
type Attribute = "Princess" | "Fairy" | "Angel"

function attribute(member: Member): Attribute {
  switch (member) {
    case "mirai": return "Princess";
    case "shizuka": return "Fairy";
    case "tsubasa": return "Angel";
  }
}

// 3. in で絞り込み
type UnicornGundam = { hyperMegaRancher: boolean; name: string };
type ΞGundam = { funnelMissile: boolean; name: string };

function armed(gundam: UnicornGundam | ΞGundam): string {
  if ("hyperMegaRancher" in gundam) {
    return `${gundam.name} hyperMegaRancher`;
  }
  return `${gundam.name} funnelMissile`;
}
```

### Part B — Discriminated Union と網羅性チェック

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
//    → default の never チェックでコンパイルエラーが出ることを確認
//    → area 関数を修正してエラーを解消

// 3. 非同期データ取得の状態を Discriminated Union で表現
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "failure"; error: string };

// FetchState<User> を受け取って表示用の文字列を返す関数
type User = { id: string; name: string };

function render(state: FetchState<User>): string {
  /* TODO: switch + 網羅性チェックで書く
     idle    → "(まだ取得していません)"
     loading → "Loading..."
     success → state.data.name を含む文字列
     failure → state.error を含む文字列
  */
}

// 4. ボタンクリックのイベント型 (Discriminated Union で表現)
type UiEvent =
  | { type: "click"; x: number; y: number }
  | { type: "keypress"; key: string }
  | { type: "scroll"; deltaY: number };

// 上のいずれが来ても安全に処理する関数を書く
function handle(e: UiEvent): string {
  /* TODO */
}
```

### Part C — ユーザー定義型ガード

```ts
// 1. unknown を string[] に絞り込む型ガードを書く
function isStringArray(x: unknown): x is string[] {
  /* TODO */
}

const v: unknown = ["a", "b", "c"];
if (isStringArray(v)) {
  v.forEach((s) => console.log(s.toUpperCase()));  // v: string[]
}

// 2. fetch のレスポンス的な雰囲気の検証
//    json: unknown が { id: string; name: string } の形か検証する型ガードを書く
type UserDto = { id: string; name: string };

function isUserDto(x: unknown): x is UserDto {
  /* TODO */
}
```
