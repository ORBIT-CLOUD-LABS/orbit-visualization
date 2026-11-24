import 'leaflet/dist/leaflet.css';

import { useCallback, useMemo, useRef, useState } from 'react';
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
import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { Alert } from '@/shared/ui/Alert';

import { buildEdgeLinks } from '../lib/buildEdgeLinks';
import { computeMapBounds } from '../lib/computeMapBounds';
import { createMapPathStyles, readDocumentTokenColor } from '../lib/createMapPathStyles';
import type { LatLng, VehicleMarker } from '../lib/toVehicleMarkers';

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

// leaflet.css 는 layer 밖이라 Tailwind 유틸리티보다 우선한다. 같은 요소의 색은 ! 로 덮는다
const EDGE_LABEL_CLASS = {
  healthy: 'font-sans text-2xs font-medium text-fg!',
  unhealthy: 'font-sans text-2xs font-medium text-danger!',
} as const;

function healthKey(edge: CdnEdgeStatus): 'healthy' | 'unhealthy' {
  return edge.healthy ? 'healthy' : 'unhealthy';
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
        <FitBoundsOnce getBounds={isReadyToFit ? getBounds : null} />
        {/* Leaflet pane 의 z-index 는 CSS 클래스가 아니라 pane 요소 style 로 정한다 */}
        <Pane name={PANES.links.name} style={{ zIndex: PANES.links.zIndex }}>
          {links.map((link) => (
            <Polyline
              key={link.id}
              positions={link.positions}
              pathOptions={styles.link[link.kind]}
              interactive={false}
            />
          ))}
        </Pane>
        <Pane name={PANES.vehicles.name} style={{ zIndex: PANES.vehicles.zIndex }}>
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
        <Pane name={PANES.edges.name} style={{ zIndex: PANES.edges.zIndex }}>
          {edgeMarkers.map(({ edge, position }) => (
            <CircleMarker
              key={edge.edgeId}
              center={position}
              radius={9}
              pathOptions={styles.edge[healthKey(edge)]}
            >
              {/* Leaflet 은 툴팁 className 을 처음에만 붙이므로 상태가 바뀌면 툴팁만 새로 만든다 */}
              <Tooltip
                key={healthKey(edge)}
                permanent
                direction="bottom"
                offset={[0, 10]}
                className={EDGE_LABEL_CLASS[healthKey(edge)]}
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
