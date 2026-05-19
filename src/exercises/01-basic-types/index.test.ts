import { describe, it, expect, expectTypeOf } from 'vitest';
import { add, toUpper, greet, average, formatProduct, type User, type Product } from './index';

describe('01-basic-types', () => {
  // ----------------------------------------------------------
  // 1. add
  // ----------------------------------------------------------
  it('add: 数値を足せる', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(10, -3)).toBe(7);
  });

  it('add: 型シグネチャが (number, number) => number', () => {
    expectTypeOf(add).parameters.toEqualTypeOf<[number, number]>();
    expectTypeOf(add).returns.toEqualTypeOf<number>();
  });

  // ----------------------------------------------------------
  // 2. toUpper
  // ----------------------------------------------------------
  it('toUpper: 文字列を大文字にできる', () => {
    expect(toUpper('hello')).toBe('HELLO');
  });

  it('toUpper: 型シグネチャが (string) => string', () => {
    expectTypeOf(toUpper).parameters.toEqualTypeOf<[string]>();
    expectTypeOf(toUpper).returns.toEqualTypeOf<string>();
  });

  // ----------------------------------------------------------
  // 3. User / greet
  // ----------------------------------------------------------
  it('User 型: name(string) と age(number) を持つ', () => {
    expectTypeOf<User>().toEqualTypeOf<{ name: string; age: number }>();
  });

  it('greet: ユーザー情報を含む文字列を返す', () => {
    expect(greet({ name: 'Chihaya Kisaragi', age: 16 })).toBe('Hello, Chihaya Kisaragi! You are 16 years old.');
  });

  // ----------------------------------------------------------
  // 4. average
  // ----------------------------------------------------------
  it('average: 数値配列の平均を返す', () => {
    expect(average([1, 2, 3, 4, 5])).toBe(3);
    expect(average([10])).toBe(10);
  });

  it('average: 空配列なら 0', () => {
    expect(average([])).toBe(0);
  });

  it('average: 型シグネチャが (number[]) => number', () => {
    expectTypeOf(average).parameters.toEqualTypeOf<[number[]]>();
    expectTypeOf(average).returns.toEqualTypeOf<number>();
  });

  // ----------------------------------------------------------
  // 5. Product / formatProduct
  // ----------------------------------------------------------
  it('Product 型: name, price は必須、description はオプショナル', () => {
    expectTypeOf<Product>().toEqualTypeOf<{
      name: string;
      price: number;
      description?: string;
    }>();
  });

  it('formatProduct: description があれば "name — description"', () => {
    expect(formatProduct({ name: 'Book', price: 1000, description: 'A novel' })).toBe(
      'Book — A novel',
    );
  });

  it('formatProduct: description がなければ name だけ', () => {
    expect(formatProduct({ name: 'Book', price: 1000 })).toBe('Book');
  });
});
