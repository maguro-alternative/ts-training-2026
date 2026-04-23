# 課題 04: ユーティリティ型

## 目的
- TS標準のユーティリティ型 (`Partial`, `Pick`, `Omit`, `Required`, `Record`, `ReturnType`) を使える
- ユーティリティ型を組み合わせて既存の型から新しい型を派生させる

## 進め方
1. `index.ts` の TODO を埋める
2. `npm test 04-utility-types` が全て緑になればクリア

## 覚えておくと便利な対応表
| 用途 | ユーティリティ型 |
|------|----------------|
| 全プロパティをオプショナルに | `Partial<T>` |
| 全プロパティを必須に | `Required<T>` |
| 特定のキーだけ取り出す | `Pick<T, K>` |
| 特定のキーを除外する | `Omit<T, K>` |
| キー → 値 のマップ型 | `Record<K, V>` |
| 関数の戻り値型を取る | `ReturnType<F>` |
| 関数の引数型を取る | `Parameters<F>` |
