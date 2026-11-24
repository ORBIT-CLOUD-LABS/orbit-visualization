import 'leaflet/dist/leaflet.css';

import type { PathOptions } from 'leaflet';
import { useMemo, useRef, useState } from 'react';
import {
  CircleMarker,
  MapContainer,
  Pane,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
} from 'react-leaflet';

import { config } from '@/config';
import { Alert } from '@/shared/ui/Alert';

import type { CdnEdgeStatus } from '../api/cdnEdgeSchema';
import { buildEdgeLinks, type EdgeLinkKind } from '../lib/buildEdgeLinks';
import { computeMapBounds } from '../lib/computeMapBounds';
import type { LatLng, VehicleMarker } from '../lib/toVehicleMarkers';
import type { VehicleMarkerTone } from '../lib/vehicleMarkerTone';

import { FitBoundsOnce } from './FitBoundsOnce';
import { InvalidateSizeOnResize } from './InvalidateSizeOnResize';
import { VehicleMapLegend } from './VehicleMapLegend';
import { VehicleMarkerPopup } from './VehicleMarkerPopup';

const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
// 범위를 맞추기 전에는 전 세계를 보여 준다
const WORLD_CENTER: LatLng = [20, 0];
const WORLD_ZOOM = 2;

// 선 < 차량 < Edge 순으로 겹치도록 기본 overlayPane(400) 과 markerPane(600) 사이에 둔다.
// SSE 로 마커가 다시 그려져도 순서가 바뀌지 않게 그리는 순서 대신 pane 으로 정한다
const PANES = {
  links: { name: 'orbit-links', zIndex: 410 },
  vehicles: { name: 'orbit-vehicles', zIndex: 420 },
  edges: { name: 'orbit-edges', zIndex: 430 },
} as const;

// Leaflet 은 색을 SVG 속성으로 넣는다. 토큰 색을 쓰도록 CSS 클래스로 덮는다 (CSS 가 속성보다 우선한다).
// 객체가 바뀌면 react-leaflet 이 setStyle 을 부르므로 상수로 둔다
const VEHICLE_PATH_OPTIONS: Record<VehicleMarkerTone, PathOptions> = {
  success: { className: 'fill-success stroke-surface', fillOpacity: 1, weight: 1 },
  danger: { className: 'fill-danger stroke-surface', fillOpacity: 1, weight: 1 },
  neutral: { className: 'fill-neutral stroke-surface', fillOpacity: 1, weight: 1 },
};

const EDGE_PATH_OPTIONS: Record<'healthy' | 'unhealthy', PathOptions> = {
  healthy: { className: 'fill-primary stroke-surface', fillOpacity: 1, weight: 2 },
  unhealthy: { className: 'fill-danger stroke-surface', fillOpacity: 1, weight: 2 },
};

// leaflet.css 는 layer 밖이라 Tailwind 유틸리티보다 우선한다. 같은 요소의 색은 ! 로 덮는다
const EDGE_LABEL_CLASS = {
  healthy: 'font-sans text-2xs font-medium text-fg!',
  unhealthy: 'font-sans text-2xs font-medium text-danger!',
} as const;

const LINK_PATH_OPTIONS: Record<EdgeLinkKind, PathOptions> = {
  assigned: { className: 'stroke-primary', weight: 1.5 },
  reassigned: { className: 'stroke-warning', weight: 2, dashArray: '4 4' },
};

type VehicleMapProps = {
  markers: readonly VehicleMarker[];
  edges: readonly CdnEdgeStatus[];
  /** 차량과 Edge 를 다 받았으면 true. 이때 처음 한 번 모든 마커가 보이게 맞춘다 */
  isReadyToFit: boolean;
};

/** 차량 마지막 위치와 Edge 대표 좌표를 그리는 Leaflet 지도 */
export function VehicleMap({ markers, edges, isReadyToFit }: VehicleMapProps) {
  const [hasTileError, setHasTileError] = useState(false);
  // 타일이 한 장이라도 뜬 뒤의 실패(일부 확대 단계에 타일이 없는 경우 등)는 지도를 쓸 수 있으므로 알리지 않는다
  const hasLoadedTileRef = useRef(false);
  const tileEventHandlers = useMemo(
    () => ({
      tileload: () => {
        hasLoadedTileRef.current = true;
        setHasTileError(false);
      },
      tileerror: () => {
        if (!hasLoadedTileRef.current) {
          setHasTileError(true);
        }
      },
    }),
    [],
  );
  const links = useMemo(() => buildEdgeLinks(markers, edges), [markers, edges]);
  const bounds = useMemo(
    () =>
      isReadyToFit
        ? computeMapBounds([
            ...markers.map((marker) => marker.position),
            ...edges.map((edge): LatLng => [edge.latitude, edge.longitude]),
          ])
        : null,
    [isReadyToFit, markers, edges],
  );

  return (
    <div className="relative min-h-52.5 flex-1 overflow-hidden rounded-lg bg-map">
      <MapContainer
        center={WORLD_CENTER}
        zoom={WORLD_ZOOM}
        worldCopyJump
        className="absolute inset-0 bg-map!"
      >
        <TileLayer
          url={config.mapTileUrl}
          attribution={OSM_ATTRIBUTION}
          eventHandlers={tileEventHandlers}
        />
        <InvalidateSizeOnResize />
        <FitBoundsOnce bounds={bounds} />
        {/* Leaflet pane 의 z-index 는 CSS 클래스가 아니라 pane 요소 style 로 정한다 */}
        <Pane name={PANES.links.name} style={{ zIndex: PANES.links.zIndex }}>
          {links.map((link) => (
            <Polyline
              key={link.id}
              positions={link.positions}
              pathOptions={LINK_PATH_OPTIONS[link.kind]}
              interactive={false}
            />
          ))}
        </Pane>
        <Pane name={PANES.vehicles.name} style={{ zIndex: PANES.vehicles.zIndex }}>
          {markers.map((marker) => (
            // Leaflet 은 className 을 바꿔도 다시 그리지 않으므로 결과가 바뀌면 새로 만든다
            <CircleMarker
              key={`${marker.vehicleId}:${marker.tone}`}
              center={marker.position}
              radius={4}
              pathOptions={VEHICLE_PATH_OPTIONS[marker.tone]}
            >
              <Popup>
                <VehicleMarkerPopup marker={marker} />
              </Popup>
            </CircleMarker>
          ))}
        </Pane>
        <Pane name={PANES.edges.name} style={{ zIndex: PANES.edges.zIndex }}>
          {edges.map((edge) => (
            <CircleMarker
              key={`${edge.edgeId}:${String(edge.healthy)}`}
              center={[edge.latitude, edge.longitude]}
              radius={9}
              pathOptions={EDGE_PATH_OPTIONS[edge.healthy ? 'healthy' : 'unhealthy']}
            >
              <Tooltip
                permanent
                direction="bottom"
                offset={[0, 10]}
                className={EDGE_LABEL_CLASS[edge.healthy ? 'healthy' : 'unhealthy']}
              >
                {edge.healthy ? edge.name : `${edge.name} (장애)`}
              </Tooltip>
            </CircleMarker>
          ))}
        </Pane>
      </MapContainer>
      {markers.length === 0 && (
        <p className="pointer-events-none absolute inset-x-0 top-1/2 z-1000 mx-auto w-fit -translate-y-1/2 rounded-sm bg-surface px-3 py-1.5 text-xs text-fg-muted">
          위치를 보낸 차량이 없습니다
        </p>
      )}
      {hasTileError && (
        // 왼쪽 위 확대·축소 버튼을 가리지 않도록 그 오른쪽에 둔다
        <Alert
          type="error"
          title="지도를 불러오지 못했습니다. 차량 목록은 그대로 볼 수 있습니다."
          className="absolute top-3 right-3 left-14 z-1000"
        />
      )}
      <VehicleMapLegend className="absolute bottom-3 left-3 z-1000" />
    </div>
  );
}
