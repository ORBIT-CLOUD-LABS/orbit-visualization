import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { tokenStorage } from '@/shared/auth/tokenStorage';
import { renderRoutes } from '@/test/renderRoutes';

import { AuthenticatedLayout } from './AuthenticatedLayout';

function renderAt(path: string) {
  return renderRoutes(
    [
      { path: '/login', element: <h1>관리자 토큰 입력</h1> },
      {
        element: <AuthenticatedLayout />,
        children: [
          { path: '/', element: <h1>대시보드</h1> },
          { path: '/vehicles/:vehicleId', element: <h1>차량 상세</h1> },
          { path: '/campaigns/new', element: <h1>캠페인 만들기</h1> },
        ],
      },
    ],
    path,
  );
}

describe('AuthenticatedLayout', () => {
  beforeEach(() => {
    tokenStorage.set('orbit-admin-token-3f9a');
  });

  it('사이드바와 화면 본문을 함께 보여 주고 토큰은 가린다', async () => {
    renderAt('/');

    expect(await screen.findByRole('heading', { name: '대시보드' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: '주 메뉴' })).toBeInTheDocument();
    expect(screen.getByText('Bearer ••••••••3f9a')).toBeInTheDocument();
    expect(screen.queryByText(/orbit-admin-token/)).not.toBeInTheDocument();
  });

  it('차량 상세에서는 대시보드 메뉴를 선택 상태로 둔다', async () => {
    renderAt('/vehicles/VH-001');

    await screen.findByRole('heading', { name: '차량 상세' });
    expect(screen.getByRole('link', { name: '대시보드' })).toHaveAttribute('aria-current', 'page');
  });

  it('하위 화면에서는 해당 메뉴만 선택 상태로 둔다', async () => {
    renderAt('/campaigns/new');

    await screen.findByRole('heading', { name: '캠페인 만들기' });
    expect(screen.getByRole('link', { name: '캠페인' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '대시보드' })).not.toHaveAttribute('aria-current');
  });

  it('토큰 변경을 누르면 토큰과 받은 데이터를 지우고 토큰 입력 화면으로 보낸다', async () => {
    const user = userEvent.setup();
    const { router, queryClient } = renderAt('/');
    queryClient.setQueryData(['campaigns'], []);

    await user.click(await screen.findByRole('button', { name: '토큰 변경' }));

    expect(await screen.findByRole('heading', { name: '관리자 토큰 입력' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
    expect(tokenStorage.get()).toBeNull();
    expect(queryClient.getQueryData(['campaigns'])).toBeUndefined();
  });
});
