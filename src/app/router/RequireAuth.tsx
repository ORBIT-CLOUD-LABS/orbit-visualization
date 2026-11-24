import { Navigate, Outlet } from 'react-router';

import { tokenStorage } from '@/shared/auth/tokenStorage';
import { ROUTES } from '@/shared/config/routes';

/** 저장된 관리자 토큰이 없으면 01 로그인 화면으로 보낸다 */
export function RequireAuth() {
  if (tokenStorage.get() === null) {
    return <Navigate to={ROUTES.login} replace />;
  }
  return <Outlet />;
}
