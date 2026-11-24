/** 대시보드 query key. 스냅샷 조회와 SSE 구독이 같은 key 를 쓴다 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  vehicles: () => [...dashboardKeys.all, 'vehicles'] as const,
  cdnEdges: () => [...dashboardKeys.all, 'cdn-edges'] as const,
};
