import type { Cart, View } from "./types";

// --- アプリの状態 (モジュールスコープで保持) ---
export let searchQuery = "";
export let cart: Cart = {};
export let currentView: View = "products";

// --- state を更新する関数 (DOM 再描画は呼び出し側の責任) ---

export function setSearchQuery(q: string): void {
  searchQuery = q;
}

export function addToCart(productId: string): void {
  // TODO: cart の productId の数量を +1 する
}

export function setQuantity(productId: string, qty: number): void {
  // TODO: 数量を qty にする。0以下になったらカートから削除する
}

export function removeFromCart(productId: string): void {
  // TODO: cart から productId を削除する
}

export function toggleView(): void {
  // TODO: products ⇔ cart を切り替える
}
