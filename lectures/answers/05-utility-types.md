# 05. ユーティリティ型 — 演習の答え

## Part A — 写経

- `DraftUser = Partial<User>` → `{ id?: string; name?: string; age?: number }`
- `UserName = Pick<User, "id" | "name">` → `{ id: string; name: string }`
- `UserNoId = Omit<User, "id">` → `{ name: string; age: number }`
- `UserReturned = ReturnType<typeof makeUser>` → `{ id: string; name: string }`
  - **`typeof makeUser`** で **関数の型** を取り、 `ReturnType` で戻り値型を取る、 という2段構えに注目

## Part B — `Article` から派生型を作る

```ts
type Article = {
  id: string;
  title: string;
  body: string;
  authorId: string;
  publishedAt: string;
  tags: string[];
};
```

### 1. `ArticleListItem`(一覧表示用: id, title, authorId のみ)

```ts
type ArticleListItem = Pick<Article, "id" | "title" | "authorId">;
```

ポイント: 「**取り出す** ものを列挙する」のが `Pick`。 

### 2. `CreateArticleRequest`(id, publishedAt 以外、それ以外必須)

```ts
type CreateArticleRequest = Omit<Article, "id" | "publishedAt">;
```

ポイント: 「**除外する** ものを列挙する」のが `Omit`。 サーバーが採番する `id` や `publishedAt` を取り除いた **リクエストボディの型** として典型的なパターン。

### 3. `UpdateArticleRequest`(id 必須、それ以外オプショナル)

```ts
type UpdateArticleRequest = Pick<Article, "id"> & Partial<Omit<Article, "id">>;
```

ポイント:
- `id` だけ取り出す: `Pick<Article, "id">`
- 残りはオプショナル化: `Partial<Omit<Article, "id">>`
- 両方持つ型: `&`(intersection)で合成

別解として `id` を `Required<...>` で再度必須化する書き方もあるが、 上の書き方が一番読みやすい。

### 4. `ArticlesById`(ID → Article のマップ)

```ts
type ArticlesById = Record<string, Article>;
```

ポイント: `Record<キーの型, 値の型>` は **「キーをこの型のいずれかにして、値をこの型にする」** マップ型。

### 5. `TagFlags`(各タグ → boolean)

```ts
type TagFlags = Record<Tag, boolean>;
// = { react: boolean; vue: boolean; ts: boolean; go: boolean }
```

ポイント:
- キーに **リテラル型ユニオン** を渡すと、 そのリテラルが網羅された型になる
- `Record<string, boolean>` と書くと「任意の文字列キー」になってしまうので、 ユニオンを渡すことで **取りうるキーが固定** される

## Part C — 任意

### 1. `fetchUser` の戻り値型

```ts
type FetchedUser = Awaited<ReturnType<typeof fetchUser>>;
// = { id: string; name: string; age: number }
```

ポイント:
- `typeof fetchUser` → 関数の型: `() => Promise<{ id: string; name: string; age: number }>`
- `ReturnType<...>` → `Promise<{ id: string; name: string; age: number }>`
- `Awaited<...>` → `Promise` の中身を剥がして `{ id: string; name: string; age: number }`

API クライアント関数の戻り値型から、 表示側のコンポーネント props 型を **自動派生** できる。
手で `type User = { ... }` を二重定義しなくて済む。

### 2. `Parameters`

```ts
type LogArgs = Parameters<typeof logEvent>;
// = [user: { id: string }, event: string, payload: unknown]
```

ポイント:
- 戻り値は **タプル型**(配列ではない)
- 「ある関数の引数列をまとめて別の関数に渡したい」ときに使う(高階関数やデコレータ)

### 3. `NonNullable`

```ts
type Name = NonNullable<ReturnType<typeof getOptionalName>>;
// = string
```

ポイント:
- `getOptionalName` の戻り値型は `string | null | undefined`
- `NonNullable<T>` は `T` から `null` と `undefined` を除去
- 結果は `string` のみ
