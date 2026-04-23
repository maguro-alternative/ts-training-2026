import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  totalPrice,
  adultsOnly,
  on,
  parseCount,
  type CartItem,
  type Person,
} from './index';

describe('05-refactor-any', () => {
  // ----------------------------------------------------------
  // 1. CartItem / totalPrice
  // ----------------------------------------------------------
  it('CartItem: name, price, quantity', () => {
    expectTypeOf<CartItem>().toEqualTypeOf<{
      name: string;
      price: number;
      quantity: number;
    }>();
  });

  it('totalPrice: 合計金額を返す', () => {
    expect(
      totalPrice([
        { name: 'apple', price: 100, quantity: 2 },
        { name: 'bread', price: 300, quantity: 1 },
      ]),
    ).toBe(500);
  });

  it('totalPrice: 型シグネチャが (CartItem[]) => number', () => {
    expectTypeOf(totalPrice).parameters.toEqualTypeOf<[CartItem[]]>();
    expectTypeOf(totalPrice).returns.toEqualTypeOf<number>();
  });

  // ----------------------------------------------------------
  // 2. Person / adultsOnly
  // ----------------------------------------------------------
  it('Person: name, age', () => {
    expectTypeOf<Person>().toEqualTypeOf<{ name: string; age: number }>();
  });

  it('adultsOnly: 18歳以上だけ残す', () => {
    expect(
      adultsOnly([
        { name: 'a', age: 15 },
        { name: 'b', age: 20 },
        { name: 'c', age: 18 },
      ]),
    ).toEqual([
      { name: 'b', age: 20 },
      { name: 'c', age: 18 },
    ]);
  });

  it('adultsOnly: 型シグネチャが (Person[]) => Person[]', () => {
    expectTypeOf(adultsOnly).parameters.toEqualTypeOf<[Person[]]>();
    expectTypeOf(adultsOnly).returns.toEqualTypeOf<Person[]>();
  });

  // ----------------------------------------------------------
  // 3. on (ジェネリクスによるイベント型の連動)
  // ----------------------------------------------------------
  it('on: eventName に応じて callback の引数型が決まる', () => {
    // 正しい呼び出しは通る
    on('click', (e) => {
      expectTypeOf(e).toEqualTypeOf<{ x: number; y: number }>();
    });
    on('keypress', (e) => {
      expectTypeOf(e).toEqualTypeOf<{ key: string }>();
    });
    expect(true).toBe(true);
  });

  it('on: 不正なイベント名はコンパイルエラー', () => {
    // @ts-expect-error: 'unknown-event' は EventMap のキーにない
    on('unknown-event', (_e) => {});
    expect(true).toBe(true);
  });

  it('on: callback の引数型が違うとコンパイルエラー', () => {
    // @ts-expect-error: click の payload には key プロパティは無い
    on('click', (e: { key: string }) => {
      void e.key;
    });
    expect(true).toBe(true);
  });

  // ----------------------------------------------------------
  // 4. parseCount
  // ----------------------------------------------------------
  it('parseCount: count が number なら返す', () => {
    expect(parseCount('{"count":42}')).toBe(42);
  });

  it('parseCount: 不正な形なら 0', () => {
    expect(parseCount('{"foo":1}')).toBe(0);
    expect(parseCount('null')).toBe(0);
    expect(parseCount('"hello"')).toBe(0);
  });
});
