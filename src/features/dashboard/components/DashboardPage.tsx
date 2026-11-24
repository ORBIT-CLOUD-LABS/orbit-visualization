import { useMemo } from 'react';

import { ApiError } from '@/shared/api/ApiError';
import { Topbar } from '@/shared/ui/Topbar';

import { useCdnEdges } from '../hooks/useCdnEdges';
import { useDashboardVehicles } from '../hooks/useDashboardVehicles';
import { countVehicleResults } from '../lib/countVehicleResults';
import { toQueryState } from '../lib/toQueryState';

import { CdnEdgeStatusCard } from './CdnEdgeStatusCard';
import { DisconnectedAlert } from './DisconnectedAlert';
import { LiveConnectionStatus } from './LiveConnectionStatus';
import { VehicleListCard, type VehicleListState } from './VehicleListCard';
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

  // 다시 불러오다 실패해도 이미 받은 목록은 계속 보여 준다
  let listState: VehicleListState;
  if (vehicles !== undefined) {
    listState = { status: 'success', vehicles };
  } else if (query.isError) {
    listState = {
      status: 'error',
      errorCode: query.error instanceof ApiError ? query.error.code : undefined,
      onRetry: () => {
        void query.refetch();
      },
    };
  } else {
    listState = { status: 'pending' };
  }
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
          {/* #20: 차량 위치 지도 카드가 이 자리에 들어간다 */}
          <div className="xl:w-75 xl:shrink-0">
            <CdnEdgeStatusCard state={edgeState} />
          </div>
        </div>
        <VehicleListCard state={listState} />
      </div>
    </>
  );
}
