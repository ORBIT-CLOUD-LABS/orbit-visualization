import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { haversineDistanceKm } from '@/shared/map/haversineDistanceKm';
import type { LatLng } from '@/shared/map/latLng';

export type NearestEdge = {
  edge: CdnEdgeStatus;
  distanceKm: number;
};

/**
 * 좌표에서 직선(대원) 거리가 가장 가까운 Edge. 정상 여부는 따지지 않는다.
 * 거리가 같으면 목록에서 먼저 나온 Edge 를 고른다. Edge 가 없으면 null
 */
export function findNearestEdge(
  position: LatLng,
  edges: readonly CdnEdgeStatus[],
): NearestEdge | null {
  let nearest: NearestEdge | null = null;
  for (const edge of edges) {
    const distanceKm = haversineDistanceKm(position, [edge.latitude, edge.longitude]);
    if (nearest === null || distanceKm < nearest.distanceKm) {
      nearest = { edge, distanceKm };
    }
  }
  return nearest;
}
