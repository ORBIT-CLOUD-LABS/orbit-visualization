import { useMemo } from 'react';

import { useCdnEdges } from '@/shared/cdnEdge/useCdnEdges';
import { toQueryState, type QueryState } from '@/shared/lib/toQueryState';
import { Topbar } from '@/shared/ui/Topbar';

import type { VehicleStatus } from '../api/vehicleStatusSchema';
import { useDashboardVehicles } from '../hooks/useDashboardVehicles';
import { countVehicleResults } from '../lib/countVehicleResults';

import { CdnEdgeStatusCard } from './CdnEdgeStatusCard';
import { DisconnectedAlert } from './DisconnectedAlert';
import { LiveConnectionStatus } from './LiveConnectionStatus';
import { VehicleListCard } from './VehicleListCard';
import { VehicleMapCard } from './VehicleMapCard';
import { VehicleStatCards } from './VehicleStatCards';

/** 02 대시보드. 차량 상태를 실시간으로 보여 준다 */
export function DashboardPage() {
  const { query, connection } = useDashboardVehicles();
  const cdnEdgesQuery = useCdnEdges();
  const vehicles = query.data?.vehicles;
  // SSE 변경분도 setQueryData 로 들어오므로 dataUpdatedAt 이 마지막 갱신 시각이다
  const lastUpdatedAt = query.dataUpdatedAt === 0 ? null : query.dataUpdatedAt;
  const counts = useMemo(
    () => (vehicles === undefined ? null : countVehicleResults(vehicles)),
    [vehicles],
  );

  const snapshotState = toQueryState(query);
  const vehicleState: QueryState<readonly VehicleStatus[]> =
    snapshotState.status === 'success'
      ? { status: 'success', data: snapshotState.data.vehicles }
      : snapshotState;
  const edgeState = toQueryState(cdnEdgesQuery);

  return (
    <>
      <Topbar
        title="대시보드"
        right={<LiveConnectionStatus status={connection.status} lastUpdatedAt={lastUpdatedAt} />}
      />
      <div className="flex flex-col gap-6 p-8">
        {connection.status === 'disconnected' && (
          <DisconnectedAlert lastUpdatedAt={lastUpdatedAt} onReconnect={connection.reconnect} />
        )}
        <VehicleStatCards counts={counts} />
        <div className="flex flex-col gap-6 xl:flex-row">
          <VehicleMapCard vehicleState={vehicleState} edgeState={edgeState} />
          <div className="xl:w-75 xl:shrink-0">
            <CdnEdgeStatusCard state={edgeState} />
          </div>
        </div>
        <VehicleListCard state={vehicleState} />
      </div>
    </>
  );
}
