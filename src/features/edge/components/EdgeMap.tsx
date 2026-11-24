import { useCallback } from 'react';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { BaseMap } from '@/shared/map/BaseMap';
import { CdnEdgeLayer } from '@/shared/map/CdnEdgeLayer';
import { computeMapBounds } from '@/shared/map/computeMapBounds';
import { FitBoundsOnce } from '@/shared/map/FitBoundsOnce';
import type { LatLng } from '@/shared/map/latLng';
import { useMapPathStyles } from '@/shared/map/useMapPathStyles';

import { EdgeMapLegend } from './EdgeMapLegend';
import { EdgeMarkerPopup } from './EdgeMarkerPopup';

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
          {edges.length === 0 && (
            <p className="pointer-events-none absolute inset-x-0 top-1/2 z-1000 mx-auto w-fit -translate-y-1/2 rounded-sm bg-surface px-3 py-1.5 text-xs text-fg-muted">
              등록된 CDN Edge가 없습니다
            </p>
          )}
          <EdgeMapLegend className="absolute bottom-3 left-3 z-1000" />
        </>
      }
    >
      {/* Edge 가 없다가 생기면 그때 한 번 더 맞춘다 */}
      <FitBoundsOnce getBounds={getBounds} fitKey={edges.length === 0 ? 'empty' : 'edges'} />
      <CdnEdgeLayer edges={edges} pathStyles={styles.edge} renderPopup={renderEdgePopup} />
    </BaseMap>
  );
}
