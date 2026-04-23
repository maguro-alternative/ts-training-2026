# 課題 07: APIレスポンスの型付け

## 目的
- 実務頻出パターン「外部APIのJSONをTSの型で表現する」を体験する
- Discriminated Union で複数のレスポンスパターンを安全に扱う
- `unknown` + 型ガードで外部データを検証する入口を作る

## 背景
架空の書籍検索APIがあります。このAPIは以下 **3パターン** のいずれかを返します。

### 成功時
```json
{
  "status": "success",
  "books": [
    { "id": "b1", "title": "TypeScript入門", "author": "山田" }
  ]
}
```

### 入力エラー時 (クエリが不正)
```json
{
  "status": "error",
  "errorType": "validation",
  "message": "query is required"
}
```

### サーバーエラー時 (リトライして欲しい)
```json
{
  "status": "error",
  "errorType": "server",
  "message": "internal server error",
  "retryAfter": 30
}
```

`retryAfter` は **server エラーのときだけ** 存在します。

## やること
1. `Book` 型を定義する
2. `SearchResponse` 型を **Discriminated Union** で定義する
3. `extractBooks`: 成功なら books、失敗なら空配列を返す
4. `shouldRetry`: server エラーのときだけ true
5. `getRetryAfter`: server エラーならその秒数を、それ以外なら null

## ポイント
- `status` だけでは error の 2種類を区別できない → **タグを2段** にする必要あり
- 型の絞り込みで `retryAfter` にアクセスできるか確認する
- 絞り込みができていないと `retryAfter` の型エラーが出るはず

## 詰まったら
- 「errorType まで見ないと retryAfter があるか分からない」のがヒント
- ユニオンの各バリアントを別 `type` にしてから `|` で合成する設計も一手
