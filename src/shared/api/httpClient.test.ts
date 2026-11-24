import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { server } from '@/mocks/server';
import { tokenStorage } from '@/shared/auth/tokenStorage';
import { onUnauthorized } from '@/shared/auth/unauthorized';

import { ApiError } from './ApiError';
import { httpClient } from './httpClient';
import { NetworkError } from './NetworkError';
import { parseApiResponse } from './parseApiResponse';

const itemSchema = z.object({ id: z.number(), name: z.string() });

async function getItem(): Promise<z.output<typeof itemSchema>> {
  const response = await httpClient.get<unknown>('/items/1');
  return parseApiResponse(response.data, itemSchema);
}

function failure(code: string, message: string) {
  return { isSuccess: false, code, message, data: null, error: null };
}

describe('httpClient', () => {
  let unsubscribe: (() => void) | undefined;

  afterEach(() => {
    unsubscribe?.();
  });

  it('저장된 토큰을 Bearer 헤더로 보내고 공통 응답의 data 를 돌려준다', async () => {
    tokenStorage.set('admin-token');
    let authorization: string | null = null;
    server.use(
      http.get('/api/v1/items/1', ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json({
          isSuccess: true,
          code: 'OK',
          message: '요청에 성공했습니다.',
          data: { id: 1, name: 'item' },
          error: null,
        });
      }),
    );

    await expect(getItem()).resolves.toEqual({ id: 1, name: 'item' });
    expect(authorization).toBe('Bearer admin-token');
  });

  it('토큰이 없으면 Authorization 헤더를 보내지 않는다', async () => {
    let hasAuthorization = true;
    server.use(
      http.get('/api/v1/items/1', ({ request }) => {
        hasAuthorization = request.headers.has('Authorization');
        return HttpResponse.json({
          isSuccess: true,
          code: 'OK',
          message: '',
          data: { id: 1, name: 'a' },
        });
      }),
    );

    await getItem();

    expect(hasAuthorization).toBe(false);
  });

  it('요청에 넘긴 Authorization 헤더는 저장된 토큰으로 덮어쓰지 않는다', async () => {
    tokenStorage.set('stored-token');
    let authorization: string | null = null;
    server.use(
      http.get('/api/v1/items/1', ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json({ isSuccess: true, code: 'OK', message: '', data: null });
      }),
    );

    await httpClient.get('/items/1', { headers: { Authorization: 'Bearer new-token' } });

    expect(authorization).toBe('Bearer new-token');
  });

  it('data 형식이 다르면 오류를 던진다', async () => {
    server.use(
      http.get('/api/v1/items/1', () =>
        HttpResponse.json({ isSuccess: true, code: 'OK', message: '', data: { id: '1' } }),
      ),
    );

    await expect(getItem()).rejects.toThrow('data 형식');
  });

  it('실패 응답은 서버 code 와 status 를 가진 ApiError 로 바꾼다', async () => {
    server.use(
      http.get('/api/v1/items/1', () =>
        HttpResponse.json(failure('CAMPAIGN_NOT_FOUND', '캠페인을 찾을 수 없습니다.'), {
          status: 404,
        }),
      ),
    );

    const error: unknown = await getItem().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, code: 'CAMPAIGN_NOT_FOUND' });
  });

  it('본문이 공통 형식이 아니면 HTTP_<status> code 를 쓴다', async () => {
    server.use(http.get('/api/v1/items/1', () => new HttpResponse('Bad Gateway', { status: 502 })));

    await expect(getItem()).rejects.toMatchObject({ status: 502, code: 'HTTP_502' });
  });

  it('401 이면 토큰을 지우고 등록된 함수에 알린다', async () => {
    tokenStorage.set('expired-token');
    const listener = vi.fn();
    unsubscribe = onUnauthorized(listener);
    server.use(
      http.get('/api/v1/items/1', () =>
        HttpResponse.json(failure('AUTHENTICATION_REQUIRED', '인증이 필요합니다.'), {
          status: 401,
        }),
      ),
    );

    await expect(getItem()).rejects.toMatchObject({ status: 401, code: 'AUTHENTICATION_REQUIRED' });
    expect(listener).toHaveBeenCalledOnce();
    expect(tokenStorage.get()).toBeNull();
  });

  it('401 이 아닌 실패에는 알리지 않는다', async () => {
    const listener = vi.fn();
    unsubscribe = onUnauthorized(listener);
    server.use(
      http.get('/api/v1/items/1', () =>
        HttpResponse.json(failure('INTERNAL', ''), { status: 500 }),
      ),
    );

    await expect(getItem()).rejects.toBeInstanceOf(ApiError);
    expect(listener).not.toHaveBeenCalled();
  });

  it('응답을 받지 못하면 NetworkError 를 던진다', async () => {
    server.use(http.get('/api/v1/items/1', () => HttpResponse.error()));

    await expect(getItem()).rejects.toBeInstanceOf(NetworkError);
  });
});
