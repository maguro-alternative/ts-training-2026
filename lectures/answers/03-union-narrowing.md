# 03. ユニオン型と絞り込み — 演習の答え

## Part A — 写経

- **typeof による絞り込み**: `if` の中で型が `string` に絞られ、 `x.toUpperCase()` が補完される。 `if` の外では `number` 側に絞られる
- **switch のリテラル絞り込み**: `Member` の3パターンすべてに `case` を書けば `switch` の戻り値型が `Attribute` に揃う。 1つでも書き忘れると **戻り値型エラー**(または網羅性チェックで `never` エラー)が出る
- **`in` 演算子**: `"hyperMegaRancher" in gundam` が true なら `UnicornGundam` 側に絞られる

## Part B — Discriminated Union と網羅性チェック

### 1. `area`

```ts
function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    case "rectangle":
      return shape.width * shape.height;
    default:
      // ここに到達することはあり得ない (型レベルで保証)
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

ポイント:
- `switch (shape.kind)` で **タグ(discriminator)** で分岐
- `default` ブランチで `const _exhaustive: never = shape;` を書くと、 `Shape` に新しいケースが増えたとき **コンパイルエラー**でブロックされる(網羅性チェック)
- 「ここを通過することはあり得ない」を **型で保証する** のがポイント

### 2. `triangle` を追加したらどうなるか

`Shape` に `{ kind: "triangle"; base: number; height: number }` を追加すると、 `default` ブランチで以下のエラー:

```
Type '{ kind: "triangle"; base: number; height: number }' is not assignable to type 'never'.
```

`area` を修正する:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

型定義を増やしたら、 **実装側でケース漏れがコンパイルエラーで分かる**。
これが「型で守る」ということ。

### 3. `render(FetchState<User>)`

```ts
function render(state: FetchState<User>): string {
  switch (state.status) {
    case "idle":
      return "(まだ取得していません)";
    case "loading":
      return "Loading...";
    case "success":
      return `Welcome, ${state.data.name}`;
    case "failure":
      return `Error: ${state.error}`;
    default:
      const _exhaustive: never = state;
      return _exhaustive;
  }
}
```

ポイント:
- ジェネリクス `T = User` でも分岐ロジックは変わらない
- `success` の中だけ `state.data` にアクセスできる(他のケースには `data` がない)
- 後で `status: "cancelled"` などを追加したくなったら、 `never` チェックが教えてくれる

### 4. `handle(UiEvent)`

```ts
function handle(e: UiEvent): string {
  switch (e.type) {
    case "click":
      return `clicked at (${e.x}, ${e.y})`;
    case "keypress":
      return `pressed ${e.key}`;
    case "scroll":
      return `scrolled by ${e.deltaY}`;
    default:
      const _exhaustive: never = e;
      return _exhaustive;
  }
}
```

タグキーが `kind` でも `status` でも `type` でも何でもOK。 **判別子のキー名は自由**。
ただしチームで揃えるなら `kind` か `type` が多い。

## Part C — ユーザー定義型ガード

### 1. `isStringArray`

```ts
function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((item) => typeof item === "string");
}
```

ポイント:
- 戻り値型 `x is string[]` が **ユーザー定義型ガード** の宣言
- 関数が `true` を返したとき、呼び出し側で `x` が `string[]` に絞られる
- `Array.isArray(x)` だけだと `x: any[]` までしか絞れない → `every` で中身もチェック

**よくある間違い**:

```ts
function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x);   // ❌ 中身の検証がない (number[] でも true になる)
}
```

### 2. `isUserDto`

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

ポイント:
- `typeof x === "object" && x !== null` → `null` も `object` なので除外
- `"id" in x && "name" in x` → プロパティ存在チェック(これで `x` が `{ id: unknown; name: unknown }` 相当まで絞られる)
- 最後に **各プロパティの型** までチェック

**実務での補足**:

手書きの型ガードはここまで書くのが面倒なので、 実務では [Zod](https://zod.dev) や [Valibot](https://valibot.dev) のような **バリデーションライブラリ** を使うのが普通:

```ts
import { z } from "zod";

const UserDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const result = UserDtoSchema.safeParse(x);
if (result.success) {
  // result.data: UserDto
}
```
