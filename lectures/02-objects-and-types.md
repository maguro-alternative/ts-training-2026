# 02. オブジェクト型と型エイリアス

> Day 1 午前 / 講義 10 分 + 演習 60 分 / 対応する Day3 課題: 01
>
> **Workshop スタイル**: 講義は概念とライブコーディング 10 分。
> 残りは演習しながら必要な箇所をこのドキュメントで参照。

## ゴール

- オブジェクトの型を `type` で書ける
- `interface` との違いを説明できる
- `?` (オプショナル) と `readonly` を使い分けられる
- 型の **合成** (`&`, `extends`) ができる

## オブジェクト型のインライン記法

JavaScript のオブジェクト `{ name: "Chihaya Kisaragi", age: 16 }` に対して、その型は **「プロパティ名」と「各プロパティの型」のペア** を `{ name: string; age: number }` のように書きます。

このオブジェクト型を、変数や関数引数の型注釈にそのまま埋め込めます (= インライン記法):

```ts
function greet(user: { name: string; age: number }): string {
  return `Hello, ${user.name} (${user.age})`;
}
```

これでも動きますが、再利用しづらい。**名前を付けたい** ときは `type` を使います。

## type エイリアス

```ts
type User = {
  name: string;
  age: number;
};

function greet(user: User): string {
  return `Hello, ${user.name} (${user.age})`;
}
```

## interface との違い

```ts
interface User {
  name: string;
  age: number;
}
```

`type` と `interface` の違いは:

| | `type` | `interface` |
|---|--------|-------------|
| オブジェクト型 | ✅ | ✅ |
| ユニオン型 (`A \| B`) | ✅ | ❌ |
| プリミティブのエイリアス | ✅ | ❌ |
| 宣言マージ | ❌ | ✅ |

実務の使い分け:

- **オブジェクト型**: どちらでも良い。チームの好みに合わせる
- **ユニオン型 / 関数型 / プリミティブのエイリアス**: `type` 一択
- **ライブラリの型を拡張する**: `interface` (declaration merging)

このリポジトリでは **`type` で統一** します。

## オプショナルプロパティ `?`

```ts
type Product = {
  name: string;
  price: number;
  description?: string;   // あってもなくてもよい
};

const a: Product = { name: "Book", price: 1000 };               // ✅
const b: Product = { name: "Book", price: 1000, description: "A novel" };  // ✅
```

ここで出てくる `string | undefined` は **ユニオン型** という記法で、「`string` または `undefined` のどちらか」という意味です(ユニオン型は別章で詳しく扱います)。

一見 `description?: string` と `description: string | undefined` は同じに見えます。実際 **ほぼ同じ** ですが、微妙に違います:

```ts
type WithOptional = { x?: number };       // x を省略してよい
type WithUndefined = { x: number | undefined };  // x は必ず書く (undefined でよい)

const a: WithOptional = {};                // ✅
const b: WithUndefined = {};               // ❌ x がない
const c: WithUndefined = { x: undefined }; // ✅
```

実務では基本 `?` を使います。

## readonly

```ts
type Config = {
  readonly host: string;
  readonly port: number;
};

const c: Config = { host: "localhost", port: 8080 };
c.host = "example.com";   // ❌ readonly
```

不変にしたい設定値や、変更されてはマズいオブジェクトに付けます。

`readonly` 配列もあります:

```ts
const ids: readonly number[] = [1, 2, 3];
ids.push(4);  // ❌
```

## ネストしたオブジェクト

```ts
type Address = {
  city: string;
  zip: string;
};

type User = {
  name: string;
  address: Address;        // 別の型を参照
  tags: string[];          // 配列
  scores: { math: number; english: number };  // インライン
};
```

## 型の合成

### & (intersection: すべて持つ)

```ts
type WithName = { name: string };
type WithAge = { age: number };

type Person = WithName & WithAge;
// = { name: string; age: number }
```

### interface の extends

```ts
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}
// Dog = { name: string; breed: string }
```

## 演習 (60 分)

### Part A — 写経 (15 分)

```ts
// 1. User 型を定義して関数の引数に使う
type User = {
  name: string;
  age: number;
};

function greet(user: User): string {
  return `Hello, ${user.name}!`;
}

console.log(greet({ name: "Taro", age: 25 }));

// 2. オプショナルを試す
type Profile = {
  name: string;
  bio?: string;       // ← オプショナル
};

const p1: Profile = { name: "Taro" };                       // ✅
const p2: Profile = { name: "Taro", bio: "Hello" };         // ✅
// const p3: Profile = { bio: "Hello" };                    // ❌ name 必須

// 3. readonly を試す
type Point = {
  readonly x: number;
  readonly y: number;
};

const pt: Point = { x: 0, y: 0 };
// pt.x = 10;   // ❌ コメントを外してエラーを確認
```

### Part B — 型を設計する (35 分)

```ts
// 1. 商品型を定義
//    - id: 必須、変更不可 (readonly)
//    - name: 必須
//    - price: 必須
//    - description: あってもなくてもよい
//    - tags: あってもなくてもよい (string[])
type Product = /* TODO */;

const p: Product = {
  id: "p1",
  name: "Book",
  price: 1000,
};

// 2. 注文型を定義 (Product をネストする)
//    - id: 必須、readonly
//    - items: { product: Product; quantity: number }[]
//    - shippingAddress: あってもなくてもよい (city/zip を持つオブジェクト)
type Order = /* TODO */;

// 3. ユーザー型を 2つ作って、& で合成する
type WithName = /* TODO */;          // { name: string }
type WithEmail = /* TODO */;         // { email: string }
type Contact = WithName & WithEmail; // 両方を持つ型

const c: Contact = { name: "Taro", email: "taro@example.com" };

// 4. 関数の引数・戻り値に上記の型を使う
function totalPrice(order: Order): number {
  /* TODO: 全アイテムの (price * quantity) の合計を返す */
}
```

### Part C — 任意

```ts
// 1. type と interface 両方で User を定義し、合成・拡張の差を確認
type UserT = { name: string };
type AdminT = UserT & { role: "admin" };

interface UserI { name: string }
interface AdminI extends UserI { role: "admin" }

// 同じ型になる。ただし interface は同名で再宣言するとマージされる:
interface UserI { age: number }    // ← UserI に age が追加される
const u: UserI = { name: "Taro", age: 25 };  // ✅

// 2. インデックス署名 (任意の文字列キーを許容する型) を試す
type Dict = {
  [key: string]: number;
};
const scores: Dict = { math: 80, english: 90 };
scores.science = 75;   // ✅
```

## 講師向けメモ

- `type` vs `interface` 論争は時間を吸われるので「このリポジトリでは `type` で統一」と早めに切り上げる
- `?` と `T | undefined` の違いは strict 設定によっては挙動が変わるので **本リポジトリの strict 設定で動かして見せる**
- ネスト型のところで「実務だと API レスポンスがネスト10層とかある」と予告して Day2 の API型 章へ繋げる
