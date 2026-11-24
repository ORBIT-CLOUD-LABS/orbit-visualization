import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { tokenStorage } from '@/shared/auth/tokenStorage';
import { ROUTES } from '@/shared/config/routes';

/** 저장된 토큰과 그 토큰으로 받은 서버 데이터를 지우고 01 토큰 입력 화면으로 보내는 함수를 돌려준다 */
export function useChangeToken(): () => void {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 화면을 먼저 내린 뒤 캐시를 비운다. 반대로 하면 떠 있는 쿼리가 토큰 없이 다시 요청한다
  async function changeToken(): Promise<void> {
    tokenStorage.clear();
    await navigate(ROUTES.login, { replace: true });
    queryClient.clear();
  }

  return () => {
    void changeToken();
  };
}
