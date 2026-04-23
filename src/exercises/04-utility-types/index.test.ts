import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  createUser,
  updateUser,
  type User,
  type UserUpdate,
  type UserPublic,
  type UserSummary,
  type UserDictionary,
} from './index';

describe('04-utility-types', () => {
  // ----------------------------------------------------------
  // 型定義
  // ----------------------------------------------------------
  it('UserUpdate: 全プロパティがオプショナル', () => {
    expectTypeOf<UserUpdate>().toEqualTypeOf<Partial<User>>();
  });

  it('UserPublic: email と age を持たない', () => {
    expectTypeOf<UserPublic>().toEqualTypeOf<{ id: string; name: string }>();
  });

  it('UserSummary: id と name だけ', () => {
    expectTypeOf<UserSummary>().toEqualTypeOf<{ id: string; name: string }>();
  });

  it('UserDictionary: string をキーに User を引ける', () => {
    expectTypeOf<UserDictionary>().toEqualTypeOf<Record<string, User>>();
  });

  // ----------------------------------------------------------
  // createUser
  // ----------------------------------------------------------
  it('createUser: id 以外を受け取って User を作る', () => {
    const u = createUser({ name: 'Taro', email: 't@example.com', age: 25 });
    expect(u).toMatchObject({ name: 'Taro', email: 't@example.com', age: 25 });
    expect(typeof u.id).toBe('string');
  });

  it('createUser: id を渡すとコンパイルエラーになる', () => {
    createUser({
      // @ts-expect-error: id はサーバーで振るので指定できない
      id: 'should-not-be-allowed',
      name: 'Taro',
      email: 't@example.com',
      age: 25,
    });
    expect(true).toBe(true);
  });

  // ----------------------------------------------------------
  // updateUser
  // ----------------------------------------------------------
  it('updateUser: 一部のプロパティだけ更新できる', () => {
    const user: User = { id: 'u1', name: 'Taro', email: 't@example.com', age: 25 };
    const updated = updateUser(user, { age: 26 });
    expect(updated).toEqual({ id: 'u1', name: 'Taro', email: 't@example.com', age: 26 });
  });

  it('updateUser: id を patch に含めるとコンパイルエラー', () => {
    const user: User = { id: 'u1', name: 'Taro', email: 't@example.com', age: 25 };
    // @ts-expect-error: id は変更不可
    updateUser(user, { id: 'u2' });
    expect(true).toBe(true);
  });
});
