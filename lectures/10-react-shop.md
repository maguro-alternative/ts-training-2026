# 10. Reactで同じアプリを作り直そう

TypeScript と DOM API だけで、商品検索とカートの動くアプリを作りきってもらいました。
そのアプリをReactという別のアプローチで作り直します。


## ゴール

- React の JSX / state / 再描画モデル が、午前のアプリの何を解決するかを理解する
- 「React は道具のひとつ」として、 vanilla との トレードオフを自分の言葉で言える

## 講義
スライドにて

---

### Hello World

完成形の雛形は `templates/10-react-shop/` に用意してあります。
一旦セットアップしてみましょう。

```bash
cp -R templates/10-react-shop ~/work/react-shop
cd ~/work/react-shop
npm install
npm run dev
```

`http://localhost:5173` で `React Shop` というタイトルだけが見えればOK。

```tsx
// src/App.tsx
function App() {
  return <h1 className="text-xl font-bold p-4">React Shop</h1>;
}

export default App;
```

ReactはJSXと呼ばれる構文でマークアップを行います。JSの中にHTMLを書くことができるのです。
`src/App.tsx`はAppという関数がJSXを返す定義をしています。一般的にこれをコンポーネントと呼び、アプリケーションの部品としての管理の単位となります。

---

### Step 3: 静的JSXで商品カード1枚を書く

ハードコードでまず1枚だけ。

```tsx
function App() {
  return (
    <div>
      <header className="flex items-center gap-4 px-4 py-2 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-bold">React Shop</h1>
      </header>
      <main className="p-4">
        <div className="border border-gray-200 rounded-md p-2 flex flex-col gap-1 bg-white max-w-[200px]">
          <img src="https://placehold.co/128x128?text=クッション" alt="クッション" className="w-32 h-32 mx-auto" />
          <h3>クッション</h3>
          <p>¥1200</p>
          <button className="mt-auto bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm">
            カートに追加
          </button>
        </div>
      </main>
    </div>
  );
}
```

✅ **ここまでで動くもの**: 商品カード1枚が表示される
🆚 **vanilla との比較**:
- vanilla: `document.createElement("div")` → `card.className = "..."` → `card.appendChild(img)` ... と数十行
- React: JSXでHTML同様に書ける

---

### Step 4: 静的JSXで8枚並べる(コピペ8回)

`<main>` 内のグリッドを作って、商品カードを **8回コピペ** で並べます(あえて map は使わない)。

```tsx
<main className="p-4">
  <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
    <div className="border border-gray-200 rounded-md p-2 flex flex-col gap-1 bg-white">
      <img src="https://placehold.co/128x128?text=クッション" alt="クッション" className="w-32 h-32 mx-auto" />
      <h3>クッション</h3>
      <p>¥1200</p>
      <button className="mt-auto bg-blue-500 ...">カートに追加</button>
    </div>
    <div className="...">マグカップ ...</div>
    {/* ... 残り6個コピペ */}
  </div>
</main>
```

✅ **ここまでで動くもの**: 8商品が並んで表示される

---

### Step 5: ProductCard コンポーネントに切り出す(props なし)

8回コピペした塊をひとまず関数にまとめます(まだ props なし、中身ハードコード):

```tsx
function ProductCard() {
  return (
    <div className="border border-gray-200 rounded-md p-2 flex flex-col gap-1 bg-white">
      <img src="https://placehold.co/128x128?text=クッション" alt="クッション" className="w-32 h-32 mx-auto" />
      <h3>クッション</h3>
      <p>¥1200</p>
      <button className="mt-auto bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm">
        カートに追加
      </button>
    </div>
  );
}

function App() {
  return (
    <div>
      <header className="...">...</header>
      <main className="p-4">
        <div className="grid ...">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </main>
    </div>
  );
}
```

✅ **ここまでで動くもの**: まだ全部「クッション ¥1200」で同じ。**コンポーネントの存在** が分かる
🆚 **vanilla との比較**:
- vanilla: 「商品カード生成関数」を作っても、戻り値は DOM ノード
- React: **コンポーネント = JSX を返す関数**。シンプルで合成しやすい

📝 **学ぶこと**: コンポーネント名は **大文字始まり** にする(`<productCard />` だとHTMLタグ扱いになる)

---

### Step 6: 式埋め込み + props で商品データを渡す

ハードコードを props で外から受け取るように変える:

```tsx
type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border border-gray-200 rounded-md p-2 flex flex-col gap-1 bg-white">
      <img src={product.imageUrl} alt={product.name} className="w-32 h-32 mx-auto" />
      <h3>{product.name}</h3>
      <p>¥{product.price}</p>
      <button className="mt-auto bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm">
        カートに追加
      </button>
    </div>
  );
}

function App() {
  return (
    <div>
      <header className="...">...</header>
      <main className="p-4">
        <div className="grid ...">
          <ProductCard product={{ id: "p01", name: "クッション", price: 1200, imageUrl: "https://placehold.co/128x128?text=クッション" }} />
          <ProductCard product={{ id: "p02", name: "マグカップ", price: 800, imageUrl: "https://placehold.co/128x128?text=マグカップ" }} />
          {/* ... */}
        </div>
      </main>
    </div>
  );
}
```

✅ **ここまでで動くもの**: 各商品に異なる名前と価格が表示される
🆚 **vanilla との比較**:
- vanilla: `card.querySelector("h3").textContent = name` のように毎回 querySelector
- React: `{product.name}` と書くだけで埋め込まれる

📝 **学ぶこと**:
- JSX の中の `{}` は **JSの式を埋め込む記法**
- `props` は **オブジェクトとして1つ受け取り、 destructuring で取り出す** のが一般的

---

### Step 7: 繰り返し — products を map() で並べる

午前の vanilla 版の `src/products.ts` をそのまま React 版にもコピー(完全に同じものでOK)。

```tsx
import { products } from "./products";

function App() {
  return (
    <div>
      <header className="...">...</header>
      <main className="p-4">
        <div className="grid ...">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
```

✅ **ここまでで動くもの**: Step 4 と見た目は同じだが、**コードは8回コピペが消えてスッキリ**
🆚 **vanilla との比較**:
- vanilla: `for (const p of products) { const card = createCard(p); root.appendChild(card); }`
- React: `products.map((p) => <ProductCard ... />)`

⚠️ **重要**: `key={product.id}` を忘れると React の警告が出る。 **リストの各要素には一意な `key` を付ける**

---

### Step 8: 条件分岐 — 商品0件の表示

検索ボックスはまだ無いですが、 「商品0件のときの表示」をまず仕込みます:

```tsx
<main className="p-4">
  {products.length === 0 ? (
    <p className="text-gray-500">該当する商品がありません</p>
  ) : (
    <div className="grid ...">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )}
</main>
```

✅ **ここまでで動くもの**: `products` を一時的に `[]` にすると空メッセージが出る
🆚 **vanilla との比較**:
- vanilla: `if (filtered.length === 0) { root.textContent = "..."; return; }` で早期 return
- React: **JSX内に三項演算子 (`? :`)** で条件分岐できる

📝 **学ぶこと**:
- `条件 && <JSX/>` は「`true` のときだけ表示」
- `条件 ? <A/> : <B/>` は「どちらかを表示」

---

### Step 9: useState 導入 — 検索ボックス

ここで初めて **state** が登場します。

```tsx
import { useState } from "react";
import { products } from "./products";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <header className="flex items-center gap-4 px-4 py-2 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-bold shrink-0">React Shop</h1>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="商品を検索"
          className="flex-1 px-3 py-1.5 border border-gray-300 rounded"
        />
      </header>
      <main className="p-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500">該当する商品がありません</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

✅ **ここまでで動くもの**: 検索ボックスでリアルタイムフィルタが効く 🎉
🆚 **vanilla との比較**:
- vanilla: `addEventListener("input", ...)` → state変数を更新 → **`render()` を手動で呼ぶ**
- React: `setSearchQuery` を呼ぶだけで **自動再描画**

🎯 **ここが今日の山場**: **「state を変えるだけで再描画される」** Reactの再描画モデルを初めて体感する瞬間。
午前のvanilla実装で書いた「state更新→render()呼び出し」のセットが消えていることに注目してください。

📝 **学ぶこと**:
- `const [値, セッター] = useState(初期値)` は **配列分割代入**
- `<input value={...} onChange={...} />` の組み合わせで **制御コンポーネント** にする

---

### Step 10: useState — カート、合計金額、バッジ数の派生計算

カートの state を追加し、合計やバッジの数字は **state から計算する** だけにします。

```tsx
type Cart = Record<string, number>;

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<Cart>({});

  // ↓ state から「派生値」を計算するだけ。中間変数でOK
  const cartCount = Object.values(cart).reduce((sum, q) => sum + q, 0);

  return (
    <div>
      <header className="...">
        ...
        <button className="px-3 py-1.5 hover:bg-gray-100 rounded">
          🛒
          <span className="inline-block bg-red-500 text-white rounded-full px-1.5 text-xs font-bold align-middle">
            {cartCount}
          </span>
        </button>
      </header>
      ...
    </div>
  );
}
```

✅ **ここまでで動くもの**: ヘッダーにバッジが出る(まだ常に 0)
🆚 **vanilla との比較**:
- vanilla: `renderCartBadge()` という関数を作り、 cart更新の度に呼んでいた
- React: **cartが変わると勝手にバッジが再計算される**(派生値はrender関数の中でただ計算するだけ)

📝 **学ぶこと**: state から計算できる値は **state にしない**(`useState` で持たない)。普通の変数で十分

---

### Step 11: イベント処理 — カート追加・数量変更・削除

子コンポーネントに **関数を props で渡す** パターン:

```tsx
function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (productId: string) => void;
}) {
  return (
    <div className="...">
      <img ... />
      <h3>{product.name}</h3>
      <p>¥{product.price}</p>
      <button
        onClick={() => onAddToCart(product.id)}
        className="mt-auto bg-blue-500 ..."
      >
        カートに追加
      </button>
    </div>
  );
}

function App() {
  const [cart, setCart] = useState<Cart>({});

  // immutable に更新する!
  const addToCart = (productId: string) => {
    setCart({ ...cart, [productId]: (cart[productId] ?? 0) + 1 });
  };

  return (
    <div>
      ...
      {filtered.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={addToCart}
        />
      ))}
      ...
    </div>
  );
}
```

カート画面表示の切替・数量変更・削除も同様に実装:

```tsx
const [view, setView] = useState<"products" | "cart">("products");

const setQuantity = (productId: string, qty: number) => {
  if (qty <= 0) {
    const { [productId]: _, ...rest } = cart;
    setCart(rest);
  } else {
    setCart({ ...cart, [productId]: qty });
  }
};
```

✅ **ここまでで動くもの**: カートに商品追加・数量変更・削除ができ、 **バッジ・合計金額が全部自動同期** する
🆚 **vanilla との比較**:
- vanilla: ボタン押下 → state変更 → `render()` で全画面再描画 → イベントリスナー貼り直し
- React: `setCart` を呼ぶだけで全部追随する

⚠️ **絶対やってはいけない**:
- ❌ `cart[id] = qty;` (state を直接書き換え → 再描画されない)
- ✅ `setCart({ ...cart, [id]: qty });` (新しいオブジェクトを作る = immutable 更新)

---

### Step 12: コンポーネント分割の整理

ここまで `App.tsx` に詰め込んだ JSX を、責務ごとに分けます。

```
src/
  App.tsx               # state を持つトップレベル
  components/
    Header.tsx          # 検索ボックス + カートバッジ
    SearchBox.tsx       # (Headerに含めても良い)
    ProductList.tsx     # 商品一覧グリッド
    ProductCard.tsx     # 商品カード1枚
    CartView.tsx        # カート画面
    CartRow.tsx         # カート1行
  products.ts
  types.ts
  index.css
  main.tsx
```

各コンポーネントには **「必要な値だけ」 props で渡す**:

```tsx
function Header({
  searchQuery,
  onSearchChange,
  cartCount,
  onToggleView,
}: {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  onToggleView: () => void;
}) {
  return (
    <header className="...">
      <h1 className="...">React Shop</h1>
      <input value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} ... />
      <button onClick={onToggleView}>🛒 <span>{cartCount}</span></button>
    </header>
  );
}
```

✅ **ここまでで動くもの**: 機能は変わらず、コードが整理されている
🆚 **vanilla との比較**:
- vanilla: `render.ts` / `events.ts` / `state.ts` でファイル分割
- React: **「見た目」「props」「内部state」がコンポーネントごとに1ファイルにまとまる**

📝 **学ぶこと**:
- 「state を **どのコンポーネントに置くか** 」が設計の中心(state lifting)
- 子に渡すのは **値** と **値を変える関数** の2種類

## よく詰まるポイント(講師がヒントを出す箇所)

- **「リストに `key` を付けて」警告**: `map` のJSXに `key={product.id}` を付ける
- **`onChange` で TypeScript エラー**: `e.target.value` の型が分からないとき → `React.ChangeEvent<HTMLInputElement>` を見せる(深入りしない)
- **state を直接書き換えてしまう**: `cart[id] = qty` ではなく `setCart({ ...cart, [id]: qty })` が必要
- **ボタンクリックで何も起きない**: `onClick={handleClick()}` と書いてしまう(即時実行されてしまう)→ `onClick={handleClick}`

## 動作確認チェックリスト(React)

午前の vanilla と完全に同じ機能になっているか同じチェックリストで確認します。

- [ ] 検索ワードを変えるとリアルタイムで結果が変わる
- [ ] 商品をカートに追加するとヘッダーのバッジ数が増える
- [ ] カート画面に追加した商品が出る
- [ ] 数量を変えると合計が更新される
- [ ] 数量を 0 にすると行が消える
- [ ] 検索結果が0件のとき適切なメッセージが出る

## 持ち帰り課題: API連携(今日はやらない)

> 今日の研修では商品データを `import { products } from "./products"` で **静的にimport** していますが、
> 実際のWebアプリケーションではサーバーから fetch で商品データを取ってくるのが普通です。
>
> Reactでは **`useEffect`** という機能を使って「コンポーネントが描画された後」に fetch を呼ぶのが定番のパターンです。
> 例えば:
>
> ```tsx
> const [products, setProducts] = useState<Product[]>([]);
>
> useEffect(() => {
>   fetch("/api/products")
>     .then((r) => r.json())
>     .then(setProducts);
> }, []);
> ```
>
> 興味があれば、研修後に [React 公式の "Synchronizing with Effects"](https://react.dev/learn/synchronizing-with-effects) を読んで、
> 「商品データをAPIから取ってくる + ローディング中は『読み込み中…』を出す」
> を自分で実装してみてください。
>
> ※ 後述する localStorage 永続化も同じく `useEffect` を使う題材です。

## 拡張機能フェーズ(16:30–17:30)

両実装に同じ機能を追加して、**所要時間と差分の大きさ** を比較します。

### 追加要件

> 商品カードに ★ ボタンを追加し、★を付けた商品の絞り込みフィルタを実装してください。
> お気に入りはページをリロードしても残るように localStorage に永続化してください。

### 想定される差

| | vanilla | React |
|---|---|---|
| 状態の追加 | `let favorites: Set<string>` をモジュールに | `useState<Set<string>>(new Set())` |
| ★ボタンの描画 | 既存の商品カード生成関数を改修 | `<FavoriteButton>` を JSX に追加 |
| お気に入りトグル | リスナー追加 + cart の再描画関数を呼び直す | `setFavorites(...)` するだけ |
| フィルタ | 既存の検索フィルタ関数を改修 | `products.filter(...)` に条件1つ追加 |
| localStorage 同期 | 全変更箇所で `localStorage.setItem` を呼ぶ | `useEffect(() => localStorage.setItem(...), [favorites])` 1箇所 |
| 既存機能との衝突 | **再描画タイミングの調整でほぼ確実にバグる** | ほぼ起きない |

体感的には **30分以上 vs 5〜10分** くらいの差が出るはずです。

## 振り返り(17:00–17:30)

以下を全員で共有します:

- vanilla で一番つらかった瞬間はどこか
- React に移行したときに「これは楽だ」と思った瞬間はどこか
- React で逆に分かりにくかった概念はあるか(state の immutable 更新など)
- 「実務で使いたいか」の率直な感想

## 講師向けメモ

- 午前で詰まらせきっていることが午後の体感の前提。詰まりが浅い受講者には Step 9 の感動が薄い
- 午前で書いた vanilla コードを **ブラウザのタブで開きっぱなしにしてもらう** と、12ステップごとに比較しやすい
- React の概念は **JSX / state / 再描画の3点だけに絞る**。`useEffect` まで踏み込むと午後が破綻する(localStorage で必要になるが、そこだけ最低限のお手本コードを渡してOK)
- 「Cart の型を `Record` にするか配列にするか」「派生値を `useMemo` でメモ化するか」は議論を呼ぶので、振り返りタイムで扱う
- 拡張機能フェーズで vanilla の人が泥沼になりすぎたら、「Reactで先に動かしてみる」に切り替えてもよい(差を体感することが目的なので、両方完成させる必要はない)
- React 完成サンプルを講師の手元に用意しておく(受講者には見せず、解説用)
