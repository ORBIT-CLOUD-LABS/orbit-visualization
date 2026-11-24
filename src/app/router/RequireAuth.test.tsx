import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { tokenStorage } from '@/shared/auth/tokenStorage';

import { appRoutes } from './appRoutes';

function renderAt(path: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

describe('RequireAuth', () => {
  it('토큰이 없으면 로그인 화면으로 보낸다', async () => {
    const router = renderAt('/campaigns/1');

    expect(await screen.findByRole('heading', { name: '로그인' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
  });

  it('토큰이 있으면 요청한 화면을 보여 준다', async () => {
    tokenStorage.set('admin-token');

    renderAt('/campaigns/1');

    expect(await screen.findByRole('heading', { name: '캠페인 상세' })).toBeInTheDocument();
  });

  it('로그인 화면은 토큰 없이 열린다', async () => {
    renderAt('/login');

    expect(await screen.findByRole('heading', { name: '로그인' })).toBeInTheDocument();
  });
});
