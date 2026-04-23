// 課題 05: any リファクタリング
//
// このファイルには `any` が大量にあります。
// 全ての `any` を具体的な型に置き換えてください。
// ロジックは変えないで OK (型だけを直す)。

// ------------------------------------------------------------
// 1. 買い物カゴの合計金額を計算する
// ------------------------------------------------------------
// TODO: CartItem 型を定義して any を置き換える
//       name: string, price: number, quantity: number
export type CartItem = any;

export function totalPrice(items: any): any {
  return items.reduce((sum: any, item: any) => sum + item.price * item.quantity, 0);
}

// ------------------------------------------------------------
// 2. ユーザー一覧から成人だけを抽出
// ------------------------------------------------------------
// TODO: Person 型を定義
//       name: string, age: number
export type Person = any;

export function adultsOnly(people: any): any {
  return people.filter((p: any) => p.age >= 18);
}

// ------------------------------------------------------------
// 3. イベントハンドラを登録する汎用関数
// ------------------------------------------------------------
// TODO: ジェネリクスを使い、callback の引数の型が payload の型と一致するようにする
type EventMap = {
  click: { x: number; y: number };
  keypress: { key: string };
  scroll: { delta: number };
};

export function on(eventName: any, callback: any): void {
  // 実装は仮 (型だけが評価対象)
  void eventName;
  void callback;
}

// ------------------------------------------------------------
// 4. 外部 JSON を安全に読む
// ------------------------------------------------------------
// サーバーから受け取った JSON を検証して number を取り出す。
// parsed の型は「何が来るか分からない」ので、any ではなく別の型にすべき。
// TODO: parsed の型を unknown にし、型ガードで narrowing する
export function parseCount(json: string): number {
  const parsed: any = JSON.parse(json);
  if (
    parsed &&
    typeof parsed === 'object' &&
    'count' in parsed &&
    typeof parsed.count === 'number'
  ) {
    return parsed.count;
  }
  return 0;
}
