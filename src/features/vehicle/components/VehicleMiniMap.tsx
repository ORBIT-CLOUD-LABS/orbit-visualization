import { useCallback, useMemo, useState } from 'react';
import { CircleMarker, Pane, Polyline } from 'react-leaflet';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { BaseMap } from '@/shared/map/BaseMap';
import { CdnEdgeMarker } from '@/shared/map/CdnEdgeMarker';
import { computeMapBounds } from '@/shared/map/computeMapBounds';
import { createMapPathStyles, readDocumentTokenColor } from '@/shared/map/createMapPathStyles';
import { FitBoundsOnce } from '@/shared/map/FitBoundsOnce';
import type { LatLng } from '@/shared/map/latLng';
import { MAP_PANES } from '@/shared/map/mapPanes';
import type { VehicleMarkerTone } from '@/shared/map/vehicleMarkerTone';

type EdgePoint = { edge: CdnEdgeStatus; position: LatLng };

type VehicleMiniMapProps = {
  position: LatLng;
  tone: VehicleMarkerTone;
  assignedEdgeId: string | null;
  /** 지도에 그릴 Edge. 받지 못했으면 빈 목록 */
  edges: readonly CdnEdgeStatus[];
  /** 가장 가까운 Edge. 차량·배정 Edge 와 함께 처음 화면에 담는다 */
  nearestEdgeId: string | null;
  /** Edge 를 받았거나 끝내 받지 못했으면 true. 이때 처음 한 번 범위를 맞춘다 */
  isReadyToFit: boolean;
};

/** 차량 한 대의 마지막 위치와 Edge, 배정 Edge 로 가는 선을 그리는 작은 지도 */
export function VehicleMiniMap({
  position,
  tone,
  assignedEdgeId,
  edges,
  nearestEdgeId,
  isReadyToFit,
}: VehicleMiniMapProps) {
  // 토큰 색은 테마가 바뀌지 않으므로 처음 한 번만 읽는다
  const [styles] = useState(() => createMapPathStyles(readDocumentTokenColor));
  // 좌표 배열이 바뀌면 Leaflet 이 다시 그리므로 Edge 가 바뀔 때만 만든다
  const edgePoints = useMemo(
    () => edges.map((edge): EdgePoint => ({ edge, position: [edge.latitude, edge.longitude] })),
    [edges],
  );
  const assignedLink = useMemo((): [LatLng, LatLng] | null => {
    const assigned = edgePoints.find(({ edge }) => edge.edgeId === assignedEdgeId);
    return assigned === undefined ? null : [position, assigned.position];
  }, [position, edgePoints, assignedEdgeId]);
  // 차량과 배정·가까운 Edge 가 모두 보이게 맞춘다. 먼 Edge 까지 담으면 차량 주변이 너무 작아진다
  const getBounds = useCallback(
    () =>
      computeMapBounds([
        position,
        ...edgePoints
          .filter(({ edge }) => edge.edgeId === assignedEdgeId || edge.edgeId === nearestEdgeId)
          .map((point) => point.position),
      ]),
    [position, edgePoints, assignedEdgeId, nearestEdgeId],
  );

  return (
    <BaseMap className="h-50" tileErrorMessage="지도를 불러오지 못했습니다.">
      <FitBoundsOnce getBounds={isReadyToFit ? getBounds : null} />
      <Pane name={MAP_PANES.links.name} style={{ zIndex: MAP_PANES.links.zIndex }}>
        {assignedLink !== null && (
          <Polyline
            positions={assignedLink}
            pathOptions={styles.link.assigned}
            interactive={false}
          />
        )}
      </Pane>
      <Pane name={MAP_PANES.vehicles.name} style={{ zIndex: MAP_PANES.vehicles.zIndex }}>
        <CircleMarker
          center={position}
          radius={6}
          pathOptions={styles.vehicle[tone]}
          interactive={false}
        />
      </Pane>
      <Pane name={MAP_PANES.edges.name} style={{ zIndex: MAP_PANES.edges.zIndex }}>
        {edgePoints.map(({ edge, position: edgePosition }) => (
          <CdnEdgeMarker
            key={edge.edgeId}
            edge={edge}
            position={edgePosition}
            pathStyles={styles.edge}
          />
        ))}
      </Pane>
    </BaseMap>
  );
}
