import { z } from 'zod';

import { httpClient } from '@/shared/api/httpClient';
import { parseApiResponse } from '@/shared/api/parseApiResponse';
import { bearerAuthorization } from '@/shared/auth/authorizationHeader';

/**
 * 로그인 API 가 없어 차량 상태 스냅샷 조회가 성공하는지로 토큰을 확인한다.
 * 저장 전 토큰이라 Authorization 을 직접 넘긴다. 응답 data 는 쓰지 않으므로 형식은 대시보드가 검증한다.
 * @throws 401 이면 ApiError, 응답이 없으면 NetworkError
 */
export async function verifyToken(token: string): Promise<void> {
  const response = await httpClient.get<unknown>('/dashboard/vehicles', {
    headers: { Authorization: bearerAuthorization(token) },
  });
  parseApiResponse(response.data, z.unknown());
}
