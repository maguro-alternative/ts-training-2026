// 課題 08: ストレッチ課題 (任意)

// ------------------------------------------------------------
// 1. Capitalize した Getter 名に変換する
// ------------------------------------------------------------
// 例:
//   type User = { name: string; age: number }
//   GetterOf<User> = { getName: () => string; getAge: () => number }
//
// TODO: Mapped Types のキー変換 (`as`) + Template Literal Types を使う
export type GetterOf<T> = any;

// ------------------------------------------------------------
// 2. 状態遷移を型で守る
// ------------------------------------------------------------
// AsyncState は非同期処理の状態を表す。以下の 4状態を Discriminated Union で表現する。
//   - idle    : 何も起きていない
//   - loading : 読み込み中
//   - success : 成功 (data を持つ)
//   - failure : 失敗 (error を持つ)
//
// TODO: ジェネリクスで data と error の型を受け取る
//       AsyncState<User, string> のような使い方ができるようにする
export type AsyncState<TData, TError> = any;

// ------------------------------------------------------------
// 3. 関数から戻り値を取り出すユーティリティ
// ------------------------------------------------------------
// TS 標準の ReturnType と同等。ただし自作。
// 例: MyReturnType<() => string> -> string
// TODO: Conditional Types で関数を分解する
export type MyReturnType<F> = any;
