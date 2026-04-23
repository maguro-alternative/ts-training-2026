// 課題 07: APIレスポンスの型付け
// 詳細は README.md を参照

// ------------------------------------------------------------
// 型定義
// ------------------------------------------------------------
// TODO: Book 型を定義する
//   - id: string
//   - title: string
//   - author: string
export type Book = any;

// TODO: SearchResponse 型を Discriminated Union で定義する
//   - 成功       : { status: "success"; books: Book[] }
//   - 入力エラー : { status: "error"; errorType: "validation"; message: string }
//   - サーバー   : { status: "error"; errorType: "server";     message: string; retryAfter: number }
export type SearchResponse = any;

// ------------------------------------------------------------
// 実装
// ------------------------------------------------------------

// 成功なら books、エラーなら空配列を返す
export function extractBooks(res: SearchResponse): Book[] {
  // TODO: status で絞り込んで実装
  throw new Error('Not implemented');
}

// server エラーのときだけ true。それ以外は false。
export function shouldRetry(res: SearchResponse): boolean {
  // TODO: status と errorType の2段で絞り込む
  throw new Error('Not implemented');
}

// server エラーなら retryAfter (秒数) を、それ以外は null を返す
export function getRetryAfter(res: SearchResponse): number | null {
  // TODO: 正しく絞り込めていれば retryAfter にアクセスできるはず
  throw new Error('Not implemented');
}
