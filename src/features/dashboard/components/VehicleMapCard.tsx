import { useMemo, useState } from 'react';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import type { QueryState } from '@/shared/lib/toQueryState';
import { MapSkeleton } from '@/shared/map/MapSkeleton';
import { Card } from '@/shared/ui/Card';
import { LoadErrorAlert } from '@/shared/ui/LoadErrorAlert';

import type { VehicleStatus } from '../api/vehicleStatusSchema';
import {
  toVehicleMarkers,
  type VehicleMarker,
  type VehicleMarkerCache,
} from '../lib/toVehicleMarkers';

import { VehicleMap } from './VehicleMap';

const NO_MARKERS: readonly VehicleMarker[] = [];
const NO_EDGES: readonly CdnEdgeStatus[] = [];

type VehicleMapCardProps = {
  vehicleState: QueryState<readonly VehicleStatus[]>;
  /** Edge 상태. 받지 못했으면 차량만 그린다 */
  edgeState: QueryState<readonly CdnEdgeStatus[]>;
};

/** 차량 위치와 배정 Edge 지도 카드 */
export function VehicleMapCard({ vehicleState, edgeState }: VehicleMapCardProps) {
  const [markerCache] = useState<VehicleMarkerCache>(() => new WeakMap());
  const vehicles = vehicleState.status === 'success' ? vehicleState.data : undefined;
  const markers = useMemo(
    () => (vehicles === undefined ? NO_MARKERS : toVehicleMarkers(vehicles, markerCache)),
    [vehicles, markerCache],
  );
  const unlocatedCount = vehicles === undefined ? 0 : vehicles.length - markers.length;

  function renderBody() {
    if (vehicleState.status === 'pending') {
      return <MapSkeleton label="차량 위치를 불러오는 중입니다" />;
    }
    if (vehicleState.status === 'error') {
      return (
        <LoadErrorAlert
          message="차량 위치를 불러오지 못했습니다"
          errorCode={vehicleState.errorCode}
          onRetry={vehicleState.onRetry}
        />
      );
    }
    return (
      <VehicleMap
        markers={markers}
        edges={edgeState.status === 'success' ? edgeState.data : NO_EDGES}
        // Edge 를 받았거나 끝내 받지 못했으면 처음 한 번 범위를 맞춘다
        isReadyToFit={edgeState.status !== 'pending'}
      />
    );
  }

  return (
    <Card
      title="차량 위치 · 배정 Edge"
      description={
        unlocatedCount > 0
          ? `위치 정보가 없는 차량 ${unlocatedCount}대는 지도에 표시되지 않습니다`
          : undefined
      }
      className="min-w-0 flex-1 gap-3"
    >
      {renderBody()}
    </Card>
  );
}
