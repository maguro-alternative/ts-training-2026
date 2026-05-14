# 00. オリエンテーション

## ゴール

- 環境構築を完了する (Node 20+, VSCode, リポジトリ clone)
- TypeScript を「なぜやるのか」を腹落ちさせる

## TypeScriptの歴史
ここが詳しいので一緒に軽くみましょう。

https://typescriptbook.jp/overview/before-typescript

## なぜ TypeScript か

「JS でも動くじゃん」と思うかもしれません。実例を見ます。

```js
// 割引する関数
function calcDiscount(user, price) {
  if (user.tier == "gold") return price * 0.9;
  return price;
}

// 呼び出し側
calcDiscount({ tear: "gold" }, 1000); // typo: tear → 値引きされない
```

JS では `user.tear` が `undefined` でもエラーにならず、本番に出てから「なんか割引されない」と発覚します。

TS なら:

```ts
type User = { tier: "gold" | "silver" | "bronze" };
function calcDiscount(user: User, price: number) {
  if (user.tier === "gold") return price * 0.9;
  return price;
}

calcDiscount({ tear: "gold" }, 1000); // ❌ 'tear' は User に存在しません
```

書いた瞬間に IDE が赤線を引きます。**「実行する前にバグを潰す」** これが TS の価値です。

## TS の立ち位置

```
書いた TS コード ──[tsc]──▶ JS コード ──▶ ブラウザ/Node が実行
              型チェック           ↑
                                実行時には型情報は消える
```

ポイント:

- 型は **コンパイル時の道具**。実行時には消える
- だから「型で書いたものが実行時にも検査される」とは思わないこと
- 外部から来るデータ (API レスポンスなど) は **実行時の検証** が別途必要 (別途扱います)

## 環境チェック

```bash
node -v   # v20.x.x 以上
npm -v
git --version
code --version  # VSCode CLI
```

VSCode に以下があると便利:

- **TypeScript and JavaScript Language Features** (標準で入っている)
- **Error Lens** (型エラーを行に直接表示)

## 今日のリポジトリを clone

```bash
git clone <このリポジトリ>
cd ts-training-2026
npm install
npm run dev
# → http://localhost:5173 が開けば OK
```

## 進め方のルール

- 講義中はとにかく **手元で写経** してみる。読むだけで理解した気にならない
- 詰まったら 5 分は自分で考える、その後で隣の人 → 講師
- Day 3 の演習で `any` を使うのは禁止。Day 1〜2 でその意味を理解してください

## 講師向けメモ

- ここで時間を使いすぎない (30 分厳守)
- 「型は実行時に消える」だけは確実に強調しておく。これを忘れると Day 2 の API型 / 検証で混乱する
- 環境構築で詰まる人が出るので、隣の人とペアを組んでもらう
- 「3日間頑張ろう」のテンションをここで作る
