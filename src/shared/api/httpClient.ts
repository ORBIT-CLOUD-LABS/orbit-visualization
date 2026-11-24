import axios from 'axios';

import { config } from '@/config';
import { tokenStorage } from '@/shared/auth/tokenStorage';
import { reportUnauthorized } from '@/shared/auth/unauthorized';

import { NetworkError } from './NetworkError';
import { toApiError } from './toApiError';

const UNAUTHORIZED = 401;

/** 기능 코드는 axios 를 직접 쓰지 않고 이 인스턴스만 쓴다. 응답은 parseApiResponse 로 검증한다 */
export const httpClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10_000,
});

httpClient.interceptors.request.use((request) => {
  const token = tokenStorage.get();
  if (token !== null) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  return request;
});

// 실패는 ApiError(서버가 실패로 응답) 나 NetworkError(응답 없음) 로 바꾼다. 취소는 그대로 넘긴다
function normalizeError(error: unknown): unknown {
  if (!axios.isAxiosError(error) || axios.isCancel(error)) {
    return error;
  }
  const { response } = error;
  if (response === undefined) {
    return new NetworkError('서버에 연결하지 못했습니다', { cause: error });
  }
  if (response.status === UNAUTHORIZED) {
    reportUnauthorized();
  }
  return toApiError(response.status, response.data, error);
}

httpClient.interceptors.response.use(undefined, (error: unknown) =>
  Promise.reject(normalizeError(error)),
);
