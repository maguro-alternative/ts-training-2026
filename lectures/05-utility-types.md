# 05. ユーティリティ型

## ゴール

- TS 標準のユーティリティ型を覚えて使える
- 既存の型から派生型を作れる
- ユーティリティ型を組み合わせて使える

## なぜ必要か

実務では「ある型から少しだけ違う型」を作りたくなります:

```ts
type User = {
  id: string;
  name: string;
  email: string;
  age: number;
};

// API 作成時のリクエスト型 (id はサーバーが採番するので不要)
type CreateUserRequest = {
  name: string;
  email: string;
  age: number;
};

// 更新時 (どのフィールドも省略可)
type UpdateUserRequest = {
  name?: string;
  email?: string;
  age?: number;
};
```

これを **手で書くと、`User` を変更したときに同期が取れません**。ユーティリティ型を使うと:

```ts
type CreateUserRequest = Omit<User, "id">;
type UpdateUserRequest = Partial<Omit<User, "id">>;
```

`User` を変えれば自動で派生型も追従します。これが実務で一番効きます。

## 主要なユーティリティ型

### Partial<T> — 全部オプショナルに

```ts
type User = { id: string; name: string; age: number };
type Draft = Partial<User>;
// = { id?: string; name?: string; age?: number }
```

フォームの一時状態、PATCH リクエストでよく使います。

### Required<T> — 全部必須に

```ts
type Config = { host?: string; port?: number };
type StrictConfig = Required<Config>;
// = { host: string; port: number }
```

### Pick<T, K> — 特定キーだけ取り出す

```ts
type User = { id: string; name: string; email: string; age: number };
type UserSummary = Pick<User, "id" | "name">;
// = { id: string; name: string }
```

### Omit<T, K> — 特定キーを除外

```ts
type CreateUser = Omit<User, "id">;
// = { name: string; email: string; age: number }
```

### Record<K, V> — キーと値の型から作る

```ts
type Permission = "read" | "write" | "delete";
type Permissions = Record<Permission, boolean>;
// = { read: boolean; write: boolean; delete: boolean }

type UsersById = Record<string, User>;
// = { [id: string]: User }
```

### ReturnType<F> — 関数の戻り値型を取る

```ts
function getUser() {
  return { id: "u1", name: "Taro" };
}

type User = ReturnType<typeof getUser>;
// = { id: string; name: string }
```

`typeof` と組み合わせるのがポイント。

### Parameters<F> — 関数の引数型を取る

```ts
function greet(name: string, age: number) {}
type Args = Parameters<typeof greet>;
// = [name: string, age: number]
```

### NonNullable<T> — null / undefined を除く

```ts
type Maybe = string | null | undefined;
type Defined = NonNullable<Maybe>;
// = string
```

## 組み合わせて使う

```ts
type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

// 公開用 (パスワードは隠す)
type PublicUser = Omit<User, "password">;

// 更新用 (id 以外はオプショナル)
type UpdateUser = Partial<Omit<User, "id">> & { id: string };

// ID をキーにしたマップ
type UsersById = Record<string, PublicUser>;
```

## 実務でよく見るパターン

### API レスポンス型から表示用の型を作る

```ts
type ApiUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type DisplayUser = Pick<ApiUser, "id" | "name" | "email">;
```

### フォームの input 型を派生

```ts
type CreateUserInput = Omit<ApiUser, "id" | "createdAt" | "updatedAt" | "deletedAt">;
type UpdateUserInput = Partial<CreateUserInput>;
```

## 演習

### Part A — 写経

```ts
type User = { id: string; name: string; age: number };

// Partial: 全部オプショナル
type DraftUser = Partial<User>;
const d1: DraftUser = {};
const d2: DraftUser = { name: "Taro" };

// Pick: 取り出す
type UserName = Pick<User, "id" | "name">;
const u1: UserName = { id: "u1", name: "Taro" };

// Omit: 除外
type UserNoId = Omit<User, "id">;
const u2: UserNoId = { name: "Taro", age: 25 };

// Record: キー → 値のマップ
type UsersById = Record<string, User>;
const map: UsersById = { u1: { id: "u1", name: "Taro", age: 25 } };

// ReturnType: 関数の戻り値型を取る
function makeUser() {
  return { id: "u1", name: "Taro" };
}
type UserReturned = ReturnType<typeof makeUser>;
// = { id: string; name: string }
```

### Part B — Article から派生型を作る

```ts
type Article = {
  id: string;
  title: string;
  body: string;
  authorId: string;
  publishedAt: string;
  tags: string[];
};

// 1. 一覧表示用の型: id, title, authorId のみ
type ArticleListItem = /* TODO */;

// 2. 新規作成リクエスト: id と publishedAt 以外 (それ以外は必須)
type CreateArticleRequest = /* TODO */;

// 3. 更新リクエスト: id は必須 / それ以外はオプショナル
type UpdateArticleRequest = /* TODO */;

// 4. ID から記事を引くマップ型
type ArticlesById = /* TODO */;

// 5. タグ付け状態の型
//    各タグ → boolean のマップ ({ react: true, ts: false, ... })
type Tag = "react" | "vue" | "ts" | "go";
type TagFlags = /* TODO: Record を使う */;
```

### Part C — 任意

```ts
// 1. ReturnType + typeof を活用する
async function fetchUser() {
  return { id: "u1", name: "Taro", age: 25 };
}

type FetchedUser = /* TODO: 上の関数の (await した後の) 戻り値型を取る */;
// ヒント: Awaited<ReturnType<typeof fetchUser>>

// 2. Parameters
function logEvent(user: { id: string }, event: string, payload: unknown) {}
type LogArgs = Parameters<typeof logEvent>;
// = [user: { id: string }, event: string, payload: unknown]

// 3. NonNullable 演習
function getOptionalName(): string | null | undefined {
  return Math.random() > 0.5 ? "Taro" : null;
}
type Name = NonNullable<ReturnType<typeof getOptionalName>>;
// = string
```

## 講師向けメモ

- 全部覚えなくていい。**「こういうのがある」を知って、必要なときにググれる** ことが大事と伝える
- `Pick` と `Omit` の使い分けは「**残したいキーが少ないなら Pick、消したいキーが少ないなら Omit**」
- `ReturnType<typeof fn>` の `typeof` は値から型を取り出すための演算子で、JS の `typeof` (実行時) と別物。これは混乱ポイント
- 次章 (07: Mapped/Conditional) で「これらのユーティリティ型がどう作られているか」を扱うので、興味を引いておく
