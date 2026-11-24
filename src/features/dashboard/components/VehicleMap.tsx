import { useCallback, useMemo } from 'react';
import { CircleMarker, Polyline, Popup } from 'react-leaflet';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { BaseMap } from '@/shared/map/BaseMap';
import { CdnEdgeLayer } from '@/shared/map/CdnEdgeLayer';
import { computeMapBounds } from '@/shared/map/computeMapBounds';
import { FitBoundsOnce } from '@/shared/map/FitBoundsOnce';
import type { LatLng } from '@/shared/map/latLng';
import { MapPane } from '@/shared/map/MapPane';
import { useMapPathStyles } from '@/shared/map/useMapPathStyles';

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
  const styles = useMapPathStyles();
  const links = useMemo(() => buildEdgeLinks(markers, edges), [markers, edges]);
  const getBounds = useCallback(
    () =>
      computeMapBounds([
        ...markers.map((marker) => marker.position),
        ...edges.map((edge): LatLng => [edge.latitude, edge.longitude]),
      ]),
    [markers, edges],
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
      <MapPane layer="links">
        {links.map((link) => (
          <Polyline
            key={link.id}
            positions={link.positions}
            pathOptions={styles.link[link.kind]}
            interactive={false}
          />
        ))}
      </MapPane>
      <MapPane layer="vehicles">
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
      </MapPane>
      <CdnEdgeLayer edges={edges} pathStyles={styles.edge} />
    </BaseMap>
  );
}
