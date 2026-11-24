import { useCallback } from 'react';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { BaseMap } from '@/shared/map/BaseMap';
import { CdnEdgeLayer } from '@/shared/map/CdnEdgeLayer';
import { computeMapBounds } from '@/shared/map/computeMapBounds';
import { FitBoundsOnce } from '@/shared/map/FitBoundsOnce';
import type { LatLng } from '@/shared/map/latLng';
import { MapEmptyNotice } from '@/shared/map/MapEmptyNotice';
import { MapLegend, type MapLegendItem } from '@/shared/map/MapLegend';
import { useMapPathStyles } from '@/shared/map/useMapPathStyles';
import { TONE_CLASS } from '@/shared/ui/toneClass';

import { EdgeMarkerPopup } from './EdgeMarkerPopup';

const LEGEND_ITEMS: readonly MapLegendItem[] = [
  { label: 'Edge(정상)', shape: 'dot', colorClass: 'bg-primary' },
  { label: 'Edge(장애)', shape: 'dot', colorClass: TONE_CLASS.danger.dot },
];

function renderEdgePopup(edge: CdnEdgeStatus) {
  return <EdgeMarkerPopup edge={edge} />;
}

type EdgeMapProps = {
  edges: readonly CdnEdgeStatus[];
};

/** Edge 대표 좌표를 그리는 Leaflet 지도. 처음 받은 Edge 가 모두 보이게 한 번 맞춘다 */
export function EdgeMap({ edges }: EdgeMapProps) {
  const styles = useMapPathStyles();
  const getBounds = useCallback(
    () => computeMapBounds(edges.map((edge): LatLng => [edge.latitude, edge.longitude])),
    [edges],
  );

  return (
    <BaseMap
      className="min-h-52.5 flex-1"
      tileErrorMessage="지도를 불러오지 못했습니다. Edge 목록은 그대로 볼 수 있습니다."
      overlay={
        <>
          {edges.length === 0 && <MapEmptyNotice>등록된 CDN Edge가 없습니다</MapEmptyNotice>}
          <MapLegend items={LEGEND_ITEMS} className="absolute bottom-3 left-3 z-1000" />
        </>
      }
    >
      {/* Edge 가 처음 생겼을 때 한 번만 맞춘다. 이후 잠깐 비었다 돌아와도 사용자가 옮긴 화면을 유지한다 */}
      <FitBoundsOnce getBounds={getBounds} />
      <CdnEdgeLayer edges={edges} pathStyles={styles.edge} renderPopup={renderEdgePopup} />
    </BaseMap>
  );
}
