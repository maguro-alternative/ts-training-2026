import { products } from "./products";
import { searchQuery, cart, currentView } from "./state";

/**
 * 全体を再描画する。state が変わったら毎回これを呼ぶ。
 */
export function render(): void {
  renderCartBadge();
  const main = document.getElementById("main")!;
  // TODO: currentView に応じて renderProductList か renderCartView を呼び分ける
}

/**
 * 商品一覧を描画する。
 * - searchQuery で products を絞り込む(名前の部分一致)
 * - 各カードに「カートに追加」ボタン
 * - 検索結果0件なら「該当する商品がありません」を出す
 */
function renderProductList(root: HTMLElement): void {
  // TODO
}

/**
 * カート画面を描画する。
 * - cart の各 productId について行を描画
 * - 数量変更 input / 削除ボタン / 合計金額
 * - カートが空なら「カートは空です」を出す
 */
function renderCartView(root: HTMLElement): void {
  // TODO
}

/**
 * ヘッダーのカートバッジ(合計点数)を更新する。
 */
function renderCartBadge(): void {
  // TODO: cart の合計点数を計算して #cart-badge のテキストを更新
}
