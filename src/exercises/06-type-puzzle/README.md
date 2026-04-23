# 課題 06: 型パズル

## 目的
- 関数ではなく **型レベル** で操作を書いてみる
- ユーティリティ型がどう作られているかを理解する
- Mapped Types と Conditional Types の入口に触れる

## 進め方
1. `index.ts` の TODO(型の定義) を埋める
2. 実装コードは書かない (型だけ書く)
3. `npm test 06-type-puzzle` が全て緑になればクリア

## ポイント
- 標準の `Partial` や `Pick` を使ってはいけない。**自作する** のが目的
- Mapped Types: `{ [K in keyof T]: ... }`
- Conditional Types: `T extends U ? X : Y`
- これが書けるようになると、型の世界でのプログラミング感覚がつかめる

## 困ったら
- [type-challenges](https://github.com/type-challenges/type-challenges) の easy 問題を参考にしてよい
- ただし答えを丸ごと写すのではなく、なぜその書き方になるかを理解する
