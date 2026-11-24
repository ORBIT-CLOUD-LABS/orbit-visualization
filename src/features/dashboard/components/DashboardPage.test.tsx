import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';

import { failure } from '@/mocks/apiEnvelope';
import {
  DASHBOARD_VEHICLES_URL,
  vehicleSnapshotResponse,
  vehicleStatusFixture,
} from '@/mocks/dashboardHandlers';
import { server } from '@/mocks/server';
import { fakeSseClient, type FakeSseClient } from '@/test/fakeSseClient';

import { DashboardPage } from './DashboardPage';

const EARLIER = '2026-11-24T01:00:00.000Z';
const LATER = '2026-11-24T01:00:05.000Z';

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function stats() {
  return screen.getByRole('region', { name: '차량 통계' });
}

describe('DashboardPage', () => {
  let sse: FakeSseClient;

  beforeEach(() => {
    sse = fakeSseClient();
  });

  it('SSE 연결 뒤 스냅샷으로 통계와 차량 목록을 그린다', async () => {
    server.use(
      http.get(DASHBOARD_VEHICLES_URL, () =>
        vehicleSnapshotResponse([
          vehicleStatusFixture({ vehicleId: 'VH-0001', lastResult: 'SUCCEEDED' }),
          vehicleStatusFixture({ vehicleId: 'VH-0002', lastResult: 'FAILED' }),
          vehicleStatusFixture({ vehicleId: 'VH-0003', lastResult: null }),
        ]),
      ),
    );
    renderPage();

    expect(screen.getByRole('heading', { name: '대시보드' })).toBeInTheDocument();
    expect(screen.getByText('연결 중')).toBeInTheDocument();

    sse.setStatus('connected');

    expect(await screen.findByRole('link', { name: 'VH-0001' })).toBeInTheDocument();
    expect(screen.getByText('실시간 연결됨')).toBeInTheDocument();
    expect(stats()).toHaveTextContent('전체 차량3최근 결과 SUCCEEDED1최근 결과 FAILED1결과 없음1');
  });

  it('SSE 변경분이 오면 updatedAt 이 늦은 것만 목록과 통계에 반영한다', async () => {
    server.use(
      http.get(DASHBOARD_VEHICLES_URL, () =>
        vehicleSnapshotResponse([vehicleStatusFixture({ updatedAt: EARLIER, lastResult: null })]),
      ),
    );
    renderPage();
    sse.setStatus('connected');
    await screen.findByRole('link', { name: 'VH-0001' });

    sse.emit('vehicles', [
      vehicleStatusFixture({ updatedAt: LATER, lastResult: 'FAILED', failureReason: 'DOWNLOAD' }),
    ]);
    sse.emit('vehicles', [vehicleStatusFixture({ updatedAt: EARLIER, lastResult: 'SUCCEEDED' })]);

    expect(await screen.findByText('DOWNLOAD')).toBeInTheDocument();
    const row = screen.getByRole('row', { name: /VH-0001/ });
    expect(within(row).getByText('FAILED')).toBeInTheDocument();
    expect(stats()).toHaveTextContent('최근 결과 FAILED1');
  });

  it('재연결 중이면 배지로 알린다', () => {
    renderPage();

    sse.setStatus('reconnecting');

    expect(screen.getByText('재연결 중')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '다시 연결' })).not.toBeInTheDocument();
  });

  it('연결이 끊기면 경고를 보여 주고 다시 연결할 수 있다', async () => {
    const user = userEvent.setup();
    renderPage();
    sse.setStatus('connected');
    await screen.findByRole('link', { name: 'VH-0001' });

    sse.setStatus('disconnected');

    expect(screen.getByText('실시간 연결 끊김')).toBeInTheDocument();
    expect(
      screen.getByText(
        /^실시간 연결이 끊겨 화면이 갱신되지 않습니다\. 마지막 갱신 \d{2}:\d{2}:\d{2}$/,
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다시 연결' }));

    expect(sse.reconnect).toHaveBeenCalledOnce();
  });

  it('스냅샷을 받기 전에는 로딩 상태를 보여 준다', () => {
    renderPage();

    expect(screen.getByText('차량 목록을 불러오는 중입니다')).toBeInTheDocument();
    expect(within(stats()).getAllByText('—')).toHaveLength(4);
  });

  it('스냅샷을 불러오지 못하면 오류를 보여 주고 다시 시도할 수 있다', async () => {
    const user = userEvent.setup();
    let isServerUp = false;
    server.use(
      http.get(DASHBOARD_VEHICLES_URL, () =>
        isServerUp
          ? vehicleSnapshotResponse([vehicleStatusFixture()])
          : HttpResponse.json(failure('INTERNAL_SERVER_ERROR', '서버 오류'), { status: 500 }),
      ),
    );
    renderPage();
    sse.setStatus('connected');

    expect(await screen.findByRole('alert')).toHaveTextContent('차량 목록을 불러오지 못했습니다');

    isServerUp = true;
    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByRole('link', { name: 'VH-0001' })).toBeInTheDocument();
  });

  it('체크인한 차량이 없으면 빈 상태를 보여 준다', async () => {
    server.use(http.get(DASHBOARD_VEHICLES_URL, () => vehicleSnapshotResponse([])));
    renderPage();
    sse.setStatus('connected');

    expect(await screen.findByText('아직 체크인한 차량이 없습니다')).toBeInTheDocument();
    expect(stats()).toHaveTextContent('전체 차량0');
  });
});
