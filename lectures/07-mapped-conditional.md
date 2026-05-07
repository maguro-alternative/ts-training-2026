# 07. Mapped Types と Conditional Types 入門

## ゴール

- Mapped Types を読み書きできる
- Conditional Types を読み書きできる
- `infer` の使い方を知る
- 標準ユーティリティ型がどう作られているかを理解する

ここは **型レベルプログラミング** の入口。難しいので、「読めるようになる」が一旦のゴールです。

## Mapped Types

オブジェクト型のキーをループしながら新しい型を作る記法:

```ts
type User = { id: string; name: string; age: number };

type ReadOnlyUser = {
  readonly [K in keyof User]: User[K];
};
// = { readonly id: string; readonly name: string; readonly age: number }
```

読み方:

- `keyof User` → `"id" | "name" | "age"`
- `[K in keyof User]` → 各キーをループ
- `User[K]` → そのキーに対応する値の型

### Partial を自作する

標準の `Partial<T>` はこう作られています:

```ts
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type DraftUser = MyPartial<User>;
// = { id?: string; name?: string; age?: number }
```

`?` を付けただけ。

### Required を自作する

```ts
type MyRequired<T> = {
  [K in keyof T]-?: T[K];   // -? で ? を取り除く
};
```

### Readonly を自作する

```ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};
```

`-readonly` で取り除くこともできます。

## Conditional Types

「型 A が型 B に代入可能なら X、そうでなければ Y」:

```ts
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;  // true
type B = IsString<42>;       // false
```

### 実用例: NonNullable

```ts
type MyNonNullable<T> = T extends null | undefined ? never : T;

type X = MyNonNullable<string | null>;  // string
```

`extends null | undefined` のとき `never` (= 取り除く)、それ以外はそのまま。

## infer — 型の中身を取り出す

「関数型から戻り値の型を取り出したい」:

```ts
type MyReturnType<F> = F extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: "u1", name: "Taro" };
}

type User = MyReturnType<typeof getUser>;
// = { id: string; name: string }
```

`infer R` は **「ここに当てはまる型を R と呼ぶ」** という宣言。パターンマッチに近い感覚です。

### Parameters を自作

```ts
type MyParameters<F> = F extends (...args: infer A) => any ? A : never;
```

## Mapped + Conditional の組み合わせ

```ts
// オブジェクトから関数のキーだけ取り出す
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type Mixed = {
  name: string;
  age: number;
  greet: () => void;
  save: () => Promise<void>;
};

type Fns = FunctionKeys<Mixed>;
// = "greet" | "save"
```

読み方:

1. `[K in keyof T]: T[K] extends Fn ? K : never` で **値が関数のキーは K、それ以外は never** にマップ
2. `[keyof T]` で値だけ取り出す → `never` は `|` で吸収されて消える

このパターンは標準ライブラリでもよく使われます。

## Template Literal Types

文字列を型レベルで操作する:

```ts
type Greeting = `Hello, ${string}`;

const a: Greeting = "Hello, Taro";   // ✅
const b: Greeting = "Hi";            // ❌

// 組み合わせ
type Color = "red" | "blue";
type Size = "sm" | "lg";
type Class = `${Color}-${Size}`;
// = "red-sm" | "red-lg" | "blue-sm" | "blue-lg"
```

Mapped Types のキーで使うと強力:

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type User = { name: string; age: number };
type UserGetters = Getters<User>;
// = { getName: () => string; getAge: () => number }
```

`Capitalize` も TS 標準のユーティリティ型です (`Lowercase`, `Uppercase`, `Uncapitalize` も)。

## 演習

### Part A — 写経

```ts
type User = { id: string; name: string; age: number };

// 1. MyPartial を写経
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};
type DraftUser = MyPartial<User>;
// = { id?: string; name?: string; age?: number }

// 2. MyReadonly を写経
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};
type FrozenUser = MyReadonly<User>;
// const u: FrozenUser = { id: "u1", name: "Taro", age: 25 };
// u.age = 26;  // ❌ コメントを外して確認

// 3. MyRequired を写経
type WithOptional = { id?: string; name?: string };
type MyRequired<T> = {
  [K in keyof T]-?: T[K];   // -? で ? を取り除く
};
type Strict = MyRequired<WithOptional>;
// = { id: string; name: string }

// 4. 簡単な Conditional Type
type IsString<T> = T extends string ? true : false;
type A = IsString<"hello">;   // true
type B = IsString<42>;        // false
```

### Part B — 自作する

```ts
// 1. Pick を自作する
type MyPick<T, K extends keyof T> = /* TODO */;
type Picked = MyPick<User, "id" | "name">;
// = { id: string; name: string }

// 2. Omit を自作する (ヒント: Exclude<keyof T, K> を使う)
type MyOmit<T, K extends keyof T> = /* TODO */;
type Omitted = MyOmit<User, "age">;
// = { id: string; name: string }

// 3. Nullable<T>: 全プロパティを optional にして null も許容
type Nullable<T> = /* TODO */;
type N = Nullable<{ x: number; y: string }>;
// = { x?: number | null; y?: string | null }

// 4. ReturnType を自作 (infer を使う)
type MyReturnType<F> = F extends (/* TODO */) => /* TODO */ ? /* TODO */ : never;
type R = MyReturnType<() => string>;   // = string

// 5. NonNullable を自作
type MyNonNullable<T> = /* TODO */;
type NN = MyNonNullable<string | null | undefined>;   // = string
```

### Part C — 任意

```ts
// 1. FunctionKeys: 値が関数のキーだけを抜き出す
type FunctionKeys<T> = /* TODO */;

type Mixed = {
  name: string;
  greet: () => void;
  age: number;
  save: () => Promise<void>;
};
type Fns = FunctionKeys<Mixed>;
// = "greet" | "save"

// 2. Template Literal Types で getter 名を生成
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
type UserGetters = Getters<{ name: string; age: number }>;
// = { getName: () => string; getAge: () => number }

// 3. Promise<T> を unwrap
type UnwrapPromise<T> = /* TODO: infer を使う */;
type X = UnwrapPromise<Promise<string>>;   // = string
type Y = UnwrapPromise<number>;            // = number (そのまま)
```

## 講師向けメモ

- ここは **読めるようになることをゴール**にする。書けなくてよい
- `infer` は 1 回見ただけでは絶対わからない。「TS が一番難しい部分の入口」と正直に言う
- 「実務では自分で書くより、ライブラリの型を読むときに役立つ」と用途を明示
- Day 3 課題06 (型パズル) は **任意** にした旨を再確認しておく
- 興味がある人は [type-challenges](https://github.com/type-challenges/type-challenges) を案内
