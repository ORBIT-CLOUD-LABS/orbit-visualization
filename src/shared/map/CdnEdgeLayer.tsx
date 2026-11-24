import type { PathOptions } from 'leaflet';
import type { ReactElement } from 'react';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';

import { CdnEdgeMarker } from './CdnEdgeMarker';
import { MapPane } from './MapPane';

type CdnEdgeLayerProps = {
  edges: readonly CdnEdgeStatus[];
  pathStyles: Record<'healthy' | 'unhealthy', PathOptions>;
  /** Edge 마다 마커 팝업 내용을 만든다. 없으면 팝업을 달지 않는다 */
  renderPopup?: (edge: CdnEdgeStatus) => ReactElement | undefined;
};

/** 모든 Edge 마커를 차량·선 위 pane 에 그린다 */
export function CdnEdgeLayer({ edges, pathStyles, renderPopup }: CdnEdgeLayerProps) {
  return (
    <MapPane layer="edges">
      {edges.map((edge) => (
        <CdnEdgeMarker
          key={edge.edgeId}
          edge={edge}
          pathStyles={pathStyles}
          popup={renderPopup?.(edge)}
        />
      ))}
    </MapPane>
  );
}
