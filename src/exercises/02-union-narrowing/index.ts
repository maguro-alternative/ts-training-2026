// 課題 02: ユニオン型と絞り込み (narrowing)

// ------------------------------------------------------------
// 1. リテラル型のユニオン
// ------------------------------------------------------------
// TODO: Theme を "light" | "dark" | "auto" のリテラルユニオン型にする
export type Theme = any;

// 受け取った Theme から背景色を返す。
// "auto" の場合は "system" を返すこと。
export function bgFor(theme: Theme): string {
  // TODO: switch で絞り込みつつ、各ケースで対応する色名を返す
  // "light"  -> "white"
  // "dark"   -> "black"
  // "auto"   -> "system"
  // 全パターンを扱わないとコンパイルエラーになるよう、網羅性チェックを入れる
  throw new Error('Not implemented');
}

// ------------------------------------------------------------
// 2. typeof による絞り込み
// ------------------------------------------------------------
// string か number が渡ってくる。string ならそのまま、number なら文字列化して返す。
export function stringify(value: string | number): string {
  // TODO: typeof で絞り込んで実装する
  throw new Error('Not implemented');
}

// ------------------------------------------------------------
// 3. ユーザー定義型ガード
// ------------------------------------------------------------
export type Cat = { name: string; purrs: boolean };
export type Dog = { name: string; barks: boolean };

// TODO: animal が Cat であることを判定する型ガード関数を書く
//       戻り値の型は `animal is Cat` にする
export function isCat(animal: Cat | Dog): any {
  throw new Error('Not implemented');
}

// ------------------------------------------------------------
// 4. Discriminated Union
// ------------------------------------------------------------
// HTTPリクエストの結果を表す型。
// 成功は data を持ち、失敗は errorCode を持つ。
// どちらにも共通で requestedAt を持つ。
//
// TODO: Result 型を Discriminated Union で定義する
//   - 成功: { status: "ok"; data: string; requestedAt: number }
//   - 失敗: { status: "error"; errorCode: number; requestedAt: number }
export type Result = any;

// 成功なら data を返し、失敗なら `error:${errorCode}` を返す
export function formatResult(r: Result): string {
  // TODO: status で絞り込む
  throw new Error('Not implemented');
}
