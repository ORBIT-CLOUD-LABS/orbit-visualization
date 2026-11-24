import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { cdnEdgeKeys } from './cdnEdgeKeys';
import type { CdnEdges, CdnEdgeStatus } from './cdnEdgeSchema';
import { getCdnEdges } from './getCdnEdges';

/** Edge 상태는 SSE 로 오지 않으므로 주기적으로 다시 조회한다 */
const CDN_EDGES_REFETCH_INTERVAL_MS = 30_000;

function selectEdges(data: CdnEdges): CdnEdgeStatus[] {
  return data.edges;
}

/** CDN Edge 상태 (서버 설정 순서). 한 화면의 여러 카드가 함께 쓰도록 화면에서 한 번 부르고 결과를 넘긴다 */
export function useCdnEdges(): UseQueryResult<CdnEdgeStatus[]> {
  return useQuery({
    queryKey: cdnEdgeKeys.all,
    queryFn: ({ signal }) => getCdnEdges(signal),
    select: selectEdges,
    refetchInterval: CDN_EDGES_REFETCH_INTERVAL_MS,
    // 대시보드와 Edge 현황을 오갈 때 주기 안에서 받은 값이면 다시 요청하지 않는다
    staleTime: CDN_EDGES_REFETCH_INTERVAL_MS,
  });
}
