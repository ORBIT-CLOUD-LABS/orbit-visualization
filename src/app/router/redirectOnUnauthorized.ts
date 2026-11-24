import type { QueryClient } from '@tanstack/react-query';
import type { createBrowserRouter } from 'react-router';

import { onUnauthorized } from '@/shared/auth/unauthorized';
import { ROUTES } from '@/shared/config/routes';

type AppRouter = Pick<ReturnType<typeof createBrowserRouter>, 'navigate'>;

/**
 * 서버가 401 을 주면 받은 서버 데이터를 지우고 01 로그인 화면으로 보낸다. 토큰은 shared 가 이미 지웠다.
 * @returns 연결을 푸는 함수
 */
export function redirectOnUnauthorized(router: AppRouter, queryClient: QueryClient): () => void {
  return onUnauthorized(() => {
    queryClient.clear();
    void router.navigate(ROUTES.login, { replace: true });
  });
}
