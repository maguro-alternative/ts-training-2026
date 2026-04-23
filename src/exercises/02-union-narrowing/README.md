# 課題 02: ユニオン型と絞り込み

## 目的
- ユニオン型 (`A | B`) とリテラル型 を使えるようになる
- `typeof` / `in` / ユーザー定義型ガード で型を絞り込める
- Discriminated Union (タグ付きユニオン) を設計できる

## 進め方
1. `index.ts` の TODO を埋める
2. `npm test 02-union-narrowing` が全て緑になればクリア

## ヒント
- `value is string` のような記法を「ユーザー定義型ガード」と呼ぶ
- `switch` + Discriminated Union の組み合わせは必須テクニック
- 網羅性チェックには `never` 型を使う

## 詰まったら
- 「絞り込めない」エラーは、まず **タグプロパティ (`kind`, `type`, `status` など)** があるか確認
- `in` 演算子は プロパティの有無で絞り込める
