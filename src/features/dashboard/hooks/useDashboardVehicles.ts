import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  // 스냅샷이 없거나 조회 중일 때 받은 변경분. 조회 결과가 캐시에 들어간 뒤 다시 합친다
  const pendingChangesRef = useRef<VehicleStatus[]>([]);

  const handleChanges = useCallback(
    (changes: VehicleStatus[]) => {
      const queryKey = dashboardKeys.vehicles();
      const current = queryClient.getQueryData<VehicleStatusSnapshot>(queryKey);
      // 조회 결과가 캐시를 덮어쓰기 전까지는 받은 변경분을 남겨 둔다. 같은 차량은 하나만 남긴다
      if (current === undefined || queryClient.isFetching({ queryKey }) > 0) {
        pendingChangesRef.current = mergeVehicleStatuses(pendingChangesRef.current, changes);
      }
      if (current === undefined) {
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

  // 서버가 구독자를 먼저 등록해야 스냅샷과 SSE 사이의 변경을 놓치지 않는다.
  // 첫 조회만 기다리고, 다시 연결하는 동안에는 조회를 막지 않는다
  const [hasStreamOpened, setHasStreamOpened] = useState(false);
  const isStreamOpened = hasStreamOpened || connection.status !== 'connecting';
  if (isStreamOpened && !hasStreamOpened) {
    setHasStreamOpened(true);
  }

  const query = useQuery({
    queryKey: dashboardKeys.vehicles(),
    // 스냅샷이 기준이다. 서버에서 빠진 차량이 캐시에 남지 않도록 이전 캐시와 합치지 않는다
    queryFn: ({ signal }) => getVehicleStatusSnapshot(signal),
    enabled: isStreamOpened,
  });

  const { data, fetchStatus } = query;
  // 조회 결과가 캐시에 들어간 뒤 그 사이 받은 변경분을 다시 합친다. updatedAt 이 늦은 것만 반영된다
  useEffect(() => {
    if (data === undefined || fetchStatus !== 'idle' || pendingChangesRef.current.length === 0) {
      return;
    }
    const pending = pendingChangesRef.current;
    pendingChangesRef.current = [];
    queryClient.setQueryData<VehicleStatusSnapshot>(dashboardKeys.vehicles(), (current) =>
      current === undefined
        ? current
        : { ...current, vehicles: mergeVehicleStatuses(current.vehicles, pending) },
    );
  }, [data, fetchStatus, queryClient]);

  return { query, connection };
}
