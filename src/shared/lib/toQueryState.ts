import type { UseQueryResult } from '@tanstack/react-query';

import { errorCodeOf } from '@/shared/api/errorCodeOf';

/** 카드가 그릴 서버 데이터 상태. 다시 불러오다 실패해도 이미 받은 데이터가 있으면 success 다 */
export type QueryState<T> =
  | { status: 'pending' }
  | { status: 'error'; errorCode?: string; onRetry: () => void }
  | { status: 'success'; data: T };

/** Query 결과를 카드 상태로 바꾼다. 오류의 서버 code 와 다시 시도 동작을 함께 담는다 */
export function toQueryState<T>(query: UseQueryResult<T>): QueryState<T> {
  if (query.data !== undefined) {
    return { status: 'success', data: query.data };
  }
  if (query.isError) {
    return {
      status: 'error',
      errorCode: errorCodeOf(query.error),
      onRetry: () => {
        // 여러 번 눌러도 진행 중인 요청을 취소하고 다시 보내지 않는다
        void query.refetch({ cancelRefetch: false });
      },
    };
  }
  return { status: 'pending' };
}
