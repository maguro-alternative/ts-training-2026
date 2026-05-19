# 04. ジェネリクス — 演習の答え

## Part A — 写経

- `identity(3000)` → `T = number` に推論される
- `first([1, 2, 3])` → 戻り値 `number | undefined`
- `pair("...", 19)` → 戻り値 `[string, number]`(タプル型)
- `len(42)` のコメントを外すと: `Argument of type 'number' is not assignable to parameter of type '{ length: number }'.`(extends 制約が効いている)

## Part B — 自分で書く

### 1. `last`

```ts
function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}
```

ポイント: 空配列のとき `arr[-1]` ではなく `arr[arr.length - 1] = arr[-1] = undefined` になるので OK。
戻り値型は `first` と同じく `T | undefined`。

### 2. `take`

```ts
function take<T>(arr: T[], n: number): T[] {
  return arr.slice(0, n);
}
```

ポイント: `slice` は元配列を変更しない。 `n` が配列長を超えても安全に動く(全件返す)。

### 3. `pick`

```ts
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

ポイント:
- **`K extends keyof T`**: `key` は `obj` のキーのいずれかに限る
- **`T[K]`**: 「`T` の `K` プロパティの型」を表す **インデックス型**
- これで `pick(jojo, "name")` の戻り値が `string`、 `pick(jojo, "age")` が `number` と **キーごとに型が変わる**
- `pick(jojo, "stand")` は型エラー(`"stand"` は `"name" | "age"` に含まれない)

これが **「型安全なキーアクセス」** の典型例。

### 4. `merge`

```ts
function merge<A, B>(a: A, b: B): A & B {
  return { ...a, ...b };
}
```

ポイント:
- 戻り値 `A & B` は intersection 型(両方のプロパティを持つ)
- ランタイムの `{...a, ...b}` と型の `A & B` が綺麗に対応

**注意**: 同名キーがあった場合、 値は `b` で上書きされるが、 型上は `A & B` のまま(両方の型を持つことになる)。 厳密には不正確だが、 実務ではこれで十分。

### 5. `groupBy`

```ts
function groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  for (const item of items) {
    const groupKey = String(item[key]);
    (result[groupKey] ??= []).push(item);
  }
  return result;
}
```

ポイント:
- `K extends keyof T` で **存在するキーのみ** を許可
- `String(item[key])` でグルーピングキーを文字列化(オブジェクトのキーは結局 string)
- `(result[groupKey] ??= []).push(item)` は **「キーがなければ空配列を作って push」** の慣用句

**より厳密に書くなら**:

```ts
function groupBy<T, K extends keyof T>(
  items: T[],
  key: K,
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const k = String(item[key]);
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}
```

戻り値型を `Record<T[K] & PropertyKey, T[]>` のようにもっと型レベルで縛ることもできる。

## Part C — 任意

### 1. `Promise<T>` の unwrap(伏線)

```ts
type Awaited<T> = T extends Promise<infer U> ? U : T;

type A = Awaited<Promise<number>>;        // number
type B = Awaited<Promise<Promise<string>>>; // Promise<string> (1段だけ)
```

ポイント:
- `infer U` で「`Promise<T>` の中身を取り出す」変数を宣言
- これが **Conditional Types + infer** の典型例
- 実は `Awaited<T>` は TypeScript 標準ユーティリティ型として組み込まれている(再帰的に剥がしてくれる)

### 2. `mymap`

```ts
function mymap<T, U>(arr: T[], fn: (x: T) => U): U[] {
  return arr.map(fn);
}
```

ポイント:
- 型パラメータ2つ: 入力配列の要素型 `T` と、 変換後の要素型 `U`
- `fn: (x: T) => U` で **「変換関数」** の型を表現

### 3. `zip`

```ts
function zip<A, B>(a: A[], b: B[]): [A, B][] {
  const len = Math.min(a.length, b.length);
  const result: [A, B][] = [];
  for (let i = 0; i < len; i++) {
    result.push([a[i], b[i]]);
  }
  return result;
}
```

ポイント:
- 戻り値型 `[A, B][]` は「タプル `[A, B]` の配列」
- 配列長が違うときは **短い方に合わせる**(`Math.min`)のが慣例

別解(`map` 利用):

```ts
function zip<A, B>(a: A[], b: B[]): [A, B][] {
  return a.slice(0, Math.min(a.length, b.length)).map((v, i) => [v, b[i]]);
}
```
