# 課題 08: ストレッチ課題 (任意)

## 目的
- 早く終わった人向け。必須ではない
- Mapped Types のキー変換、Template Literal Types、Conditional Types の応用に触れる
- 実務でも遭遇する「状態遷移の型安全」を体験する

## 進め方
1. `index.ts` の TODO を埋める
2. `npm test 08-stretch` が全て緑になればクリア

## テーマ
- `GetterOf<T>`: オブジェクトの各プロパティを `getXxx()` 関数に変換する型
- Template Literal Types + Mapped Types の組み合わせ
- 状態遷移を型で守る (例: `idle → loading → success/failure`)

## 参考
- [TypeScript 公式: Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [TypeScript 公式: Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
