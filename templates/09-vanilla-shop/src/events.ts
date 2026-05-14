import { setSearchQuery, toggleView } from "./state";
import { render } from "./render";

/**
 * すべてのイベントリスナーを登録する。
 * 商品リストやカート画面は再描画で消えるので、
 * **event delegation** (親要素にリスナーを張って data-* で識別)
 * を使うのがおすすめ。
 */
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

  // TODO: 商品の「カートに追加」「数量変更」「削除」を処理する
  //       (#main に対する delegation で書くと再描画後も動く)
}
