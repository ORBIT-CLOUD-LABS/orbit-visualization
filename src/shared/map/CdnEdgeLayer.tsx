import type { PathOptions } from 'leaflet';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';

import { CdnEdgeMarker } from './CdnEdgeMarker';
import { MapPane } from './MapPane';

type CdnEdgeLayerProps = {
  edges: readonly CdnEdgeStatus[];
  pathStyles: Record<'healthy' | 'unhealthy', PathOptions>;
};

/** 모든 Edge 마커를 차량·선 위 pane 에 그린다 */
export function CdnEdgeLayer({ edges, pathStyles }: CdnEdgeLayerProps) {
  return (
    <MapPane layer="edges">
      {edges.map((edge) => (
        <CdnEdgeMarker key={edge.edgeId} edge={edge} pathStyles={pathStyles} />
      ))}
    </MapPane>
  );
}
