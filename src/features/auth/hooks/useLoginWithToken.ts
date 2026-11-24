import { useMutation } from '@tanstack/react-query';

import { tokenStorage } from '@/shared/auth/tokenStorage';

import { verifyToken } from '../api/verifyToken';

/** 토큰을 서버에 확인하고, 성공했을 때만 저장한다 */
export function useLoginWithToken() {
  return useMutation({
    mutationFn: async (token: string) => {
      await verifyToken(token);
      tokenStorage.set(token);
    },
  });
}
