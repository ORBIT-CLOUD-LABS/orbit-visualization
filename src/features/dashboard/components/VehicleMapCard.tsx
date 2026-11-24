import { useId, useMemo } from 'react';

import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';

import type { CdnEdgeStatus } from '../api/cdnEdgeSchema';
import type { VehicleStatus } from '../api/vehicleStatusSchema';
import type { QueryState } from '../lib/toQueryState';
import { toVehicleMarkers, type VehicleMarker } from '../lib/toVehicleMarkers';

import { VehicleMap } from './VehicleMap';

const NO_MARKERS: readonly VehicleMarker[] = [];

type VehicleMapCardProps = {
  vehicleState: QueryState<readonly VehicleStatus[]>;
  /** Edge 상태. 받기 전이나 받지 못했으면 빈 목록이고 차량만 그린다 */
  edges: readonly CdnEdgeStatus[];
  /** Edge 조회가 끝났으면(성공·실패) true. 처음 범위를 맞추는 시점을 정한다 */
  isEdgesSettled: boolean;
};

/** 차량 위치와 배정 Edge 지도 카드 */
export function VehicleMapCard({ vehicleState, edges, isEdgesSettled }: VehicleMapCardProps) {
  const headingId = useId();
  const vehicles = vehicleState.status === 'success' ? vehicleState.data : undefined;
  const markers = useMemo(
    () => (vehicles === undefined ? NO_MARKERS : toVehicleMarkers(vehicles)),
    [vehicles],
  );
  const unlocatedCount = vehicles === undefined ? 0 : vehicles.length - markers.length;

  function renderBody() {
    if (vehicleState.status === 'pending') {
      return (
        <div aria-busy="true" className="min-h-52.5 flex-1 animate-pulse rounded-lg bg-map">
          <p className="sr-only">차량 위치를 불러오는 중입니다</p>
        </div>
      );
    }
    if (vehicleState.status === 'error') {
      return (
        <Alert
          type="error"
          title="차량 위치를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
          code={vehicleState.errorCode}
          action={
            <Button variant="secondary" onClick={vehicleState.onRetry}>
              다시 시도
            </Button>
          }
        />
      );
    }
    return <VehicleMap markers={markers} edges={edges} isReadyToFit={isEdgesSettled} />;
  }

  return (
    <section
      aria-labelledby={headingId}
      className="flex min-w-0 flex-1 flex-col gap-3 rounded-xl border border-line bg-surface p-5"
    >
      <div className="flex flex-col gap-0.5">
        <h2 id={headingId} className="text-md font-bold text-fg">
          차량 위치 · 배정 Edge
        </h2>
        {unlocatedCount > 0 && (
          <p className="text-xs text-fg-muted">
            위치 정보가 없는 차량 {unlocatedCount}대는 지도에 표시되지 않습니다
          </p>
        )}
      </div>
      {renderBody()}
    </section>
  );
}
