import { useCallback, useMemo, useState } from 'react';
import { CircleMarker, Pane, Polyline, Popup } from 'react-leaflet';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { BaseMap } from '@/shared/map/BaseMap';
import { CdnEdgeMarker } from '@/shared/map/CdnEdgeMarker';
import { computeMapBounds } from '@/shared/map/computeMapBounds';
import { createMapPathStyles, readDocumentTokenColor } from '@/shared/map/createMapPathStyles';
import { FitBoundsOnce } from '@/shared/map/FitBoundsOnce';
import type { LatLng } from '@/shared/map/latLng';
import { MAP_PANES } from '@/shared/map/mapPanes';

import { buildEdgeLinks } from '../lib/buildEdgeLinks';
import type { VehicleMarker } from '../lib/toVehicleMarkers';

import { VehicleMapLegend } from './VehicleMapLegend';
import { VehicleMarkerPopup } from './VehicleMarkerPopup';

type VehicleMapProps = {
  markers: readonly VehicleMarker[];
  edges: readonly CdnEdgeStatus[];
  /** 차량과 Edge 를 다 받았으면 true. 이때 처음 한 번 모든 마커가 보이게 맞춘다 */
  isReadyToFit: boolean;
};

/** 차량 마지막 위치와 Edge 대표 좌표를 그리는 Leaflet 지도 */
export function VehicleMap({ markers, edges, isReadyToFit }: VehicleMapProps) {
  // 토큰 색은 테마가 바뀌지 않으므로 처음 한 번만 읽는다
  const [styles] = useState(() => createMapPathStyles(readDocumentTokenColor));
  // 좌표 배열이 바뀌면 Leaflet 이 다시 그리므로 Edge 가 바뀔 때만 만든다
  const edgeMarkers = useMemo(
    () => edges.map((edge) => ({ edge, position: [edge.latitude, edge.longitude] as LatLng })),
    [edges],
  );
  const links = useMemo(() => buildEdgeLinks(markers, edges), [markers, edges]);
  const getBounds = useCallback(
    () =>
      computeMapBounds([
        ...markers.map((marker) => marker.position),
        ...edgeMarkers.map(({ position }) => position),
      ]),
    [markers, edgeMarkers],
  );

  return (
    <BaseMap
      className="min-h-52.5 flex-1"
      tileErrorMessage="지도를 불러오지 못했습니다. 차량 목록은 그대로 볼 수 있습니다."
      overlay={
        <>
          {markers.length === 0 && (
            <p className="pointer-events-none absolute inset-x-0 top-1/2 z-1000 mx-auto w-fit -translate-y-1/2 rounded-sm bg-surface px-3 py-1.5 text-xs text-fg-muted">
              위치를 보낸 차량이 없습니다
            </p>
          )}
          <VehicleMapLegend className="absolute bottom-3 left-3 z-1000" />
        </>
      }
    >
      <FitBoundsOnce getBounds={isReadyToFit ? getBounds : null} />
      <Pane name={MAP_PANES.links.name} style={{ zIndex: MAP_PANES.links.zIndex }}>
        {links.map((link) => (
          <Polyline
            key={link.id}
            positions={link.positions}
            pathOptions={styles.link[link.kind]}
            interactive={false}
          />
        ))}
      </Pane>
      <Pane name={MAP_PANES.vehicles.name} style={{ zIndex: MAP_PANES.vehicles.zIndex }}>
        {markers.map((marker) => (
          <CircleMarker
            key={marker.vehicleId}
            center={marker.position}
            radius={4}
            pathOptions={styles.vehicle[marker.tone]}
          >
            <Popup>
              <VehicleMarkerPopup marker={marker} />
            </Popup>
          </CircleMarker>
        ))}
      </Pane>
      <Pane name={MAP_PANES.edges.name} style={{ zIndex: MAP_PANES.edges.zIndex }}>
        {edgeMarkers.map(({ edge, position }) => (
          <CdnEdgeMarker
            key={edge.edgeId}
            edge={edge}
            position={position}
            pathStyles={styles.edge}
          />
        ))}
      </Pane>
    </BaseMap>
  );
}
