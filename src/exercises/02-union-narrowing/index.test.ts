import { describe, it, expect, expectTypeOf } from 'vitest';
import { bgFor, stringify, isCat, formatResult, type Theme, type Result, type Cat, type Dog } from './index';

describe('02-union-narrowing', () => {
  // ----------------------------------------------------------
  // 1. Theme / bgFor
  // ----------------------------------------------------------
  it('Theme はリテラル 3パターンのユニオン', () => {
    expectTypeOf<Theme>().toEqualTypeOf<'light' | 'dark' | 'auto'>();
  });

  it('bgFor: 各テーマに対応する色を返す', () => {
    expect(bgFor('light')).toBe('white');
    expect(bgFor('dark')).toBe('black');
    expect(bgFor('auto')).toBe('system');
  });

  it('bgFor: 型シグネチャが (Theme) => string', () => {
    expectTypeOf(bgFor).parameters.toEqualTypeOf<[Theme]>();
    expectTypeOf(bgFor).returns.toEqualTypeOf<string>();
  });

  // ----------------------------------------------------------
  // 2. stringify
  // ----------------------------------------------------------
  it('stringify: 文字列はそのまま', () => {
    expect(stringify('hello')).toBe('hello');
  });

  it('stringify: 数値は文字列化される', () => {
    expect(stringify(42)).toBe('42');
    expect(stringify(0)).toBe('0');
  });

  // ----------------------------------------------------------
  // 3. isCat
  // ----------------------------------------------------------
  it('isCat: Cat を判定できる', () => {
    expect(isCat({ name: 'Tama', purrs: true })).toBe(true);
    expect(isCat({ name: 'Pochi', barks: true })).toBe(false);
  });

  it('isCat: 型ガードとして働く (animal is Cat を返す)', () => {
    // 関数経由で Cat | Dog を得ることで、TS の初期化子 narrowing を抑える
    const makeAnimal = (): Cat | Dog => ({ name: 'Tama', purrs: true });
    const animal: Cat | Dog = makeAnimal();
    if (isCat(animal)) {
      // ここで Cat に絞り込めていれば purrs にアクセスできる
      expectTypeOf(animal).toEqualTypeOf<Cat>();
      expect(animal.purrs).toBe(true);
    } else {
      expectTypeOf(animal).toEqualTypeOf<Dog>();
    }
  });

  // ----------------------------------------------------------
  // 4. Discriminated Union
  // ----------------------------------------------------------
  it('Result は status で分岐する Discriminated Union', () => {
    // 成功型の構造
    const ok: Result = { status: 'ok', data: 'hello', requestedAt: 1 };
    expect(ok).toBeDefined();
    // 失敗型の構造
    const err: Result = { status: 'error', errorCode: 500, requestedAt: 1 };
    expect(err).toBeDefined();
  });

  it('Result: 成功型に errorCode は存在してはいけない', () => {
    // @ts-expect-error: ok のくせに errorCode を持つのは不正
    const invalid: Result = { status: 'ok', data: 'x', errorCode: 1, requestedAt: 1 };
    expect(invalid).toBeDefined();
  });

  it('formatResult: 成功なら data、失敗なら error:code', () => {
    expect(formatResult({ status: 'ok', data: 'hello', requestedAt: 100 })).toBe('hello');
    expect(formatResult({ status: 'error', errorCode: 404, requestedAt: 100 })).toBe('error:404');
  });
});
