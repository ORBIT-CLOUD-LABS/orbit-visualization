import { useCallback, useMemo } from 'react';
import { CircleMarker, Polyline } from 'react-leaflet';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { BaseMap } from '@/shared/map/BaseMap';
import { CdnEdgeLayer } from '@/shared/map/CdnEdgeLayer';
import { computeMapBounds } from '@/shared/map/computeMapBounds';
import { FitBoundsOnce } from '@/shared/map/FitBoundsOnce';
import type { LatLng } from '@/shared/map/latLng';
import { MapPane } from '@/shared/map/MapPane';
import { useMapPathStyles } from '@/shared/map/useMapPathStyles';
import type { VehicleMarkerTone } from '@/shared/map/vehicleMarkerTone';

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

function toLatLng(edge: CdnEdgeStatus): LatLng {
  return [edge.latitude, edge.longitude];
}

/** 차량 한 대의 마지막 위치와 Edge, 배정 Edge 로 가는 선을 그리는 작은 지도 */
export function VehicleMiniMap({
  position,
  tone,
  assignedEdgeId,
  edges,
  nearestEdgeId,
  isReadyToFit,
}: VehicleMiniMapProps) {
  const styles = useMapPathStyles();
  const assignedEdge = edges.find((edge) => edge.edgeId === assignedEdgeId);
  // 좌표 배열이 바뀌면 Leaflet 이 선을 다시 그리므로 끝점이 바뀔 때만 만든다
  const assignedLink = useMemo(
    (): [LatLng, LatLng] | null =>
      assignedEdge === undefined ? null : [position, toLatLng(assignedEdge)],
    [position, assignedEdge],
  );
  // 차량과 배정·가까운 Edge 가 모두 보이게 맞춘다. 먼 Edge 까지 담으면 차량 주변이 너무 작아진다
  const getBounds = useCallback(
    () =>
      computeMapBounds([
        position,
        ...edges
          .filter((edge) => edge === assignedEdge || edge.edgeId === nearestEdgeId)
          .map(toLatLng),
      ]),
    [position, edges, assignedEdge, nearestEdgeId],
  );

  return (
    <BaseMap className="h-50" tileErrorMessage="지도를 불러오지 못했습니다.">
      <FitBoundsOnce
        getBounds={isReadyToFit ? getBounds : null}
        // 위치가 바뀌거나, 받지 못했던 Edge 를 나중에 받으면 범위를 다시 맞춘다
        fitKey={`${position.join(',')}:${edges.length > 0 ? 'with-edges' : 'vehicle-only'}`}
      />
      <MapPane layer="links">
        {assignedLink !== null && (
          <Polyline
            positions={assignedLink}
            pathOptions={styles.link.assigned}
            interactive={false}
          />
        )}
      </MapPane>
      <MapPane layer="vehicles">
        <CircleMarker
          center={position}
          radius={6}
          pathOptions={styles.vehicle[tone]}
          interactive={false}
        />
      </MapPane>
      <CdnEdgeLayer edges={edges} pathStyles={styles.edge} />
    </BaseMap>
  );
}
