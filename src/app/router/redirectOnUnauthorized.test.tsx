import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import { createQueryClient } from '@/app/queryClient';
import { tokenStorage } from '@/shared/auth/tokenStorage';
import { reportUnauthorized } from '@/shared/auth/unauthorized';

import { appRoutes } from './appRoutes';
import { redirectOnUnauthorized } from './redirectOnUnauthorized';

describe('redirectOnUnauthorized', () => {
  let unsubscribe: (() => void) | undefined;

  afterEach(() => {
    unsubscribe?.();
  });

  it('401 을 받으면 캐시를 비우고 로그인 화면으로 보낸다', async () => {
    tokenStorage.set('admin-token');
    const queryClient = createQueryClient();
    queryClient.setQueryData(['campaigns'], []);
    const router = createMemoryRouter(appRoutes, { initialEntries: ['/campaigns'] });
    unsubscribe = redirectOnUnauthorized(router, queryClient);
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );
    await screen.findByRole('heading', { name: '캠페인' });

    act(() => {
      reportUnauthorized();
    });

    expect(await screen.findByRole('heading', { name: '관리자 토큰 입력' })).toBeInTheDocument();
    expect(queryClient.getQueryData(['campaigns'])).toBeUndefined();
  });
});
