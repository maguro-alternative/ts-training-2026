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

`main.tsx`で上記のコンポーネントの呼び出し、root要素にコンポーネントの内容を書き出すようになっています。。`index.html`上で`main.tsx`を呼び出しているためここにレンダリングされる形でHTMLとして表示されているのです。

---

### JSXで商品カード1枚を書く
`App.tsx`を以下のように書き換えてみましょう。

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

書き換えた後ページを見ると「クッション」の項目が作成されていると思います。
HTMLと同様に書くことができますが、あくまでもJSなので文法を間違えるとエラーが表示されます。
HTMLとの主な違いとしてJSX では必ず開始タグと終了タグのセットか空要素のどちらでなければいけません。

以下の文法だとページ上でエラーが表示されるので確かめてみてください。

```tsx
function App() {
  return (
    <div>
      <p>開始タグのみ
    </div>
  );
}
```

```tsx
function App() {
  return (
    <p>開始タグ</p>
    <p>終了タグ</p>
  );
}
```

---

### JSXで商品カードを8枚並べる

次に商品の項目を追加します。
09の時と同じ商品を`App.tsx`に書いてみましょう。

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

---

### ProductCard コンポーネントに切り出す

商品が表示されるようになりました。
しかしApp関数が返すJSXが長くなってきました。こういうときはコンポーネントとして分割を行います。
JSX内に別のコンポーネントを書くことでHTMLのように階層化をすることができます。
`src/App.tsx`に新たに`ProductCard`コンポーネントを作成してみましょう。

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

階層としてAppの配下にProductCardのコンポーネントが追加されました。
これらはそれぞれ親コンポーネント、子コンポーネントと呼ばれます。
可読性だけでなく、コンポーネントの役割もわかりやすくなりました。

---

### 式埋め込み + props で商品データを渡す

JSXは式を埋め込むことができます。
渡される値によって表示する内容を変更することが可能です。

商品カードは「商品名」「値段」「画像url」の要素を変更することで使いまわすことが可能です。
これらを引き渡すコンポーネントを作成してみましょう。

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
`ProductCard`に変数を引き渡すことで商品カードをコンポーネントとして使いまわすことが可能になりました。
また式なので、JSXを返す前に演算を行ったり、JSX内で式を組むことも可能です。

```tsx
function Sum() {
  const a = 6;
  const b = 7;
  return (
    <p>
      {a} + {b} = {a + b}
    </p>
  );
}
```

---

### products を map() で並べる

コンポーネントに分離して可読性は上がりましたがまだ冗長です。
データごとに繰り返して表示する方式を取るため、mapで繰り返してコンポーネントを表示する様にしましょう。
09の`src/products.ts`を持ってきて以下の様に書き換えましょう。

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

---

### 条件分岐 — 商品0件の表示

現在商品は`products.ts`で定義していますが、実際だとAPIでの取得がメインになります。
そうなってくると「商品0件のときの表示」というものも考慮する必要が出てきます。
条件分岐を使うことによって表示を切り替えることができます。以下のように`src/App.tsx`を書き換えてみましょう。

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

商品が0件の時「該当する商品がありません」と表示される様になりました。
試しに`src/products.ts`の中身を以下の様に書き換えてみてください。

```tsx
import type { Product } from "./types";

export const products: Product[] = [];
```

---

### 検索ボックス

ある程度体制が整って来たので、ロジックの追加に入ります。
まず検索のロジックを追加します。

検索ボックスに文字を入力するたびに商品の絞り込みを行います。
それによって画面の更新を行うため、React側で検索する文字列の状態を管理する必要があります。

状態を扱うためには`useState`関数を使います。`src/App.tsx`を以下の様に書き換えてみてください。

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

検索ボックスに文字を入力するたびに商品の表示が変わる様になったはずです。
`useState`の引数は状態の初期値を表します。今回は空文字なので""を入れてます。
戻り値はそれぞれ状態の値とそれを変更する関数です。
この状態が変更するたびにReact側が変更される箇所を自動で検知して、画面が更新されます。
検索ボックスの`onChange`に`setSearchQuery`があり、ここに入力された値が入ることによって状態が更新されます。

---

### カート、合計金額、バッジ数の派生計算

管理する状態を増やします。
カート、合計金額の2つを追加します。

カートのstateを追加し、合計やバッジの数字はstateから計算するだけにします。

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

カートの項目が追加されました。

---

### イベント処理 — カート追加・数量変更・削除

ここまでで表示は組み上がりましたが、まだ商品の「カートに追加」ボタンを押しても何も起きません。
ユーザーの操作で state を更新するロジックを足していきます。

カートに商品の追加、削除を行うロジックを追加しましょう。

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

これでボタンを押すたびに、 子の `ProductCard` から `onAddToCart(product.id)` が呼ばれ、 親の `addToCart` が走って `cart` state が更新されます。

#### 数量変更と削除

「カート画面で数量を変える」「数量を 0 にしたら自動で消す」も同じパターンで実装できます。

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

---

### コンポーネント分割の整理

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

各コンポーネントには「必要な値だけ」 propsで渡す様にします。

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

## よく詰まるポイント
- **「リストに `key` を付けて」警告**: `map` のJSXに `key={product.id}` を付ける
- **`onChange` で TypeScript エラー**: `e.target.value` の型が分からないとき → `React.ChangeEvent<HTMLInputElement>`を調べる
- **state を直接書き換えてしまう**: `cart[id] = qty` ではなく `setCart({ ...cart, [id]: qty })` が必要
- **ボタンクリックで何も起きない**: `onClick={handleClick()}` と書いてしまう(即時実行されてしまう)→ `onClick={handleClick}`

## 動作確認チェックリスト(React)

想定した動作になっているかのチェックリストです。

- [ ] 検索ワードを変えるとリアルタイムで結果が変わる
- [ ] 商品をカートに追加するとヘッダーのバッジ数が増える
- [ ] カート画面に追加した商品が出る
- [ ] 数量を変えると合計が更新される
- [ ] 数量を 0 にすると行が消える
- [ ] 検索結果が0件のとき適切なメッセージが出る

## 小話: API連携

> 今日の研修では商品データを `import { products } from "./products"` で **静的にimport** していますが、
> 実際のWebアプリケーションではサーバーから fetch で商品データを取ってくるのが普通です。
>
> Reactでは `useEffect` という機能を使って「コンポーネントが描画された後」に fetch を呼ぶことが基本です。
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
> ※ 現時点ではあまり推奨されない方式です。

> 少し試してみたい人向けに、 実際に外部 API を叩いて画像を差し替える例を載せます。
> [Dog CEO API](https://dog.ceo/dog-api/) は犬の画像をフリーで返してくれます。
> 
> 今回は **柴犬のランダム画像** を商品数(8件)分だけ取ってきて、 `placehold.co` のプレースホルダー画像と差し替えてみます。
> 
> API の仕様
> 
> ```
> GET https://dog.ceo/api/breed/shiba/images/random/8
> ```
> 
> レスポンス:
> 
> ```json
> {
>   "message": [
>     "https://images.dog.ceo/breeds/shiba/shiba-XXXX.jpg",
>     "https://images.dog.ceo/breeds/shiba/shiba-YYYY.jpg",
>     ... 全部で8件
>   ],
>   "status": "success"
> }
> ```
> 
> `{8}` の部分を変えれば任意の枚数取れます。

