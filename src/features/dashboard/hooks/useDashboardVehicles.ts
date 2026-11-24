import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

import { dashboardKeys } from '../api/dashboardKeys';
import { getVehicleStatusSnapshot } from '../api/getVehicleStatusSnapshot';
import type { VehicleStatus, VehicleStatusSnapshot } from '../api/vehicleStatusSchema';
import { mergeVehicleStatuses } from '../lib/mergeVehicleStatuses';

import { useVehicleStatusStream, type VehicleStatusStream } from './useVehicleStatusStream';

/** SSE 첫 연결을 기다리는 최대 시간. 지나면 연결을 기다리지 않고 스냅샷을 조회한다 */
export const FIRST_CONNECT_WAIT_MS = 3000;

export type DashboardVehicles = {
  /** 스냅샷에 SSE 변경분을 합친 전체 차량 상태. dataUpdatedAt 이 마지막 갱신 시각이다 */
  query: UseQueryResult<VehicleStatusSnapshot>;
  connection: VehicleStatusStream;
};

/**
 * 대시보드 차량 상태. SSE 를 먼저 연결한 뒤 스냅샷을 조회하고, 받은 변경분을 Query 캐시에 합친다.
 * 첫 연결이 FIRST_CONNECT_WAIT_MS 안에 끝나지 않으면 기다리지 않고 조회한다.
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
      if (current === undefined) {
        pendingChangesRef.current = mergeVehicleStatuses(pendingChangesRef.current, changes);
        return;
      }
      if (queryClient.isFetching({ queryKey }) > 0) {
        pendingChangesRef.current = mergeVehicleStatuses(pendingChangesRef.current, changes);
      }
      queryClient.setQueryData<VehicleStatusSnapshot>(queryKey, {
        ...current,
        vehicles: mergeVehicleStatuses(current.vehicles, changes),
      });
    },
    [queryClient],
  );

  const connection = useVehicleStatusStream(handleChanges);
  const [isFirstConnectWaitOver, setIsFirstConnectWaitOver] = useState(false);

  // 첫 연결이 응답 없이 늘어지면 로딩이 끝나지 않는다. 대기 시간이 지나면 SSE 와 상관없이 조회한다
  useEffect(() => {
    if (connection.hasOpened) {
      return;
    }
    const timer = setTimeout(() => {
      setIsFirstConnectWaitOver(true);
    }, FIRST_CONNECT_WAIT_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [connection.hasOpened]);

  const isSnapshotEnabled = connection.hasOpened || isFirstConnectWaitOver;

  // 연결되기 전에 조회한 스냅샷은 구독 전 변경을 놓쳤을 수 있다. 처음 연결됐을 때 한 번만 다시 조회한다
  const hasConnectedRef = useRef(false);
  const fetchedBeforeConnectRef = useRef(false);
  useEffect(() => {
    if (hasConnectedRef.current) {
      return;
    }
    if (connection.status !== 'connected') {
      fetchedBeforeConnectRef.current = isSnapshotEnabled;
      return;
    }
    hasConnectedRef.current = true;
    if (fetchedBeforeConnectRef.current) {
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.vehicles() });
    }
  }, [connection.status, isSnapshotEnabled, queryClient]);

  const query = useQuery({
    queryKey: dashboardKeys.vehicles(),
    // 스냅샷이 기준이다. 서버에서 빠진 차량이 캐시에 남지 않도록 이전 캐시와 합치지 않는다
    queryFn: ({ signal }) => getVehicleStatusSnapshot(signal),
    // 서버가 구독자를 먼저 등록해야 스냅샷과 SSE 사이의 변경을 놓치지 않는다.
    // 첫 연결만 기다리고, 다시 연결하는 동안에는 조회를 막지 않는다
    enabled: isSnapshotEnabled,
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
