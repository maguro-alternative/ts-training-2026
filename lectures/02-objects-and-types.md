# 02. オブジェクト型と型エイリアス

> Day 1 午前 / 講義 40 分 + ミニ演習 25 分 / 対応する Day3 課題: 01

## ゴール

- オブジェクトの型を `type` で書ける
- `interface` との違いを説明できる
- `?` (オプショナル) と `readonly` を使い分けられる
- 型の **合成** (`&`, `extends`) ができる

## オブジェクト型のインライン記法

```ts
function greet(user: { name: string; age: number }): string {
  return `Hello, ${user.name}`;
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
  return `Hello, ${user.name}`;
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

`description?: string` は `string | undefined` と **ほぼ同じ** ですが、微妙に違います:

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

## ミニ演習 (25 分)

```ts
// 1. 商品型を定義してください
//    - id: 必須、変更不可
//    - name: 必須
//    - price: 必須
//    - tags: あってもなくてもよい (string[])
type Product = /* TODO */;

// 2. 商品から表示用の型を派生させてください
//    - id, name, price のみ持つ (tags はない)
//    手で書いてもよいし、Day2 で習うユーティリティ型を予習してもよい
type ProductSummary = /* TODO */;

// 3. 以下のオブジェクトが Product に合致するか確認
const p: Product = {
  id: "p1",
  name: "Book",
  price: 1000,
};
```

## 講師向けメモ

- `type` vs `interface` 論争は時間を吸われるので「このリポジトリでは `type` で統一」と早めに切り上げる
- `?` と `T | undefined` の違いは strict 設定によっては挙動が変わるので **本リポジトリの strict 設定で動かして見せる**
- ネスト型のところで「実務だと API レスポンスがネスト10層とかある」と予告して Day2 の API型 章へ繋げる
