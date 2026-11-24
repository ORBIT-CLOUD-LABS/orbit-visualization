import { useMemo } from 'react';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { formatClockTime } from '@/shared/lib/formatClockTime';
import type { QueryState } from '@/shared/lib/toQueryState';
import type { LatLng } from '@/shared/map/latLng';
import { vehicleMarkerTone } from '@/shared/map/vehicleMarkerTone';
import { Button } from '@/shared/ui/Button';
import type { UpdateResult } from '@/shared/vehicle/updateResult';
import type { VehicleLocation } from '@/shared/vehicle/vehicleLocationSchema';

import { findNearestEdge, type NearestEdge } from '../lib/findNearestEdge';

import { Card } from './Card';
import { KeyValue } from './KeyValue';
import { VehicleMiniMap } from './VehicleMiniMap';

const COORDINATE_DIGITS = 4;
const DISTANCE_DIGITS = 1;
const NO_EDGES: readonly CdnEdgeStatus[] = [];

type VehicleLocationCardProps = {
  /** 위치를 받은 적 없으면 null */
  location: VehicleLocation | null;
  assignedEdgeId: string | null;
  /** 지도 마커 색. 결과가 없으면 null */
  lastResult: UpdateResult | null;
  /** Edge 목록. 받지 못했으면 지도에는 차량만 그린다 */
  edgeState: QueryState<readonly CdnEdgeStatus[]>;
  className?: string;
};

/** 마지막 위치 미니맵과 좌표, 가장 가까운 Edge */
export function VehicleLocationCard({
  location,
  assignedEdgeId,
  lastResult,
  edgeState,
  className,
}: VehicleLocationCardProps) {
  // 좌표 배열이 바뀌면 Leaflet 이 마커·선을 다시 놓으므로, 위치가 바뀔 때만 만든다
  const position = useMemo<LatLng | null>(
    () => (location === null ? null : [location.latitude, location.longitude]),
    [location],
  );
  const edges = edgeState.status === 'success' ? edgeState.data : NO_EDGES;
  const nearest = position === null ? null : findNearestEdge(position, edges);

  function renderNearestEdge() {
    if (position === null) {
      return null;
    }
    if (edgeState.status === 'pending') {
      return <span className="font-sans text-fg-muted">불러오는 중입니다</span>;
    }
    if (edgeState.status === 'error') {
      return (
        <span className="flex flex-wrap items-center gap-2 font-sans text-fg-muted">
          Edge 정보를 불러오지 못했습니다
          <Button variant="ghost" onClick={edgeState.onRetry}>
            다시 시도
          </Button>
        </span>
      );
    }
    return nearest === null ? null : formatNearestEdge(nearest);
  }

  return (
    <Card title="위치 · 배정 Edge" className={className}>
      {position === null ? (
        <div className="flex h-50 items-center justify-center rounded-lg bg-map">
          <p className="text-xs text-fg-muted">아직 위치를 받지 않았습니다</p>
        </div>
      ) : (
        <VehicleMiniMap
          // 새로고침으로 위치가 바뀌면 지도를 새로 만들어 범위를 다시 맞춘다
          key={position.join(',')}
          position={position}
          tone={vehicleMarkerTone(lastResult)}
          assignedEdgeId={assignedEdgeId}
          edges={edges}
          nearestEdgeId={nearest?.edge.edgeId ?? null}
          // Edge 를 받았거나 끝내 받지 못했으면 처음 한 번 범위를 맞춘다
          isReadyToFit={edgeState.status !== 'pending'}
        />
      )}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
        <KeyValue label="위도">{location?.latitude.toFixed(COORDINATE_DIGITS)}</KeyValue>
        <KeyValue label="경도">{location?.longitude.toFixed(COORDINATE_DIGITS)}</KeyValue>
        <KeyValue label="가까운 Edge (화면 계산)">{renderNearestEdge()}</KeyValue>
        <KeyValue label="위치 수신">
          {location === null ? null : formatClockTime(location.updatedAt)}
        </KeyValue>
      </dl>
    </Card>
  );
}

function formatNearestEdge({ edge, distanceKm }: NearestEdge): string {
  return `${edge.edgeId} · ${distanceKm.toFixed(DISTANCE_DIGITS)} km`;
}
