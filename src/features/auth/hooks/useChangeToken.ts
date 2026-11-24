import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { tokenStorage } from '@/shared/auth/tokenStorage';
import { ROUTES } from '@/shared/config/routes';

/** 저장된 토큰과 그 토큰으로 받은 서버 데이터를 지우고 01 토큰 입력 화면으로 보내는 함수를 돌려준다 */
export function useChangeToken(): () => void {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    tokenStorage.clear();
    queryClient.clear();
    void navigate(ROUTES.login, { replace: true });
  };
}
