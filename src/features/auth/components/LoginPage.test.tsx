import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { createQueryClient } from '@/app/queryClient';
import { server } from '@/mocks/server';
import { tokenStorage } from '@/shared/auth/tokenStorage';

import { LoginPage } from './LoginPage';

const VEHICLES_URL = '/api/v1/dashboard/vehicles';

function success() {
  return HttpResponse.json({
    isSuccess: true,
    code: 'OK',
    message: '요청에 성공했습니다.',
    data: { serverTime: '2026-11-24T00:00:00Z', vehicles: [] },
    error: null,
  });
}

function renderLogin() {
  const router = createMemoryRouter(
    [
      { path: '/login', element: <LoginPage /> },
      { path: '/', element: <h1>대시보드</h1> },
    ],
    { initialEntries: ['/login'] },
  );
  render(
    <QueryClientProvider client={createQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
}

async function submitToken(token: string) {
  const user = userEvent.setup();
  if (token !== '') {
    await user.type(screen.getByLabelText(/관리자 토큰/), token);
  }
  await user.click(screen.getByRole('button', { name: '연결하기' }));
}

describe('LoginPage', () => {
  it('토큰이 맞으면 저장하고 대시보드로 이동한다', async () => {
    let authorization: string | null = null;
    server.use(
      http.get(VEHICLES_URL, ({ request }) => {
        authorization = request.headers.get('Authorization');
        return success();
      }),
    );
    const router = renderLogin();

    await submitToken('  orbit-admin-token  ');

    expect(await screen.findByRole('heading', { name: '대시보드' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
    expect(authorization).toBe('Bearer orbit-admin-token');
    expect(tokenStorage.get()).toBe('orbit-admin-token');
  });

  it('401 이면 토큰이 틀렸다고 알리고 저장하지 않는다', async () => {
    server.use(
      http.get(VEHICLES_URL, () =>
        HttpResponse.json(
          {
            isSuccess: false,
            code: 'AUTHENTICATION_REQUIRED',
            message: '인증이 필요합니다.',
            data: null,
            error: null,
          },
          { status: 401 },
        ),
      ),
    );
    renderLogin();

    await submitToken('wrong-token');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('토큰이 올바르지 않습니다. 다시 입력해 주세요.');
    expect(alert).toHaveTextContent('401 AUTHENTICATION_REQUIRED');
    expect(tokenStorage.get()).toBeNull();
  });

  it('서버 응답이 없으면 접속 실패를 알리고 저장하지 않는다', async () => {
    server.use(http.get(VEHICLES_URL, () => HttpResponse.error()));
    renderLogin();

    await submitToken('orbit-admin-token');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    );
    expect(tokenStorage.get()).toBeNull();
  });

  it('토큰을 비우고 연결하면 요청하지 않고 입력을 요구한다', async () => {
    renderLogin();

    await submitToken('');

    expect(screen.getByText('관리자 토큰을 입력해 주세요.')).toBeInTheDocument();
    expect(screen.getByLabelText(/관리자 토큰/)).toHaveAttribute('aria-invalid', 'true');
  });

  it('공백이 든 토큰은 요청하지 않고 형식 오류를 알린다', async () => {
    renderLogin();

    await submitToken('has space');

    expect(
      screen.getByText('토큰 형식이 올바르지 않습니다. 공백 없이 입력해 주세요.'),
    ).toBeInTheDocument();
  });

  it('확인하는 동안 연결하기 버튼을 막는다', async () => {
    let respond: (() => void) | undefined;
    server.use(
      http.get(VEHICLES_URL, async () => {
        await new Promise<void>((resolve) => {
          respond = resolve;
        });
        return success();
      }),
    );
    renderLogin();

    await submitToken('orbit-admin-token');

    expect(screen.getByRole('button', { name: '연결하기' })).toBeDisabled();
    await waitFor(() => {
      expect(respond).toBeDefined();
    });
    respond?.();
    expect(await screen.findByRole('heading', { name: '대시보드' })).toBeInTheDocument();
  });

  it('이미 토큰이 있으면 대시보드로 보낸다', async () => {
    tokenStorage.set('admin-token');

    const router = renderLogin();

    expect(await screen.findByRole('heading', { name: '대시보드' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });
});
