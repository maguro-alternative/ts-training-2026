import { describe, it, expect, expectTypeOf } from 'vitest';
import { first, last, pick, groupBy } from './index';

describe('03-generics', () => {
  // ----------------------------------------------------------
  // first / last
  // ----------------------------------------------------------
  it('first: 配列の先頭要素を返す', () => {
    expect(first([1, 2, 3])).toBe(1);
    expect(first(['a', 'b'])).toBe('a');
  });

  it('first: 空配列なら undefined', () => {
    expect(first([])).toBeUndefined();
  });

  it('first: 要素型がそのまま戻り値に反映される', () => {
    const n = first([1, 2, 3]);
    expectTypeOf(n).toEqualTypeOf<number | undefined>();
    const s = first(['a', 'b']);
    expectTypeOf(s).toEqualTypeOf<string | undefined>();
  });

  it('last: 配列の末尾要素を返す', () => {
    expect(last([1, 2, 3])).toBe(3);
    expect(last([])).toBeUndefined();
  });

  it('last: 要素型がそのまま戻り値に反映される', () => {
    const s = last(['a', 'b', 'c']);
    expectTypeOf(s).toEqualTypeOf<string | undefined>();
  });

  // ----------------------------------------------------------
  // pick
  // ----------------------------------------------------------
  it('pick: 指定したキーだけを持つオブジェクトを返す', () => {
    const obj = { a: 1, b: 'x', c: true };
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: true });
  });

  it('pick: 戻り値の型が Pick<T, K> になる', () => {
    const obj = { a: 1, b: 'x', c: true };
    const picked = pick(obj, ['a', 'b']);
    expectTypeOf(picked).toEqualTypeOf<{ a: number; b: string }>();
  });

  it('pick: 存在しないキーはコンパイルエラーになる', () => {
    const obj = { a: 1, b: 'x' };
    // @ts-expect-error: 'z' は obj のキーではない
    pick(obj, ['z']);
    expect(true).toBe(true);
  });

  // ----------------------------------------------------------
  // groupBy
  // ----------------------------------------------------------
  it('groupBy: 指定したキーの値でグルーピングできる', () => {
    const items = [
      { kind: 'a', n: 1 },
      { kind: 'b', n: 2 },
      { kind: 'a', n: 3 },
    ];
    expect(groupBy(items, 'kind')).toEqual({
      a: [
        { kind: 'a', n: 1 },
        { kind: 'a', n: 3 },
      ],
      b: [{ kind: 'b', n: 2 }],
    });
  });

  it('groupBy: 数値キーでもグルーピングできる', () => {
    const items = [
      { age: 20, name: 'a' },
      { age: 30, name: 'b' },
      { age: 20, name: 'c' },
    ];
    const grouped = groupBy(items, 'age');
    expect(grouped['20']).toHaveLength(2);
    expect(grouped['30']).toHaveLength(1);
  });

  it('groupBy: 存在しないキーはコンパイルエラーになる', () => {
    const items = [{ a: 1 }];
    // @ts-expect-error: 'z' は items[number] のキーではない
    groupBy(items, 'z');
    expect(true).toBe(true);
  });
});
