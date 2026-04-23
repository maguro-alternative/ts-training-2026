import { describe, it, expectTypeOf } from 'vitest';
import type { GetterOf, AsyncState, MyReturnType } from './index';

type User = { name: string; age: number };

describe('08-stretch', () => {
  it('GetterOf: name → getName, age → getAge に変換される', () => {
    expectTypeOf<GetterOf<User>>().toEqualTypeOf<{
      getName: () => string;
      getAge: () => number;
    }>();
  });

  it('AsyncState: idle が代入できる', () => {
    const s: AsyncState<User, string> = { status: 'idle' };
    expectTypeOf(s).toMatchTypeOf<AsyncState<User, string>>();
  });

  it('AsyncState: loading が代入できる', () => {
    const s: AsyncState<User, string> = { status: 'loading' };
    expectTypeOf(s).toMatchTypeOf<AsyncState<User, string>>();
  });

  it('AsyncState: success は data を持つ', () => {
    const s: AsyncState<User, string> = {
      status: 'success',
      data: { name: 'Taro', age: 20 },
    };
    expectTypeOf(s).toMatchTypeOf<AsyncState<User, string>>();
  });

  it('AsyncState: failure は error を持つ', () => {
    const s: AsyncState<User, string> = { status: 'failure', error: 'oops' };
    expectTypeOf(s).toMatchTypeOf<AsyncState<User, string>>();
  });

  it('AsyncState: idle に data を載せてはいけない', () => {
    // @ts-expect-error: idle は data を持たない
    const s: AsyncState<User, string> = { status: 'idle', data: { name: 'x', age: 1 } };
    void s;
  });

  it('MyReturnType: 関数の戻り値型を取り出せる', () => {
    expectTypeOf<MyReturnType<() => string>>().toEqualTypeOf<string>();
    expectTypeOf<MyReturnType<() => number>>().toEqualTypeOf<number>();
    expectTypeOf<MyReturnType<(a: number) => User>>().toEqualTypeOf<User>();
  });
});
