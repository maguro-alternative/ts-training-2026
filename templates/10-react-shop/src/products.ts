import type { Product } from "./types";

const placeholder = (label: string) =>
  `https://placehold.co/128x128?text=${encodeURIComponent(label)}`;

export const products: Product[] = [
  { id: "p01", name: "クッション",     price: 1200,  imageUrl: placeholder("クッション") },
  { id: "p02", name: "マグカップ",     price: 800,   imageUrl: placeholder("マグカップ") },
  { id: "p03", name: "キーボード",     price: 12000, imageUrl: placeholder("キーボード") },
  { id: "p04", name: "ノート",         price: 350,   imageUrl: placeholder("ノート") },
  { id: "p05", name: "観葉植物",       price: 2500,  imageUrl: placeholder("観葉植物") },
  { id: "p06", name: "ヘッドホン",     price: 8900,  imageUrl: placeholder("ヘッドホン") },
  { id: "p07", name: "文庫本",         price: 980,   imageUrl: placeholder("文庫本") },
  { id: "p08", name: "デスクライト",   price: 4500,  imageUrl: placeholder("デスクライト") },
];
