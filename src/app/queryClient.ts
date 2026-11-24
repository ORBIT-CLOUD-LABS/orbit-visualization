import { QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/shared/api/ApiError';

const MAX_RETRIES = 2;
const CLIENT_ERROR_MIN = 400;
const SERVER_ERROR_MIN = 500;

// 4xx 는 다시 보내도 결과가 같으므로 재시도하지 않는다
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (
    error instanceof ApiError &&
    error.status >= CLIENT_ERROR_MIN &&
    error.status < SERVER_ERROR_MIN
  ) {
    return false;
  }
  return failureCount < MAX_RETRIES;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: shouldRetry },
      mutations: { retry: false },
    },
  });
}
