import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { CdnEdges, CdnEdgeStatus } from '../api/cdnEdgeSchema';
import { dashboardKeys } from '../api/dashboardKeys';
import { getCdnEdges } from '../api/getCdnEdges';

/** Edge 상태는 SSE 로 오지 않으므로 주기적으로 다시 조회한다 */
export const CDN_EDGES_REFETCH_INTERVAL_MS = 30_000;

function selectEdges(data: CdnEdges): CdnEdgeStatus[] {
  return data.edges;
}

/** 대시보드 CDN Edge 상태 (서버 설정 순서). 지도와 Edge 카드가 함께 쓰도록 화면에서 한 번 부르고 결과를 넘긴다 */
export function useCdnEdges(): UseQueryResult<CdnEdgeStatus[]> {
  return useQuery({
    queryKey: dashboardKeys.cdnEdges(),
    queryFn: ({ signal }) => getCdnEdges(signal),
    select: selectEdges,
    refetchInterval: CDN_EDGES_REFETCH_INTERVAL_MS,
  });
}
