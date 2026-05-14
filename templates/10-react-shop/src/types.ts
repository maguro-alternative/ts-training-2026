export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

// productId → 数量
export type Cart = Record<string, number>;

export type View = "products" | "cart";
