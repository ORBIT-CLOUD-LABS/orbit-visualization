import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { delay, http } from 'msw';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  DASHBOARD_VEHICLES_URL,
  vehicleSnapshotResponse,
  vehicleStatusFixture,
} from '@/mocks/dashboardHandlers';
import { server } from '@/mocks/server';
import { fakeSseClient, type FakeSseClient } from '@/test/fakeSseClient';

import { useDashboardVehicles } from './useDashboardVehicles';

const EARLIER = '2026-11-24T01:00:00.000Z';
const LATER = '2026-11-24T01:00:05.000Z';

// useQuery 는 읽은 필드가 바뀔 때만 다시 그린다. 기다릴 때도 data 를 읽어야 이후 캐시 변경이 result 에 반영된다
function renderDashboardVehicles() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(() => useDashboardVehicles(), { wrapper });
}

describe('useDashboardVehicles', () => {
  let sse: FakeSseClient;

  beforeEach(() => {
    sse = fakeSseClient();
  });

  it('SSE 가 연결된 뒤에 스냅샷을 조회한다', async () => {
    let requestCount = 0;
    server.use(
      http.get(DASHBOARD_VEHICLES_URL, () => {
        requestCount += 1;
        return vehicleSnapshotResponse([vehicleStatusFixture()]);
      }),
    );
    const { result } = renderDashboardVehicles();

    expect(sse.lastOptions()?.path).toBe('/dashboard/vehicles/stream');
    expect(result.current.connection.status).toBe('connecting');
    expect(requestCount).toBe(0);

    sse.setStatus('connected');

    await waitFor(() => {
      expect(result.current.query.data?.vehicles).toEqual([vehicleStatusFixture()]);
    });
    expect(requestCount).toBe(1);
  });

  it('스냅샷을 받기 전에 온 변경분도 updatedAt 을 비교해 합친다', async () => {
    server.use(
      http.get(DASHBOARD_VEHICLES_URL, async () => {
        await delay(20);
        return vehicleSnapshotResponse([
          vehicleStatusFixture({ vehicleId: 'VH-0001', updatedAt: EARLIER, lastResult: null }),
          vehicleStatusFixture({ vehicleId: 'VH-0002', updatedAt: LATER, lastResult: 'SUCCEEDED' }),
        ]);
      }),
    );
    const { result } = renderDashboardVehicles();

    sse.emit('vehicles', [
      vehicleStatusFixture({ vehicleId: 'VH-0001', updatedAt: LATER, lastResult: 'FAILED' }),
    ]);
    sse.setStatus('connected');
    sse.emit('vehicles', [
      vehicleStatusFixture({ vehicleId: 'VH-0002', updatedAt: EARLIER, lastResult: 'FAILED' }),
    ]);

    await waitFor(() => {
      expect(result.current.query.data).toBeDefined();
    });
    expect(result.current.query.data?.vehicles.map((vehicle) => vehicle.lastResult)).toEqual([
      'FAILED',
      'SUCCEEDED',
    ]);
  });

  it('스냅샷을 받은 뒤 변경분은 updatedAt 이 늦을 때만 캐시에 반영한다', async () => {
    server.use(
      http.get(DASHBOARD_VEHICLES_URL, () =>
        vehicleSnapshotResponse([vehicleStatusFixture({ updatedAt: EARLIER, lastResult: null })]),
      ),
    );
    const { result } = renderDashboardVehicles();
    sse.setStatus('connected');
    await waitFor(() => {
      expect(result.current.query.data).toBeDefined();
    });

    sse.emit('vehicles', [vehicleStatusFixture({ updatedAt: LATER, lastResult: 'FAILED' })]);
    sse.emit('vehicles', [vehicleStatusFixture({ updatedAt: EARLIER, lastResult: 'SUCCEEDED' })]);
    sse.emit('vehicles', [vehicleStatusFixture({ vehicleId: 'VH-0000', updatedAt: LATER })]);

    await waitFor(() => {
      expect(
        result.current.query.data?.vehicles.map(({ vehicleId, lastResult }) => ({
          vehicleId,
          lastResult,
        })),
      ).toEqual([
        { vehicleId: 'VH-0000', lastResult: 'SUCCEEDED' },
        { vehicleId: 'VH-0001', lastResult: 'FAILED' },
      ]);
    });
  });

  it('vehicles 가 아닌 이벤트는 무시한다', async () => {
    const { result } = renderDashboardVehicles();
    sse.setStatus('connected');
    await waitFor(() => {
      expect(result.current.query.data).toBeDefined();
    });

    sse.emit('other', [vehicleStatusFixture({ vehicleId: 'VH-0009', updatedAt: LATER })]);

    expect(result.current.query.data?.vehicles).toHaveLength(1);
  });

  it('연결 상태를 알려 주고 reconnect 로 다시 연결한다', () => {
    const { result } = renderDashboardVehicles();

    sse.setStatus('disconnected');
    expect(result.current.connection.status).toBe('disconnected');

    result.current.connection.reconnect();
    expect(sse.reconnect).toHaveBeenCalledOnce();
  });

  it('언마운트하면 SSE 연결을 닫는다', () => {
    const { unmount } = renderDashboardVehicles();

    unmount();

    expect(sse.close).toHaveBeenCalledOnce();
  });
});
