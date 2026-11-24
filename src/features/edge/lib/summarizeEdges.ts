import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';

export type EdgeSummary = {
  total: number;
  healthy: number;
  unhealthy: number;
  assignedVehicles: number;
};

/** 요약 카드에 쓸 Edge 수·정상/장애 수·배정 차량 합계 */
export function summarizeEdges(edges: readonly CdnEdgeStatus[]): EdgeSummary {
  const healthy = edges.filter((edge) => edge.healthy).length;
  return {
    total: edges.length,
    healthy,
    unhealthy: edges.length - healthy,
    assignedVehicles: edges.reduce((sum, edge) => sum + edge.assignedVehicles, 0),
  };
}
