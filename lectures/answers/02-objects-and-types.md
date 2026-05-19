# 02. オブジェクト型と型エイリアス — 演習の答え

## Part A — 写経

- `const age: number = "16";` → `Type '"16"' is not assignable to type 'number'.`
- `const flag: boolean = 0;` → `Type 'number' is not assignable to type 'boolean'.`
- `const p3: Profile = { bio: "Hello" };` → `Property 'name' is missing in type '{ bio: string; }' but required in type 'Profile'.`
- `pt.x = 10;` → `Cannot assign to 'x' because it is a read-only property.`

## Part B — 型を設計する

### 1. `Product`

```ts
type Product = {
  readonly id: string;
  name: string;
  price: number;
  description?: string;
  tags?: string[];
};

const p: Product = {
  id: "p1",
  name: "Book",
  price: 1000,
};
```

ポイント:
- `id` は **`readonly`** を付ける。 一度決めた商品IDが変わってはまずいので
- `description` と `tags` は **`?`** でオプショナル
- 「`description?: string` は `string | undefined` とほぼ同じ」を講義で扱った前提で、 ここでは `?` を選ぶのが自然

### 2. `Order`

```ts
type Order = {
  readonly id: string;
  items: { product: Product; quantity: number }[];
  shippingAddress?: { city: string; zip: string };
};
```

ポイント:
- `items` は **配列要素にインラインのオブジェクト型** を持つ。 別名にする必要はなく、 そのまま `{ product: Product; quantity: number }[]` でOK
- `shippingAddress` も同様に **インライン** で書ける
- 別名にしたければ:

```ts
type OrderItem = { product: Product; quantity: number };
type Address = { city: string; zip: string };

type Order = {
  readonly id: string;
  items: OrderItem[];
  shippingAddress?: Address;
};
```

どちらでも可。 再利用するなら別名、 ここだけなら インライン、 という判断ができればOK。

### 3. `WithName` / `WithEmail` の合成

```ts
type WithName = { name: string };
type WithEmail = { email: string };

type Contact = WithName & WithEmail;

const c: Contact = { name: "Taro", email: "taro@example.com" };
```

`&`(intersection)で「両方のプロパティを持つ型」になる、を体感できればOK。

### 4. `totalPrice`

```ts
function totalPrice(order: Order): number {
  return order.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
}
```

ポイント:
- `reduce` の初期値 `0` を忘れないこと(空配列のときに `TypeError` になる)
- アクセス経路を意識: `order.items[i].product.price` の **ネスト** が型補完される体験

別解として `for...of` でもOK:

```ts
function totalPrice(order: Order): number {
  let sum = 0;
  for (const item of order.items) {
    sum += item.product.price * item.quantity;
  }
  return sum;
}
```

## Part C — 任意

### 1. `type` と `interface` の差を確認

写経そのままなので答えは元のコード。 ただし以下の **動作確認ポイント** を講師が誘導:

```ts
// 同名 interface のマージで age が追加された後
const u: UserI = { name: "Taro" };  // ❌ age が必須
const u: UserI = { name: "Taro", age: 25 };  // ✅
```

- `interface` 同名再宣言は **暗黙的にマージされる**(declaration merging)
- `type` で同じことをやろうとすると `Duplicate identifier 'Card'.` エラーになる:

```ts
type Card = { width: number };
type Card = { height: number };  // ❌ 同名 type の再宣言はエラー
```

→ 「ライブラリの型を拡張するときは `interface` が選ばれる理由」 として講師が補足するとよい。

### 2. インデックス署名

写経のまま。 動作確認ポイント:

```ts
const scores: Dict = { math: 80, english: 90 };
scores.science = 75;       // ✅
scores.foo = "bar";        // ❌ Type 'string' is not assignable to type 'number'.
const s: number = scores.unknown_key;  // ⚠️ 実行時は undefined だが型は number
```

- **任意の文字列キー** を許容するが、 **値の型は固定**(`number`)
- 最後の例が **インデックス署名の落とし穴**: 存在しないキーへのアクセスも型上は通る
- `tsconfig.json` で `noUncheckedIndexedAccess: true` を有効にすると、 `scores.unknown_key` の型が `number | undefined` になり安全になる
- 「Day 2 の strict 章で扱う」と予告すればOK
