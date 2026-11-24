import type { QueryClient } from '@tanstack/react-query';
import type { createBrowserRouter } from 'react-router';

import { onUnauthorized } from '@/shared/auth/unauthorized';
import { ROUTES } from '@/shared/config/routes';

type AppRouter = Pick<ReturnType<typeof createBrowserRouter>, 'navigate'>;

/**
 * 서버가 401 을 주면 01 로그인 화면으로 보내고 받은 서버 데이터를 지운다. 토큰은 shared 가 이미 지웠다.
 * @returns 연결을 푸는 함수
 */
export function redirectOnUnauthorized(router: AppRouter, queryClient: QueryClient): () => void {
  // 토큰 변경(useChangeToken)과 같은 순서다. 화면을 먼저 내려야 떠 있는 쿼리가 토큰 없이 다시 요청하지 않는다
  async function redirect(): Promise<void> {
    await router.navigate(ROUTES.login, { replace: true });
    queryClient.clear();
  }

  return onUnauthorized(() => {
    void redirect();
  });
}
