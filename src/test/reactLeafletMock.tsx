// jsdom 에는 지도 크기·SVG 계산이 없어 Leaflet 이 제대로 그려지지 않는다.
// 테스트 파일에서 vi.mock('react-leaflet', () => import('@/test/reactLeafletMock')) 로 바꿔 쓴다.
// 레이어는 그리지 않고, 사용자가 읽는 글자(팝업·툴팁 내용)만 그대로 그린다.
import type { ReactNode } from 'react';
import { vi } from 'vitest';

type ChildrenProps = { children?: ReactNode };

/** useMap 이 돌려주는 가짜 지도. fitBounds 호출을 확인할 수 있다 */
export const mockLeafletMap = {
  fitBounds: vi.fn(),
};

export function useMap() {
  return mockLeafletMap;
}

export function MapContainer({ children }: ChildrenProps) {
  return <div>{children}</div>;
}

export function Pane({ children }: ChildrenProps) {
  return <>{children}</>;
}

export function CircleMarker({ children }: ChildrenProps) {
  return <>{children}</>;
}

export function Popup({ children }: ChildrenProps) {
  return <div>{children}</div>;
}

export function Tooltip({ children }: ChildrenProps) {
  return <span>{children}</span>;
}

type TileLayerProps = { eventHandlers?: Record<string, () => void> };

/** 마지막으로 그린 TileLayer 의 이벤트 핸들러. 타일 로드 실패 같은 지도 이벤트를 흉내 낼 때 부른다 */
export const mockTileLayer: TileLayerProps = {};

export function TileLayer({ eventHandlers }: TileLayerProps) {
  mockTileLayer.eventHandlers = eventHandlers;
  return null;
}

export function Polyline() {
  return null;
}
