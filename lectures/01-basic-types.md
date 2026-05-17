# 01. 基本型

## ゴール

- プリミティブ型 / 配列 / タプル を書き分けられる
- 関数の引数・戻り値に型を付けられる
- `let` / `const` で **型推論** がどう変わるかを理解する

## プリミティブ型

```ts
const name: string = "Chihaya Kisaragi";
const age: number = 16;
const isIdol: boolean = true;
const nothing: null = null;
const notYet: undefined = undefined;
```

実務では明示的に書かず、**推論に任せる** ことが多いです:

```ts
const name = "Chihaya Kisaragi";    // 推論: string
let age = 16;                       // 推論: number
```

ただし「初期値はないが型は決めたい」ときは明示します:

```ts
let name: string;      // まだ未代入
name = "Chihaya Kisaragi";
```

## let と const の推論差

```ts
const center = "mirai";   // 推論: "mirai" (リテラル型)
let back = "shizuka";    // 推論: string
```

- `const` は値が変わらないので **リテラル型** に推論される
- `let` は再代入される前提なので **広い型 (string)** に推論される

これは後で出てくる **ユニオン型** と組み合わせて重要になります。

## 配列とタプル

```ts
const ids: number[] = [1, 2, 3];
const names: Array<string> = ["Haruka Amami", "Chihaya Kisaragi"];   // 別の書き方

// タプル: 長さと型を固定
const point: [number, number] = [10, 20];
const entry: [string, number] = ["Chihaya Kisaragi", 16];
```

`number[]` と `[number, number]` の違い:

```ts
const a: number[] = [1, 2];
a.push(3);          // ✅
const b: [number, number] = [1, 2];
b.push(3);          // ⚠️ TS は通すことがある (push は弱い)
const [x, y, z] = b; // ❌ z は存在しない (長さ2)
```

## 関数の型

```ts
function add(a: number, b: number): number {
  return a + b;
}

// アロー関数
const mul = (a: number, b: number): number => a * b;

// 戻り値型は推論されるので省略可 (明示することが推奨されてる)
const sub = (a: number, b: number) => a - b;  // 推論: number
```

### void と never

```ts
function log(msg: string): void {
  console.log(msg);
  // 戻り値を使わない関数
}

function fail(msg: string): never {
  throw new Error(msg);
  // 「決して戻らない」関数
}
```

`never` は  **網羅性チェック** で詳細を話します。

## any と unknown

```ts
let x: any;       // 何でも入る + 何にでも代入できる (危険)
let y: unknown;   // 何でも入る + 使う前に絞り込みが必要 (安全)

x.toUpperCase();  // ✅ 通る (が、実行時に落ちるかも)
y.toUpperCase();  // ❌ 'unknown' なので使えない

if (typeof y === "string") {
  y.toUpperCase();  // ✅ 絞り込み済みなので OK
}
```

- `any` は 「型チェックを諦める」 = TS をやる意味がない
- 外部から来るデータは `unknown` で受けて、検証してから使う

## 演習

### Part A — 写経 + 動作確認

ファイル: 任意の `.ts` ファイル (`scratch.ts` など作って試してください)

```ts
// 1. プリミティブ型を実際に書いて、エラーになるパターンも試す
const name: string = "Chihaya Kisaragi";
const age: number = 16;

// const age: number = "16";   // ❌ コメントを外して何が起きるか確認
// const flag: boolean = 0;    // ❌

// 2. 型推論を確認 (VSCode で変数にホバー)
const n = 42;                 // ホバー → ?
let m = 42;                   // ホバー → ?
const t = "eternal harmony";  // ホバー → ?
let s = "my song";            // ホバー → ?

// 3. 関数の引数・戻り値型
function add(a: number, b: number): number {
  return a + b;
}
console.log(add(1, 2));
```

### Part B — 自分で型を付ける

```ts
// 1. 文字列を受け取って大文字にして返す関数
function shout(/* TODO */) {
  return s.toUpperCase() + "!";
}

// 2. 数値配列の最大値を返す関数 (空配列なら undefined)
function max(/* TODO */) {
  if (numbers.length === 0) return undefined;
  return Math.max(...numbers);
}

// 3. 数値配列を受け取り、偶数だけの配列を返す関数
function evens(/* TODO */) {
  return numbers.filter((n) => n % 2 === 0);
}

// 4. 名前と年齢を受け取って "Chihaya Kisaragi (16)" 形式の文字列を返す関数
function format(/* TODO */) {
  return `${name} (${age})`;
}

// 5. ユーザー名の配列から、最初のユーザーの名前を返す関数 (空配列なら "anonymous")
function firstName(/* TODO */) {
  return names[0] ?? "anonymous";
}
```

ヒント:
- 戻り値の型が `T | undefined` になる場面を意識する
- `string[]` と `Array<string>` はどちらでもよい

### Part C — 任意 (早く終わったら)

```ts
// 1. 何でも受け取れる log 関数を書きたい。any を使わずに書けるか?
//    (ヒント: unknown と型ガード、または ジェネリクス。今日は触りだけ)
function log(/* TODO */) {
  /* TODO */
}

// 2. 関数の引数・戻り値の型 を 「型エイリアス」 で表現してみる
type BinaryOp = /* TODO */;
const add2: BinaryOp = (a, b) => a + b;
const mul2: BinaryOp = (a, b) => a * b;
```

ヒント:
- 関数型は `(引数名: 型, ...) => 戻り値の型` の形で書ける
- `add2` / `mul2` の中身を見て、引数と戻り値が何になるか考える
