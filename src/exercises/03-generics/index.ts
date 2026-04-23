// 課題 03: ジェネリクス

// ------------------------------------------------------------
// 1. first: 配列の先頭要素を返す (空なら undefined)
// ------------------------------------------------------------
// TODO: ジェネリクスを使い、入力配列の要素型がそのまま戻り値に反映されるようにする
export function first(arr: any): any {
  return arr.length === 0 ? undefined : arr[0];
}

// ------------------------------------------------------------
// 2. last: 配列の末尾要素を返す (空なら undefined)
// ------------------------------------------------------------
export function last(arr: any): any {
  return arr.length === 0 ? undefined : arr[arr.length - 1];
}

// ------------------------------------------------------------
// 3. pick: オブジェクトから指定したキーだけを抜き出す
// ------------------------------------------------------------
// 例: pick({ a: 1, b: 'x', c: true }, ['a', 'c']) -> { a: 1, c: true }
//
// TODO:
//   - T extends object, K extends keyof T のジェネリクスを使う
//   - 戻り値の型は Pick<T, K> にする
export function pick(obj: any, keys: any): any {
  const result: any = {};
  for (const k of keys) {
    result[k] = obj[k];
  }
  return result;
}

// ------------------------------------------------------------
// 4. groupBy: 配列を指定したキーの値でグルーピングする
// ------------------------------------------------------------
// 例:
//   groupBy([{ kind: 'a', n: 1 }, { kind: 'b', n: 2 }, { kind: 'a', n: 3 }], 'kind')
//   -> { a: [{kind:'a',n:1},{kind:'a',n:3}], b: [{kind:'b',n:2}] }
//
// TODO:
//   - T, K extends keyof T のジェネリクスを使う
//   - ただし T[K] が string | number でないとキーにできないので、さらに制約が必要
//   - 戻り値は Record<string, T[]> でOK
export function groupBy(items: any, key: any): any {
  const result: any = {};
  for (const item of items) {
    const k = String(item[key]);
    if (!result[k]) result[k] = [];
    result[k].push(item);
  }
  return result;
}
