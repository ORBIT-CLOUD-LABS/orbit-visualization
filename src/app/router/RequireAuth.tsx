import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

import { tokenStorage } from '@/shared/auth/tokenStorage';
import { ROUTES } from '@/shared/config/routes';

type RequireAuthProps = {
  /** 토큰이 있을 때 그릴 화면. 보통 하위 라우트를 그리는 레이아웃 */
  children: ReactNode;
};

/** 저장된 관리자 토큰이 없으면 01 로그인 화면으로 보낸다 */
export function RequireAuth({ children }: RequireAuthProps) {
  if (tokenStorage.get() === null) {
    return <Navigate to={ROUTES.login} replace />;
  }
  return children;
}
