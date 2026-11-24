import type { PathOptions } from 'leaflet';

import type { VehicleMarkerTone } from './vehicleMarkerTone';

/** assigned: 매니페스트가 배정한 Edge(실선), reassigned: 배정과 다른, 실제로 파일을 받은 Edge(점선) */
export type EdgeLinkKind = 'assigned' | 'reassigned';

export type MapPathStyles = {
  vehicle: Record<VehicleMarkerTone, PathOptions>;
  edge: Record<'healthy' | 'unhealthy', PathOptions>;
  link: Record<EdgeLinkKind, PathOptions>;
};

/** 색 토큰 이름(`--color-*` 의 `*`)을 실제 색 값으로 바꾼다 */
export type TokenColorReader = (token: string) => string;

/** 문서에 적용된 `@theme` 색 토큰을 읽는다 */
export const readDocumentTokenColor: TokenColorReader = (token) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--color-${token}`).trim();

/**
 * Leaflet 도형 스타일. Leaflet 은 색을 SVG 속성으로 넣고 className 은 처음 만들 때만 붙이므로,
 * 토큰 색을 값으로 넘겨야 결과가 바뀌었을 때 setStyle 로 마커를 다시 만들지 않고 색만 바꾼다
 */
export function createMapPathStyles(color: TokenColorReader): MapPathStyles {
  const marker = (fill: string, weight: number): PathOptions => ({
    color: color('surface'),
    fillColor: color(fill),
    fillOpacity: 1,
    weight,
  });
  return {
    vehicle: {
      success: marker('success', 1),
      danger: marker('danger', 1),
      neutral: marker('neutral', 1),
    },
    edge: {
      healthy: marker('primary', 2),
      unhealthy: marker('danger', 2),
    },
    link: {
      assigned: { color: color('primary'), weight: 1.5 },
      reassigned: { color: color('warning'), weight: 2, dashArray: '4 4' },
    },
  };
}
