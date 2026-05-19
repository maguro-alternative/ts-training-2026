# 07. Mapped / Conditional Types 入門 — 演習の答え

## Part A — 写経

- `MyPartial<User>` をホバーすると `{ id?: string; name?: string; age?: number }` と展開して見える
- `MyReadonly<User>` → `u.age = 26;` のコメントを外すと `Cannot assign to 'age' because it is a read-only property.`
- `MyRequired<{ id?: string; name?: string }>` → `{ id: string; name: string }`(`-?` で `?` を剥がす)
- `IsString<"hello">` は `true`、 `IsString<42>` は `false`(Conditional の基本)

## Part B — 自作する

### 1. `MyPick`

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type Picked = MyPick<User, "id" | "name">;
// = { id: string; name: string }
```

ポイント:
- ループは **`K` 側** を回す(`keyof T` 全体ではない)
- `K extends keyof T` で「`T` に存在するキーのみ」を保証

### 2. `MyOmit`

```ts
type MyOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};

type Omitted = MyOmit<User, "age">;
// = { id: string; name: string }
```

ポイント:
- `Exclude<keyof T, K>` で **「`T` のキーから `K` を除いた残り」** を取る
- ループはその残りに対して回す

### 3. `Nullable`

```ts
type Nullable<T> = {
  [K in keyof T]?: T[K] | null;
};

type N = Nullable<{ x: number; y: string }>;
// = { x?: number | null; y?: string | null }
```

ポイント:
- **`?`** でオプショナル化
- **`T[K] | null`** で `null` も許容
- `Partial` と組み合わせて派生型を作る練習

### 4. `MyReturnType`

```ts
type MyReturnType<F> = F extends (...args: any[]) => infer R ? R : never;

type R = MyReturnType<() => string>;   // = string
type R2 = MyReturnType<(a: number, b: number) => boolean>;   // = boolean
```

ポイント:
- **`(...args: any[]) => infer R`** — 引数は何でもよく、 戻り値の型を `R` に推論
- 関数ではない型が渡されたら `never` で弾く
- これが **`infer`** の典型例

### 5. `MyNonNullable`

```ts
type MyNonNullable<T> = T extends null | undefined ? never : T;

type NN = MyNonNullable<string | null | undefined>;
// = string
```

ポイント:
- ユニオン型に Conditional を適用すると **各メンバーに分配** される(distributive conditional types)
- `string | null | undefined` → 各要素について `extends null | undefined` を判定 → `null`/`undefined` だけ `never` になって消える

## Part C — 任意

### 1. `FunctionKeys`

```ts
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type Fns = FunctionKeys<Mixed>;
// = "greet" | "save"
```

ポイント:
- **「Mapped で各キーに値を割り当て、 最後に `[keyof T]` でユニオン化」** という慣用句
- 値が関数なら `K`(キー自身)、 違えば `never` を割り当てる
- 最後の `[keyof T]` で全プロパティ値を取り出し、 `never` は消えて関数キーのみのユニオンが残る

これを応用すると `NumericKeys<T>` や `StringKeys<T>` も同様に書ける(06 章の `sumByKey` 厳密版で使った形)。

### 2. Template Literal Types で `getter` 名を生成(写経)

- `Getters<{ name: string; age: number }>` → `{ getName: () => string; getAge: () => number }`
- **`as` 句**(`[K in keyof T as ...]`)が **キーのリマッピング**
- **`Capitalize<string & K>`** で頭文字を大文字化(Template Literal の組み込みユーティリティ)
- `string & K` は「`K` が `string` 型のリテラル**でもある**」ことを表す(`keyof T` には symbol も含まれうるための絞り込み)

### 3. `UnwrapPromise`

```ts
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type X = UnwrapPromise<Promise<string>>;   // = string
type Y = UnwrapPromise<number>;            // = number
type Z = UnwrapPromise<Promise<Promise<boolean>>>;  // = Promise<boolean> (1段だけ)
```

ポイント:
- `Promise<infer U>` で「`Promise` の中身」を `U` として取り出す
- Promise でないなら `T` そのまま返す
- **再帰的に剥がしたい場合** は組み込みの `Awaited<T>` を使うとよい(`Awaited<Promise<Promise<boolean>>>` → `boolean`)
