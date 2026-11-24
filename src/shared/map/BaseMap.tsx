import 'leaflet/dist/leaflet.css';

import { useMemo, useRef, useState, type ReactNode } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import { config } from '@/config';
import { cn } from '@/shared/lib/cn';
import { Alert } from '@/shared/ui/Alert';

import { InvalidateSizeOnResize } from './InvalidateSizeOnResize';
import type { LatLng } from './latLng';

const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
// 범위를 맞추기 전에는 전 세계를 보여 준다
const WORLD_CENTER: LatLng = [20, 0];
const WORLD_ZOOM = 2;

type BaseMapProps = {
  /** 지도 위에 그릴 Leaflet 레이어 */
  children: ReactNode;
  /** 첫 타일부터 불러오지 못했을 때 지도 위에 보여 줄 안내 */
  tileErrorMessage: string;
  /** 지도 위에 겹쳐 둘 요소(범례·빈 안내 등). 위치는 넘기는 쪽이 absolute 로 정한다 */
  overlay?: ReactNode;
  /** 바깥 상자 크기 */
  className?: string;
};

/** 타일·출처 표기·크기 변경 추적·타일 오류 안내를 갖춘 Leaflet 지도 틀 */
export function BaseMap({ children, tileErrorMessage, overlay, className }: BaseMapProps) {
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

  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-map', className)}>
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
        {children}
      </MapContainer>
      {hasTileError && (
        // 왼쪽 위 확대·축소 버튼을 가리지 않도록 그 오른쪽에 둔다
        <Alert
          type="error"
          title={tileErrorMessage}
          className="absolute top-3 right-3 left-14 z-1000"
        />
      )}
      {overlay}
    </div>
  );
}
