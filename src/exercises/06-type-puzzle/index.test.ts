import { describe, it, expectTypeOf } from 'vitest';
import type {
  MyPartial,
  MyReadonly,
  MyPick,
  MyExclude,
  MyNonNullable,
  First,
} from './index';

type User = { id: string; name: string; age: number };

describe('06-type-puzzle', () => {
  it('MyPartial: 全プロパティをオプショナルにする', () => {
    expectTypeOf<MyPartial<User>>().toEqualTypeOf<{
      id?: string;
      name?: string;
      age?: number;
    }>();
  });

  it('MyReadonly: 全プロパティを readonly にする', () => {
    expectTypeOf<MyReadonly<User>>().toEqualTypeOf<{
      readonly id: string;
      readonly name: string;
      readonly age: number;
    }>();
  });

  it('MyPick: 指定したキーだけ取り出す', () => {
    expectTypeOf<MyPick<User, 'id' | 'name'>>().toEqualTypeOf<{
      id: string;
      name: string;
    }>();
  });

  it('MyExclude: T から U を除外する', () => {
    expectTypeOf<MyExclude<'a' | 'b' | 'c', 'a'>>().toEqualTypeOf<'b' | 'c'>();
    expectTypeOf<MyExclude<string | number | boolean, boolean>>().toEqualTypeOf<
      string | number
    >();
  });

  it('MyNonNullable: null と undefined を除外する', () => {
    expectTypeOf<MyNonNullable<string | null>>().toEqualTypeOf<string>();
    expectTypeOf<MyNonNullable<string | undefined>>().toEqualTypeOf<string>();
    expectTypeOf<MyNonNullable<string | null | undefined>>().toEqualTypeOf<string>();
  });

  it('First: タプルの先頭要素を取り出す', () => {
    expectTypeOf<First<[1, 2, 3]>>().toEqualTypeOf<1>();
    expectTypeOf<First<['a', 'b']>>().toEqualTypeOf<'a'>();
  });

  it('First: 空配列なら never', () => {
    expectTypeOf<First<[]>>().toEqualTypeOf<never>();
  });
});
