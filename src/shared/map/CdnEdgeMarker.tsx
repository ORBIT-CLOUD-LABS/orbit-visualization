import type { PathOptions } from 'leaflet';
import { CircleMarker, Tooltip } from 'react-leaflet';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';

import type { LatLng } from './latLng';

// leaflet.css 는 layer 밖이라 Tailwind 유틸리티보다 우선한다. 같은 요소의 색은 ! 로 덮는다
const EDGE_LABEL_CLASS = {
  healthy: 'font-sans text-2xs font-medium text-fg!',
  unhealthy: 'font-sans text-2xs font-medium text-danger!',
} as const;

type CdnEdgeMarkerProps = {
  edge: CdnEdgeStatus;
  /** 좌표 배열이 바뀌면 Leaflet 이 다시 그리므로, Edge 가 바뀔 때만 새로 만들어 넘긴다 */
  position: LatLng;
  pathStyles: Record<'healthy' | 'unhealthy', PathOptions>;
};

/** Edge 대표 좌표의 원 마커와 이름 라벨. 장애면 라벨에 알린다 */
export function CdnEdgeMarker({ edge, position, pathStyles }: CdnEdgeMarkerProps) {
  const health = edge.healthy ? 'healthy' : 'unhealthy';

  return (
    <CircleMarker center={position} radius={9} pathOptions={pathStyles[health]}>
      {/* Leaflet 은 툴팁 className 을 처음에만 붙이므로 상태가 바뀌면 툴팁만 새로 만든다 */}
      <Tooltip
        key={health}
        permanent
        direction="bottom"
        offset={[0, 10]}
        className={EDGE_LABEL_CLASS[health]}
      >
        {edge.healthy ? edge.name : `${edge.name} (장애)`}
      </Tooltip>
    </CircleMarker>
  );
}
