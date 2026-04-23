import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  extractBooks,
  shouldRetry,
  getRetryAfter,
  type Book,
  type SearchResponse,
} from './index';

describe('07-api-response', () => {
  // ----------------------------------------------------------
  // 型定義の検証
  // ----------------------------------------------------------
  it('Book 型: id, title, author を持つ', () => {
    expectTypeOf<Book>().toEqualTypeOf<{ id: string; title: string; author: string }>();
  });

  it('SearchResponse: 成功レスポンスを代入できる', () => {
    const ok: SearchResponse = {
      status: 'success',
      books: [{ id: 'b1', title: 'TypeScript入門', author: '山田' }],
    };
    expect(ok).toBeDefined();
  });

  it('SearchResponse: 入力エラーを代入できる', () => {
    const err: SearchResponse = {
      status: 'error',
      errorType: 'validation',
      message: 'query is required',
    };
    expect(err).toBeDefined();
  });

  it('SearchResponse: サーバーエラーを代入できる', () => {
    const err: SearchResponse = {
      status: 'error',
      errorType: 'server',
      message: 'internal server error',
      retryAfter: 30,
    };
    expect(err).toBeDefined();
  });

  it('SearchResponse: 成功型に books がないのは不正', () => {
    // @ts-expect-error: success には books が必須
    const invalid: SearchResponse = { status: 'success' };
    expect(invalid).toBeDefined();
  });

  it('SearchResponse: validation エラーに retryAfter は存在しない', () => {
    // @ts-expect-error: validation は retryAfter を持たない
    const invalid: SearchResponse = {
      status: 'error',
      errorType: 'validation',
      message: 'x',
      retryAfter: 30,
    };
    expect(invalid).toBeDefined();
  });

  it('SearchResponse: server エラーは retryAfter が必須', () => {
    // @ts-expect-error: server は retryAfter が無いと不正
    const invalid: SearchResponse = {
      status: 'error',
      errorType: 'server',
      message: 'x',
    };
    expect(invalid).toBeDefined();
  });

  // ----------------------------------------------------------
  // extractBooks
  // ----------------------------------------------------------
  it('extractBooks: 成功時は books を返す', () => {
    const books: Book[] = [{ id: 'b1', title: 'TS本', author: '田中' }];
    expect(extractBooks({ status: 'success', books })).toEqual(books);
  });

  it('extractBooks: 失敗時は空配列', () => {
    expect(
      extractBooks({ status: 'error', errorType: 'validation', message: 'x' }),
    ).toEqual([]);
    expect(
      extractBooks({
        status: 'error',
        errorType: 'server',
        message: 'x',
        retryAfter: 10,
      }),
    ).toEqual([]);
  });

  // ----------------------------------------------------------
  // shouldRetry
  // ----------------------------------------------------------
  it('shouldRetry: 成功時は false', () => {
    expect(shouldRetry({ status: 'success', books: [] })).toBe(false);
  });

  it('shouldRetry: validation エラー時は false', () => {
    expect(
      shouldRetry({ status: 'error', errorType: 'validation', message: 'x' }),
    ).toBe(false);
  });

  it('shouldRetry: server エラー時のみ true', () => {
    expect(
      shouldRetry({
        status: 'error',
        errorType: 'server',
        message: 'x',
        retryAfter: 30,
      }),
    ).toBe(true);
  });

  // ----------------------------------------------------------
  // getRetryAfter
  // ----------------------------------------------------------
  it('getRetryAfter: server エラーなら秒数を返す', () => {
    expect(
      getRetryAfter({
        status: 'error',
        errorType: 'server',
        message: 'x',
        retryAfter: 45,
      }),
    ).toBe(45);
  });

  it('getRetryAfter: server 以外は null', () => {
    expect(getRetryAfter({ status: 'success', books: [] })).toBeNull();
    expect(
      getRetryAfter({ status: 'error', errorType: 'validation', message: 'x' }),
    ).toBeNull();
  });
});
