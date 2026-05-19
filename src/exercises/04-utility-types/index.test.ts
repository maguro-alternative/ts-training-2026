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
    const u = createUser({ name: 'Mirai Kasuga', email: 't@example.com', age: 14 });
    expect(u).toMatchObject({ name: 'Mirai Kasuga', email: 't@example.com', age: 14 });
    expect(typeof u.id).toBe('string');
  });

  it('createUser: id を渡すとコンパイルエラーになる', () => {
    createUser({
      // @ts-expect-error: id はサーバーで振るので指定できない
      id: 'should-not-be-allowed',
      name: 'Mirai Kasuga',
      email: 't@example.com',
      age: 14,
    });
    expect(true).toBe(true);
  });

  // ----------------------------------------------------------
  // updateUser
  // ----------------------------------------------------------
  it('updateUser: 一部のプロパティだけ更新できる', () => {
    const user: User = { id: 'u1', name: 'Mirai Kasuga', email: 't@example.com', age: 14 };
    const updated = updateUser(user, { age: 15 });
    expect(updated).toEqual({ id: 'u1', name: 'Mirai Kasuga', email: 't@example.com', age: 15 });
  });

  it('updateUser: id を patch に含めるとコンパイルエラー', () => {
    const user: User = { id: 'u1', name: 'Mirai Kasuga', email: 't@example.com', age: 14 };
    // @ts-expect-error: id は変更不可
    updateUser(user, { id: 'u2' });
    expect(true).toBe(true);
  });
});
