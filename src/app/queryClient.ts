import { QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/shared/api/ApiError';
import { isRetriableStatus } from '@/shared/api/isRetriableStatus';

const MAX_RETRIES = 2;

// SSE 재연결과 같은 기준으로, 다시 보내도 결과가 같은 응답은 재시도하지 않는다
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && !isRetriableStatus(error.status)) {
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
