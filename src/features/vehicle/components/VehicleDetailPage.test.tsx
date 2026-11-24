import { QueryClient } from '@tanstack/react-query';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { failure, success } from '@/mocks/apiEnvelope';
import { server } from '@/mocks/server';
import {
  VEHICLE_DETAIL_URL,
  VEHICLE_EVENTS_URL,
  vehicleDetailFixture,
} from '@/mocks/vehicleHandlers';
import { ROUTES, routePaths } from '@/shared/config/routes';
import { renderRoutes } from '@/test/renderRoutes';

import { VehicleDetailPage } from './VehicleDetailPage';

const routes = [
  { path: ROUTES.vehicleDetail, element: <VehicleDetailPage /> },
  { path: ROUTES.dashboard, element: <p>대시보드 화면</p> },
];

function renderPage(path = routePaths.vehicleDetail('VH-0001')) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return renderRoutes(routes, path, queryClient);
}

describe('VehicleDetailPage', () => {
  it('불러오는 동안 로딩 행을 보여 준다', () => {
    renderPage();

    expect(screen.getAllByText('불러오는 중입니다')).toHaveLength(2);
  });

  it('차량 기본 정보·마지막 결과·위치·이력을 보여 준다', async () => {
    renderPage();

    const summary = await screen.findByRole('region', { name: /VH-0001/ });
    expect(summary).toHaveTextContent('MODEL-A');
    expect(summary).toHaveTextContent('HW1');
    expect(summary).toHaveTextContent('KR');
    expect(summary).toHaveTextContent('FAILED');
    expect(within(summary).getByRole('link', { name: '캠페인 #7 보기' })).toHaveAttribute(
      'href',
      '/campaigns/7',
    );

    const lastUpdate = screen.getByRole('region', { name: '마지막 업데이트 결과' });
    expect(within(lastUpdate).getByRole('alert')).toHaveTextContent(
      '펌웨어 서명 검증 실패 — 차량이 설치하지 않음',
    );
    expect(lastUpdate).toHaveTextContent('SIGNATURE_INVALID · unknown keyId: v2');

    const location = screen.getByRole('region', { name: '위치 · 배정 Edge' });
    expect(location).toHaveTextContent('37.5200');
    expect(location).toHaveTextContent('126.9000');

    const history = screen.getByRole('table', { name: '업데이트 이력' });
    expect(await within(history).findAllByRole('row')).toHaveLength(2);
  });

  it('결과·위치가 없으면 결과 없음과 안내를 보여 준다', async () => {
    server.use(
      http.get(VEHICLE_DETAIL_URL, () =>
        HttpResponse.json(success(vehicleDetailFixture({ lastUpdate: null, location: null }))),
      ),
      http.get(VEHICLE_EVENTS_URL, () => HttpResponse.json(success({ events: [] }))),
    );
    renderPage();

    const summary = await screen.findByRole('region', { name: /VH-0001/ });
    expect(summary).toHaveTextContent('결과 없음');
    expect(within(summary).queryByRole('link', { name: /캠페인/ })).not.toBeInTheDocument();
    expect(screen.getByText('업데이트 결과가 없습니다')).toBeInTheDocument();
    expect(screen.getByText('아직 위치를 받지 않았습니다')).toBeInTheDocument();
    expect(await screen.findByText('업데이트 이력이 없습니다')).toBeInTheDocument();
  });

  it('차량 정보를 불러오지 못하면 다시 시도할 수 있다', async () => {
    let calls = 0;
    server.use(
      http.get(VEHICLE_DETAIL_URL, () => {
        calls += 1;
        return calls === 1
          ? HttpResponse.json(failure('INTERNAL_SERVER_ERROR'), { status: 500 })
          : HttpResponse.json(success(vehicleDetailFixture()));
      }),
    );
    const user = userEvent.setup();
    renderPage();

    const info = screen.getByRole('region', { name: '차량 정보' });
    expect(await within(info).findByRole('alert')).toHaveTextContent(
      '차량 정보를 불러오지 못했습니다',
    );
    await user.click(within(info).getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByRole('region', { name: /VH-0001/ })).toBeInTheDocument();
  });

  it('없는 차량이면 본문 전체를 빈 상태로 바꾸고 대시보드로 보낸다', async () => {
    const user = userEvent.setup();
    renderPage(routePaths.vehicleDetail('VH-9999'));

    expect(await screen.findByText('차량을 찾을 수 없습니다')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: '대시보드로' }));

    expect(await screen.findByText('대시보드 화면')).toBeInTheDocument();
  });

  it('vehicleId 가 공백뿐이면 요청하지 않고 없는 차량으로 본다', () => {
    renderPage('/vehicles/%20');

    expect(screen.getByText('차량을 찾을 수 없습니다')).toBeInTheDocument();
  });

  it('특수 문자가 든 vehicleId 도 그대로 조회한다', async () => {
    const vehicleId = 'VH/00 01?';
    server.use(
      http.get(VEHICLE_DETAIL_URL, ({ params }) =>
        params.vehicleId === vehicleId
          ? HttpResponse.json(success(vehicleDetailFixture({ vehicleId })))
          : HttpResponse.json(failure('VEHICLE_NOT_FOUND'), { status: 404 }),
      ),
      http.get(VEHICLE_EVENTS_URL, () => HttpResponse.json(success({ events: [] }))),
    );
    renderPage(routePaths.vehicleDetail(vehicleId));

    expect(await screen.findByRole('region', { name: /VH\/00 01\?/ })).toBeInTheDocument();
  });

  it('새로고침이 실패하면 받은 정보를 두고 실패를 알린다', async () => {
    let calls = 0;
    server.use(
      http.get(VEHICLE_DETAIL_URL, () => {
        calls += 1;
        return calls === 1
          ? HttpResponse.json(success(vehicleDetailFixture()))
          : HttpResponse.json(failure('INTERNAL_SERVER_ERROR'), { status: 500 });
      }),
    );
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole('button', { name: '새로고침' }));

    expect(await screen.findByText(/최신 정보를 불러오지 못했습니다/)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /VH-0001/ })).toHaveTextContent('MODEL-A');
  });

  it('새로고침하면 상세와 이력을 다시 불러온다', async () => {
    let detailCalls = 0;
    let historyCalls = 0;
    server.use(
      http.get(VEHICLE_DETAIL_URL, () => {
        detailCalls += 1;
        return HttpResponse.json(success(vehicleDetailFixture()));
      }),
      http.get(VEHICLE_EVENTS_URL, () => {
        historyCalls += 1;
        return HttpResponse.json(success({ events: [] }));
      }),
    );
    const user = userEvent.setup();
    renderPage();

    await screen.findByText('업데이트 이력이 없습니다');
    const refresh = await screen.findByRole('button', { name: '새로고침' });
    await user.click(refresh);

    await expect.poll(() => [detailCalls, historyCalls]).toEqual([2, 2]);
  });
});
