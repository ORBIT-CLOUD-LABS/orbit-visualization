import { useMemo } from 'react';

import { ApiError } from '@/shared/api/ApiError';
import { Topbar } from '@/shared/ui/Topbar';

import { useDashboardVehicles } from '../hooks/useDashboardVehicles';
import { countVehicleResults } from '../lib/countVehicleResults';

import { DisconnectedAlert } from './DisconnectedAlert';
import { LiveConnectionStatus } from './LiveConnectionStatus';
import { VehicleListCard, type VehicleListState } from './VehicleListCard';
import { VehicleStatCards } from './VehicleStatCards';

/** 02 대시보드. 차량 상태를 실시간으로 보여 준다 */
export function DashboardPage() {
  const { query, connection } = useDashboardVehicles();
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
        {/* #20: 차량 위치 지도 카드와 CDN Edge 상태 카드 행이 이 자리(통계 카드와 차량 목록 사이)에 들어간다.
            차량 상태는 SSE 연결을 하나로 유지하도록 위의 query.data 를 props 로 넘긴다 */}
        <VehicleListCard state={listState} />
      </div>
    </>
  );
}
