import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { createQueryClient } from '@/app/queryClient';
import { tokenStorage } from '@/shared/auth/tokenStorage';

import { appRoutes } from './appRoutes';

function renderAt(path: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  render(
    <QueryClientProvider client={createQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
}

describe('RequireAuth', () => {
  it('토큰이 없으면 로그인 화면으로 보낸다', async () => {
    const router = renderAt('/campaigns/1');

    expect(await screen.findByRole('heading', { name: '관리자 토큰 입력' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
  });

  it('토큰이 있으면 요청한 화면을 보여 준다', async () => {
    tokenStorage.set('admin-token');

    renderAt('/campaigns/1');

    expect(await screen.findByRole('heading', { name: '캠페인 상세' })).toBeInTheDocument();
  });

  it('없는 경로는 대시보드로 보낸다', async () => {
    tokenStorage.set('admin-token');

    const router = renderAt('/campaign/3');

    expect(await screen.findByRole('heading', { name: '대시보드' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });

  it('로그인 화면은 토큰 없이 열린다', async () => {
    renderAt('/login');

    expect(await screen.findByRole('heading', { name: '관리자 토큰 입력' })).toBeInTheDocument();
  });
});
