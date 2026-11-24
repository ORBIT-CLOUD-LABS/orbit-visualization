import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';

import type { LatLng, VehicleMarker } from './toVehicleMarkers';

/** assigned: 매니페스트가 배정한 Edge(실선), reassigned: 배정과 다른, 실제로 파일을 받은 Edge(점선) */
export type EdgeLinkKind = 'assigned' | 'reassigned';

export type EdgeLink = {
  /** 목록 key. 차량·종류마다 하나다 */
  id: string;
  kind: EdgeLinkKind;
  positions: [from: LatLng, to: LatLng];
};

/**
 * 차량과 Edge 를 잇는 선을 만든다. 지도에 없는 Edge(설정에서 빠진 Edge 등)로는 선을 긋지 않는다.
 * 받은 Edge 가 배정 Edge 와 같으면 실선 하나만 긋는다.
 */
export function buildEdgeLinks(
  markers: readonly VehicleMarker[],
  edges: readonly CdnEdgeStatus[],
): EdgeLink[] {
  const edgePositions = new Map<string, LatLng>(
    edges.map((edge) => [edge.edgeId, [edge.latitude, edge.longitude]]),
  );
  const links: EdgeLink[] = [];

  for (const marker of markers) {
    const assigned =
      marker.assignedEdgeId === null ? undefined : edgePositions.get(marker.assignedEdgeId);
    if (assigned !== undefined) {
      links.push({
        id: `${marker.vehicleId}:assigned`,
        kind: 'assigned',
        positions: [marker.position, assigned],
      });
    }
    if (marker.downloadedEdgeId === null || marker.downloadedEdgeId === marker.assignedEdgeId) {
      continue;
    }
    const downloaded = edgePositions.get(marker.downloadedEdgeId);
    if (downloaded !== undefined) {
      links.push({
        id: `${marker.vehicleId}:reassigned`,
        kind: 'reassigned',
        positions: [marker.position, downloaded],
      });
    }
  }
  return links;
}
