# 09. ショッピングアプリ (Vanilla TypeScript) — 演習の答え

雛形の TODO を埋める形で実装します。 完成版の参考実装は本ページに全部載せています。

## `src/state.ts` — 状態更新の答え

```ts
import type { Cart, View } from "./types";

export let searchQuery = "";
export let cart: Cart = {};
export let currentView: View = "products";

export function setSearchQuery(q: string): void {
  searchQuery = q;
}

export function addToCart(productId: string): void {
  if (cart[productId]) {
    cart[productId] += 1;
  } else {
    cart[productId] = 1;
  }
}

export function setQuantity(productId: string, qty: number): void {
  if (qty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = qty;
  }
}

export function removeFromCart(productId: string): void {
  delete cart[productId];
}

export function toggleView(): void {
  currentView = currentView === "products" ? "cart" : "products";
}
```

ポイント:
- `addToCart` は **既存数量に +1**(雛形では `setQuantity(productId, 1)` を呼んでしまうと「既にカートに 2 個あるのに 1 に戻る」バグの温床)
- `setQuantity` で **`qty <= 0` を削除条件に** まとめてしまうと、 後で UI 側から「削除ボタン」と「数量0入力」のどちらでも同じ挙動になる(`removeFromCart` を呼んでも良いし、 `setQuantity(id, 0)` でも消える)

## `src/render.ts` — 描画の答え

```ts
import { products } from "./products";
import { searchQuery, cart, currentView } from "./state";

export function render(): void {
  renderCartBadge();
  const main = document.getElementById("main")!;
  if (currentView === "products") {
    renderProductList(main);
  } else {
    renderCartView(main);
  }
}

function renderProductList(root: HTMLElement): void {
  root.innerHTML = "";

  const q = searchQuery.toLowerCase();
  const filtered = products.filter((p) => p.name.toLowerCase().includes(q));

  if (filtered.length === 0) {
    root.textContent = "該当する商品がありません";
    return;
  }

  const grid = document.createElement("div");
  grid.className = "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3";

  for (const product of filtered) {
    const card = document.createElement("div");
    card.className = "border border-gray-200 rounded-md p-2 flex flex-col gap-1 bg-white";

    const img = document.createElement("img");
    img.src = product.imageUrl;
    img.alt = product.name;
    img.className = "w-32 h-32 mx-auto";
    card.appendChild(img);

    const name = document.createElement("h3");
    name.textContent = product.name;
    card.appendChild(name);

    const price = document.createElement("p");
    price.textContent = `¥${product.price}`;
    card.appendChild(price);

    const button = document.createElement("button");
    button.textContent = "カートに追加";
    button.className = "mt-auto bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm";
    button.dataset.action = "add-to-cart";
    button.dataset.productId = product.id;
    card.appendChild(button);

    grid.appendChild(card);
  }
  root.appendChild(grid);
}

function renderCartView(root: HTMLElement): void {
  root.innerHTML = "";

  const cartItems = Object.entries(cart);
  if (cartItems.length === 0) {
    root.textContent = "カートは空です";
    return;
  }

  let total = 0;
  for (const [productId, qty] of cartItems) {
    const product = products.find((p) => p.id === productId);
    if (!product) continue;

    const row = document.createElement("div");
    row.className = "flex items-center gap-3 py-2 border-b border-gray-100";

    const name = document.createElement("span");
    name.textContent = product.name;
    row.appendChild(name);

    const price = document.createElement("span");
    price.textContent = `¥${product.price}`;
    row.appendChild(price);

    const input = document.createElement("input");
    input.type = "number";
    input.value = String(qty);
    input.min = "0";
    input.className = "w-16 px-2 py-1 border border-gray-300 rounded";
    input.dataset.action = "set-quantity";
    input.dataset.productId = product.id;
    row.appendChild(input);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "削除";
    removeBtn.className = "text-red-500 hover:text-red-700 text-sm";
    removeBtn.dataset.action = "remove-from-cart";
    removeBtn.dataset.productId = product.id;
    row.appendChild(removeBtn);

    root.appendChild(row);
    total += product.price * qty;
  }

  const totalRow = document.createElement("div");
  totalRow.className = "font-bold mt-4 text-right text-lg";
  totalRow.textContent = `合計: ¥${total}`;
  root.appendChild(totalRow);
}

function renderCartBadge(): void {
  const badge = document.getElementById("cart-badge")!;
  const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  badge.textContent = String(count);
}
```

ポイント:
- **`render()` の中で `renderCartBadge()` を毎回呼ぶ** → どの画面に居てもバッジが正しい
- **`root.innerHTML = ""`** で前回のDOMを全部消してから描画(イベントリスナーごと吹き飛ぶ)
- **`data-action` / `data-productId`** をDOMに埋めておく → events.ts 側で **event delegation** で拾える
- **検索は大文字小文字を吸収**(`toLowerCase()` で揃える)
- **カートに無効な `productId` が残っていても落ちない**(`find` で `undefined` なら `continue`)

## `src/events.ts` — イベント処理の答え

```ts
import { addToCart, removeFromCart, setQuantity, setSearchQuery, toggleView } from "./state";
import { render } from "./render";

export function registerEvents(): void {
  // 検索ボックス
  const searchBox = document.getElementById("search-box") as HTMLInputElement;
  searchBox.addEventListener("input", (e) => {
    setSearchQuery((e.target as HTMLInputElement).value);
    render();
  });

  // ビュー切替
  document.getElementById("view-toggle")!.addEventListener("click", () => {
    toggleView();
    render();
  });

  // 商品リスト / カート画面のボタン・入力 (event delegation)
  const main = document.getElementById("main")!;

  main.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.matches("[data-action='add-to-cart']")) {
      addToCart(target.dataset.productId!);
      render();
    } else if (target.matches("[data-action='remove-from-cart']")) {
      removeFromCart(target.dataset.productId!);
      render();
    }
  });

  main.addEventListener("change", (e) => {
    const target = e.target as HTMLElement;
    if (target.matches("[data-action='set-quantity']")) {
      const productId = target.dataset.productId!;
      const raw = (target as HTMLInputElement).value;
      const qty = raw === "" ? 0 : parseInt(raw, 10);
      if (Number.isNaN(qty)) return;
      setQuantity(productId, qty);
      render();
    }
  });
}
```

ポイント:
- **`#main` 1箇所にだけリスナーを張る = event delegation**。 これだと再描画でリスナーが消えても問題ない
- 検索ボックスとビュー切替ボタンは **再描画されない** 場所にあるので、 個別に `addEventListener` でOK
- **`change` イベント**(input 確定時) と **`click` イベント** で分ける。 数量を1文字打つたびに `change` は走らない
- **`Number.isNaN(qty)` ガード** を入れないと、空文字を `parseInt` した `NaN` がカートに入ってしまう

### なぜ event delegation なのか

`innerHTML = ""` でリストをまるごと作り直すので、 商品カード内のボタンに直接張ったリスナーは **再描画ごとに消えて、 再登録する必要がある**。

これを毎回やると:
- 「描画関数の中でイベントを登録する」 = 描画とロジックが混ざる
- 「リスナー貼り忘れバグ」が出る

event delegation なら **DOM作成時に親要素に1度だけ張れば** いいので、 再描画と無関係に動く。

## 設計上のよくある落とし穴

| 落とし穴 | 症状 | 対策 |
|---|---|---|
| 「カートに追加」を `setQuantity(id, 1)` で実装 | 既に2個ある商品で押すと1個に戻る | `addToCart(id)` を使う(または `setQuantity(id, current + 1)`) |
| 描画関数の中でリスナー登録 | 再描画のたびに二重登録 / 古いリスナーが残る | `data-*` + event delegation |
| `parseInt(raw, 10)` をそのまま使う | 空入力で `NaN` がカートに入る | `Number.isNaN` ガード |
| 検索を `name.includes(query)` だけで書く | 大文字小文字で結果が変わる | 両側 `.toLowerCase()` |
| `delete cart[id]` の代わりに `cart[id] = 0` | カート画面に「数量0」のゾンビ行が出る | `delete` を使う、 または `setQuantity` 内で `<= 0` 削除 |

## 任意課題の答え

### A. 「カートをすべて空にする」ボタン

**state.ts** に関数を追加:

```ts
export function clearCart(): void {
  cart = {};
}
```

**render.ts** の `renderCartView` で、 カートが空でないときだけボタンを描画:

```ts
function renderCartView(root: HTMLElement): void {
  root.innerHTML = "";

  const cartItems = Object.entries(cart);
  if (cartItems.length === 0) {
    root.textContent = "カートは空です";
    return;
  }

  // ... 既存のループと合計表示 ...

  const clearBtn = document.createElement("button");
  clearBtn.textContent = "カートをすべて空にする";
  clearBtn.className = "mt-2 text-red-600 hover:text-red-800 text-sm underline";
  clearBtn.dataset.action = "clear-cart";
  root.appendChild(clearBtn);
}
```

**events.ts** の click ハンドラに 1分岐追加:

```ts
} else if (target.matches("[data-action='clear-cart']")) {
  clearCart();
  render();
}
```

→ 「state 1個 + 描画 1箇所 + イベント 1分岐」 で済む。 ウォームアップ枠としてちょうど良い。

### B. 商品カードに「カート内の現在数」を表示

**render.ts** の `renderProductList` で、 商品カードに数量テキストを足す:

```ts
const inCart = cart[product.id] ?? 0;
if (inCart > 0) {
  const cartCount = document.createElement("p");
  cartCount.textContent = `カート内: ${inCart}個`;
  cartCount.className = "text-xs text-gray-500";
  card.appendChild(cartCount);
}
```

→ **特別なロジックは何もない**。 「`cart` が変わったら `render()` を呼ぶ」設計のおかげで、 カート画面で数量を変えると **商品一覧側のテキストも自動で更新される**。

ポイント:
- 「カート操作の結果が商品一覧側の表示にも波及する」を **1箇所のロジックで** 実現できている
- これがフレームワーク不要で書ける限界点。 もう少し連動箇所が増えると **「どの操作のときにどこの再描画を呼ぶか」を管理する辛さ** が見えてくる

### C. localStorage でカートを永続化

**state.ts** を改修:

```ts
const STORAGE_KEY = "shop-cart";

function loadCart(): Cart {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    // 値が number であることを軽く検証
    const result: Cart = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "number" && v > 0) result[k] = v;
    }
    return result;
  } catch {
    return {};
  }
}

function saveCart(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export let cart: Cart = loadCart();   // ← 初期値を localStorage から復元

export function addToCart(productId: string): void {
  cart[productId] = (cart[productId] ?? 0) + 1;
  saveCart();   // ← 変更の最後に保存
}

export function setQuantity(productId: string, qty: number): void {
  if (qty <= 0) delete cart[productId];
  else cart[productId] = qty;
  saveCart();
}

export function removeFromCart(productId: string): void {
  delete cart[productId];
  saveCart();
}
```

ポイント:
- **`saveCart()` を全部の state 変更関数で呼ぶ** 必要がある → 4箇所
- **読み込み時の検証** を `loadCart` で軽く入れる(`JSON.parse` の結果は `unknown` 相当なので、 形を検証してから state に入れる)
- **`try/catch`** で localStorage の容量超過 / 無効な JSON に備える

辛いところ:
- 「state を変える箇所すべてで `saveCart()` を呼ぶ」 = **書き忘れバグの温床**
- Proxy で `set` を捕まえて自動保存にする手もあるが、 vanilla TS で素朴に書くなら関数の中で呼ぶしかない
- React 版だと `useEffect(() => localStorage.setItem(...), [cart])` 1箇所で済む
