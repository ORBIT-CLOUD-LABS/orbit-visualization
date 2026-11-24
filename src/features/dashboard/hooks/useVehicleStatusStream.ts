import { useCallback, useEffect, useRef, useState } from 'react';

import { sseClient, type SseConnection, type SseConnectionStatus } from '@/shared/api/sseClient';

import { vehicleStatusChangesSchema, type VehicleStatus } from '../api/vehicleStatusSchema';

const STREAM_PATH = '/dashboard/vehicles/stream';
const VEHICLES_EVENT = 'vehicles';

export type VehicleStatusStream = {
  status: SseConnectionStatus;
  /** 끊긴(disconnected) 뒤 사용자가 다시 연결할 때 부른다 */
  reconnect: () => void;
};

/**
 * 차량 상태 변경분 SSE 를 구독한다. `vehicles` 이벤트를 검증해 onChanges 로 넘기고, 언마운트하면 닫는다.
 * onChanges 가 바뀌면 다시 연결하므로 useCallback 으로 고정해서 넘긴다.
 */
export function useVehicleStatusStream(
  onChanges: (changes: VehicleStatus[]) => void,
): VehicleStatusStream {
  const [status, setStatus] = useState<SseConnectionStatus>('connecting');
  const connectionRef = useRef<SseConnection | null>(null);

  useEffect(() => {
    const connection = sseClient.connect({
      path: STREAM_PATH,
      // 형식이 다르면 던진다. sseClient 가 연결은 유지하고 전역 오류로 알린다
      onMessage: (message) => {
        if (message.event !== VEHICLES_EVENT) {
          return;
        }
        onChanges(vehicleStatusChangesSchema.parse(JSON.parse(message.data)));
      },
      onStatusChange: setStatus,
    });
    connectionRef.current = connection;
    return () => {
      connection.close();
      connectionRef.current = null;
    };
  }, [onChanges]);

  const reconnect = useCallback(() => {
    connectionRef.current?.reconnect();
  }, []);

  return { status, reconnect };
}
