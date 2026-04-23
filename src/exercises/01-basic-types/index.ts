// 課題 01: 基本型を付ける
//
// `any` と書かれている箇所を適切な型に置き換えてください。
// `npm test 01-basic-types` が全て緑になればクリアです。

// ------------------------------------------------------------
// 1. 2つの数値を足す
// ------------------------------------------------------------
// TODO: any を適切な型に置き換える
export function add(a: any, b: any): any {
  return a + b;
}

// ------------------------------------------------------------
// 2. 文字列を大文字にする
// ------------------------------------------------------------
export function toUpper(s: any): any {
  return s.toUpperCase();
}

// ------------------------------------------------------------
// 3. User 型を定義し、挨拶文を返す
// ------------------------------------------------------------
// TODO: User は { name: string; age: number } を持つ型にする
export type User = any;

export function greet(user: User): string {
  return `Hello, ${user.name}! You are ${user.age} years old.`;
}

// ------------------------------------------------------------
// 4. 数値配列の平均
// ------------------------------------------------------------
// ヒント: 空配列のときは 0 を返すので、引数の型・戻り値の型・reduce の引数型に注意
export function average(numbers: any): any {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a: any, b: any) => a + b, 0) / numbers.length;
}

// ------------------------------------------------------------
// 5. オプショナルプロパティ
// ------------------------------------------------------------
// Product は name(必須) と price(必須) を持ち、description は あってもなくても良い。
// TODO: Product 型を定義する
export type Product = any;

// 商品の表示名を返す関数。description があれば "name — description"、なければ name だけ。
export function formatProduct(p: Product): string {
  return p.description ? `${p.name} — ${p.description}` : p.name;
}
