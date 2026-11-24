import 'leaflet/dist/leaflet.css';

import type { PathOptions } from 'leaflet';
import { useMemo, useState } from 'react';
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

// Leaflet 은 색을 SVG 속성으로 넣는다. 토큰 색을 쓰도록 CSS 클래스로 덮는다 (CSS 가 속성보다 우선한다)
const VEHICLE_TONE_CLASS: Record<VehicleMarkerTone, string> = {
  success: 'fill-success stroke-surface',
  danger: 'fill-danger stroke-surface',
  neutral: 'fill-neutral stroke-surface',
};

const LINK_PATH_OPTIONS: Record<EdgeLinkKind, PathOptions> = {
  assigned: { className: 'stroke-primary', weight: 1.5 },
  reassigned: { className: 'stroke-warning', weight: 2, dashArray: '4 4' },
};

function vehiclePathOptions(tone: VehicleMarkerTone): PathOptions {
  return { className: VEHICLE_TONE_CLASS[tone], fillOpacity: 1, weight: 1 };
}

function edgePathOptions(isHealthy: boolean): PathOptions {
  return {
    className: isHealthy ? 'fill-primary stroke-surface' : 'fill-danger stroke-surface',
    fillOpacity: 1,
    weight: 2,
  };
}

type VehicleMapProps = {
  markers: readonly VehicleMarker[];
  edges: readonly CdnEdgeStatus[];
  /** 차량과 Edge 를 다 받았으면 true. 이때 처음 한 번 모든 마커가 보이게 맞춘다 */
  isReadyToFit: boolean;
};

/** 차량 마지막 위치와 Edge 대표 좌표를 그리는 Leaflet 지도 */
export function VehicleMap({ markers, edges, isReadyToFit }: VehicleMapProps) {
  const [hasTileError, setHasTileError] = useState(false);
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
        className="absolute inset-0"
      >
        <TileLayer
          url={config.mapTileUrl}
          attribution={OSM_ATTRIBUTION}
          eventHandlers={{ tileerror: () => setHasTileError(true) }}
        />
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
              pathOptions={vehiclePathOptions(marker.tone)}
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
              pathOptions={edgePathOptions(edge.healthy)}
            >
              <Tooltip
                permanent
                direction="bottom"
                offset={[0, 10]}
                className={
                  edge.healthy
                    ? 'font-sans text-2xs font-medium text-fg'
                    : 'font-sans text-2xs font-medium text-danger'
                }
              >
                {edge.healthy ? edge.name : `${edge.name} (장애)`}
              </Tooltip>
            </CircleMarker>
          ))}
        </Pane>
      </MapContainer>
      {markers.length === 0 && (
        <p className="pointer-events-none absolute inset-x-0 top-4 z-1000 mx-auto w-fit rounded-sm bg-surface px-3 py-1.5 text-xs text-fg-muted">
          위치를 보낸 차량이 없습니다
        </p>
      )}
      {hasTileError && (
        <Alert
          type="error"
          title="지도를 불러오지 못했습니다. 차량 목록은 그대로 볼 수 있습니다."
          className="absolute inset-x-3 top-3 z-1000"
        />
      )}
      <VehicleMapLegend className="absolute bottom-3 left-3 z-1000" />
    </div>
  );
}
