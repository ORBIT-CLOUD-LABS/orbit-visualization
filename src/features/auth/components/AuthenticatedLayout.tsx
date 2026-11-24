import { Outlet } from 'react-router';

import { tokenStorage } from '@/shared/auth/tokenStorage';
import { AppLayout } from '@/shared/ui/AppLayout';
import { Sidebar } from '@/shared/ui/Sidebar';

import { useChangeToken } from '../hooks/useChangeToken';
import { maskToken } from '../maskToken';
import { NAV_ITEMS } from './navItems';

/** 토큰이 필요한 화면의 틀. 사이드바에 가린 토큰과 토큰 변경을 둔다 */
export function AuthenticatedLayout() {
  const changeToken = useChangeToken();
  const token = tokenStorage.get();

  return (
    <AppLayout
      sidebar={
        <Sidebar
          items={NAV_ITEMS}
          maskedToken={token === null ? '' : maskToken(token)}
          onChangeToken={changeToken}
        />
      }
    >
      <Outlet />
    </AppLayout>
  );
}
