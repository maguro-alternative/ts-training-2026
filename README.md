# TypeScript研修 2026 (3日間)

新卒向け TypeScript 研修の教材リポジトリです。
**Day 1〜2 は講義 + ミニ演習**、**Day 3 は演習デー** の3日構成です。

## 前提

- Node.js 20 以上
- VSCode (TypeScript 拡張は標準搭載)
- 何らかの JS/TS の触り経験 (let/const, 関数, オブジェクト, 配列の扱い)

## セットアップ

```bash
npm install
npm run dev
# → http://localhost:5173 を開くと Day 3 の進捗画面が見られます
```

## 章構成

### Day 1 — 型システム基礎

| # | テーマ | 講義 | 演習 |
|---|--------|------|------|
| 00 | オリエンテーション / 環境構築 | 30m | — |
| 01 | 基本型 (プリミティブ / 配列 / 関数) | 40m | 20m |
| 02 | オブジェクト型と型エイリアス | 40m | 25m |
| 03 | ユニオン型と絞り込み (narrowing) | 50m | 30m |

### Day 2 — 抽象化と実務

| # | テーマ | 講義 | 演習 |
|---|--------|------|------|
| 04 | ジェネリクス | 50m | 30m |
| 05 | ユーティリティ型 | 40m | 25m |
| 06 | strict と any との戦い方 | 35m | 25m |
| 07 | Mapped / Conditional Types 入門 | 50m | 30m |
| 08 | 実務パターン (API型・型ガード・Result) | 40m | 30m |

### Day 3 — 演習デー

`src/exercises/` の課題01〜07を解きます。詳細は `INSTRUCTOR.md` を参照。

## ディレクトリ

```
lectures/                  # Day 1〜2 の講義資料
  00-orientation.md
  01-basic-types.md
  02-objects-and-types.md
  03-union-narrowing.md
  04-generics.md
  05-utility-types.md
  06-strict-and-any.md
  07-mapped-conditional.md
  08-real-world-patterns.md
src/exercises/             # Day 3 の演習課題
  01-basic-types/
  02-union-narrowing/
  ...
INSTRUCTOR.md              # 講師向けメモ (受講者には配布しない)
```

## Day 3 演習の進め方

`src/exercises/` 配下のフォルダを **番号順** に進めてください。

各フォルダには:

- `README.md` — 課題の説明
- `index.ts` — あなたが編集するファイル (`any` や TODO を書き換える)
- `index.test.ts` — 自動判定用のテスト (**編集しない**)

### テストを実行

```bash
# 全課題のテストを実行
npm test

# 特定の課題だけ実行 (型チェックも該当課題のみ)
npm test -- 01-basic-types

# 編集するたびに自動実行 (おすすめ)
npm run test:watch
```

`npm test` を実行すると `public/test-results.json` が更新され、
ブラウザの進捗画面 (`npm run dev`) にも反映されます。

## ルール (Day 3)

- **`any` の使用は禁止** (Day 2-06 で学んだ通り)
- **`// @ts-ignore` / `// @ts-expect-error` で型エラーを握りつぶさない**
  (テストファイル内の `@ts-expect-error` は判定用なので触らない)
- **テストファイルは編集しない** (仕様書として読むのは OK)
- **分からなくても5分は自力で考える**。その後で講師やペアに質問する

## 課題一覧 (Day 3)

| # | テーマ | 難易度 | 必須/任意 |
|---|--------|--------|----------|
| 01 | 基本型を付ける | ★☆☆ | 必須 |
| 02 | ユニオン型と絞り込み | ★★☆ | 必須 |
| 03 | ジェネリクス | ★★☆ | 必須 |
| 04 | ユーティリティ型 | ★★☆ | 必須 |
| 05 | `any` リファクタリング | ★★☆ | 必須 |
| 06 | 型パズル | ★★★ | 任意 (ストレッチ) |
| 07 | API レスポンスの型付け | ★★★ | 必須 |
| 08 | 状態遷移と Mapped Types | ★★★ | 任意 (ストレッチ) |

## 困ったときは

1. まず `npm test -- <課題名>` のエラーメッセージを **最後まで読む**
2. 課題フォルダの `README.md` のヒントを見直す
3. Day 1〜2 の `lectures/*.md` を見直す
4. ペアの人に相談する
5. それでもダメなら講師へ

型エラーメッセージは慣れが必要です。「読めない」ではなく「読む練習をする」と思ってください。
