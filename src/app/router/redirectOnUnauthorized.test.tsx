import { QueryClient } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { tokenStorage } from '@/shared/auth/tokenStorage';
import { reportUnauthorized } from '@/shared/auth/unauthorized';
import { renderRoutes } from '@/test/renderRoutes';

import { appRoutes } from './appRoutes';
import { redirectOnUnauthorized } from './redirectOnUnauthorized';

describe('redirectOnUnauthorized', () => {
  let unsubscribe: (() => void) | undefined;

  afterEach(() => {
    unsubscribe?.();
  });

  it('401 을 받으면 캐시를 비우고 로그인 화면으로 보낸다', async () => {
    tokenStorage.set('admin-token');
    const { router, queryClient } = renderRoutes(appRoutes, '/campaigns');
    queryClient.setQueryData(['campaigns'], []);
    unsubscribe = redirectOnUnauthorized(router, queryClient);
    await screen.findByRole('heading', { name: '캠페인' });

    act(() => {
      reportUnauthorized();
    });

    expect(await screen.findByRole('heading', { name: '관리자 토큰 입력' })).toBeInTheDocument();
    expect(queryClient.getQueryData(['campaigns'])).toBeUndefined();
  });

  it('화면을 로그인으로 옮긴 뒤에 캐시를 비운다', async () => {
    const calls: string[] = [];
    const router = {
      navigate: vi.fn(async () => {
        calls.push('navigate');
      }),
    };
    const queryClient = new QueryClient();
    vi.spyOn(queryClient, 'clear').mockImplementation(() => {
      calls.push('clear');
    });
    tokenStorage.set('admin-token');
    unsubscribe = redirectOnUnauthorized(router, queryClient);

    reportUnauthorized();

    await vi.waitFor(() => {
      expect(calls).toEqual(['navigate', 'clear']);
    });
  });
});
