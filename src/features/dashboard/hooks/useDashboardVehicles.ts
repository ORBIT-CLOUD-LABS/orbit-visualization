import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import { dashboardKeys } from '../api/dashboardKeys';
import { getVehicleStatusSnapshot } from '../api/getVehicleStatusSnapshot';
import type { VehicleStatus, VehicleStatusSnapshot } from '../api/vehicleStatusSchema';
import { mergeVehicleStatuses } from '../lib/mergeVehicleStatuses';

import { useVehicleStatusStream, type VehicleStatusStream } from './useVehicleStatusStream';

export type DashboardVehicles = {
  /** 스냅샷에 SSE 변경분을 합친 전체 차량 상태. dataUpdatedAt 이 마지막 갱신 시각이다 */
  query: UseQueryResult<VehicleStatusSnapshot>;
  connection: VehicleStatusStream;
};

/**
 * 대시보드 차량 상태. SSE 를 먼저 연결한 뒤 스냅샷을 조회하고, 받은 변경분을 Query 캐시에 합친다.
 * 화면 하나에서 한 번만 부르고 결과를 자식에게 넘긴다 (부를 때마다 SSE 연결이 하나씩 생긴다).
 */
export function useDashboardVehicles(): DashboardVehicles {
  const queryClient = useQueryClient();
  // 캐시에 스냅샷이 없을 때 받은 변경분. 스냅샷을 받으면 합치고 비운다
  const pendingChangesRef = useRef<VehicleStatus[]>([]);

  const handleChanges = useCallback(
    (changes: VehicleStatus[]) => {
      const queryKey = dashboardKeys.vehicles();
      const current = queryClient.getQueryData<VehicleStatusSnapshot>(queryKey);
      if (current === undefined) {
        pendingChangesRef.current = [...pendingChangesRef.current, ...changes];
        return;
      }
      queryClient.setQueryData<VehicleStatusSnapshot>(queryKey, {
        ...current,
        vehicles: mergeVehicleStatuses(current.vehicles, changes),
      });
    },
    [queryClient],
  );

  const connection = useVehicleStatusStream(handleChanges);

  const query = useQuery({
    queryKey: dashboardKeys.vehicles(),
    queryFn: async ({ signal }) => {
      const snapshot = await getVehicleStatusSnapshot(signal);
      // 조회하는 사이 캐시나 대기열에 들어온 변경분이 스냅샷보다 늦을 수 있어 updatedAt 으로 합친다
      const cached = queryClient.getQueryData<VehicleStatusSnapshot>(dashboardKeys.vehicles());
      const pending = pendingChangesRef.current;
      pendingChangesRef.current = [];
      return {
        ...snapshot,
        vehicles: mergeVehicleStatuses(snapshot.vehicles, [
          ...(cached?.vehicles ?? []),
          ...pending,
        ]),
      };
    },
    // 서버가 구독자를 먼저 등록해야 스냅샷과 SSE 사이의 변경을 놓치지 않는다
    enabled: connection.status !== 'connecting',
  });

  return { query, connection };
}
