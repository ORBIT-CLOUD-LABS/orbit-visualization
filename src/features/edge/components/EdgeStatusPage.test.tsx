import { QueryClient } from '@tanstack/react-query';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { failure } from '@/mocks/apiEnvelope';
import { CDN_EDGES_URL, cdnEdgeStatusFixture, cdnEdgesResponse } from '@/mocks/cdnEdgeHandlers';
import { server } from '@/mocks/server';
import { ROUTES } from '@/shared/config/routes';
import { renderRoutes } from '@/test/renderRoutes';

import { EdgeStatusPage } from './EdgeStatusPage';

const routes = [{ path: ROUTES.edges, element: <EdgeStatusPage /> }];

const EDGES = [
  cdnEdgeStatusFixture({ assignedVehicles: 64 }),
  cdnEdgeStatusFixture({
    edgeId: 'edge-busan',
    name: '부산',
    latitude: 35.1796,
    longitude: 129.0756,
    healthy: false,
    assignedVehicles: 22,
    downloads: [{ campaignId: 7, succeeded: 12, failed: 3 }],
  }),
];

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return renderRoutes(routes, ROUTES.edges, queryClient);
}

function serverError() {
  return HttpResponse.json(failure('INTERNAL_SERVER_ERROR'), { status: 500 });
}

describe('EdgeStatusPage', () => {
  it('불러오는 동안 로딩 행을 보여 준다', () => {
    renderPage();

    expect(screen.getByText('CDN Edge 상태를 불러오는 중입니다')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(5);
  });

  it('요약 지표와 Edge 마다 카드를 보여 준다', async () => {
    server.use(http.get(CDN_EDGES_URL, () => cdnEdgesResponse(EDGES)));
    renderPage();

    const busan = await screen.findByRole('region', { name: '부산' });
    expect(busan).toHaveTextContent('장애');
    expect(busan).toHaveTextContent('35.1796, 129.0756');
    expect(within(busan).getByRole('table')).toHaveTextContent('#7123');
    expect(screen.getByRole('region', { name: '서울' })).toHaveTextContent('64대');
    expect(screen.getByRole('region', { name: 'Edge 통계' })).toHaveTextContent(
      'Edge 수2정상 Edge1장애 Edge1배정 차량 합계86',
    );
    expect(screen.getByText(/^마지막 갱신/)).toHaveTextContent(/^마지막 갱신 \d{2}:\d{2}:\d{2}$/);
  });

  it('정상 여부가 서버마다 잠시 다를 수 있다고 안내한다', () => {
    renderPage();

    expect(
      screen.getByText(
        '정상·장애는 요청을 받은 서버가 확인한 결과라 서버마다 잠시 다르게 보일 수 있습니다',
      ),
    ).toBeInTheDocument();
  });

  it('Edge 가 없으면 빈 상태를 보여 준다', async () => {
    server.use(http.get(CDN_EDGES_URL, () => cdnEdgesResponse([])));
    renderPage();

    expect(await screen.findByText('등록된 CDN Edge가 없습니다')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Edge 통계' })).toHaveTextContent('Edge 수0');
  });

  it('불러오지 못하면 오류 코드와 함께 다시 시도할 수 있다', async () => {
    let calls = 0;
    server.use(
      http.get(CDN_EDGES_URL, () => {
        calls += 1;
        return calls === 1 ? serverError() : cdnEdgesResponse(EDGES);
      }),
    );
    const user = userEvent.setup();
    renderPage();

    const list = screen.getByRole('region', { name: 'Edge 목록' });
    const alert = await within(list).findByRole('alert');
    expect(alert).toHaveTextContent('Edge 상태를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
    expect(alert).toHaveTextContent('INTERNAL_SERVER_ERROR');
    await user.click(within(alert).getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByRole('region', { name: '부산' })).toBeInTheDocument();
  });

  it('새로고침하면 다시 조회해 바뀐 상태를 보여 준다', async () => {
    let healthy = true;
    server.use(
      http.get(CDN_EDGES_URL, () => cdnEdgesResponse([cdnEdgeStatusFixture({ healthy })])),
    );
    const user = userEvent.setup();
    renderPage();

    const seoul = await screen.findByRole('region', { name: '서울' });
    expect(seoul).toHaveTextContent('정상');
    healthy = false;
    await user.click(screen.getByRole('button', { name: '새로고침' }));

    expect(await within(seoul).findByText('장애')).toBeInTheDocument();
  });

  it('다시 조회해 같은 장애가 두 번 이어지면 상태 변화에 기록한다', async () => {
    let healthy = true;
    server.use(
      http.get(CDN_EDGES_URL, () => cdnEdgesResponse([cdnEdgeStatusFixture({ healthy })])),
    );
    const user = userEvent.setup();
    renderPage();

    const changes = screen.getByRole('region', { name: '상태 변화 (화면 감지)' });
    expect(await within(changes).findByText('감지된 상태 변화가 없습니다')).toBeInTheDocument();
    healthy = false;
    await user.click(screen.getByRole('button', { name: '새로고침' }));
    expect(await within(changes).findByText('edge-seoul 장애 확인 중')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '새로고침' }));

    expect(
      await within(changes).findByText(/^edge-seoul 장애 감지 \(\d{2}:\d{2}:\d{2}\)$/),
    ).toBeInTheDocument();
    expect(within(changes).queryByText('edge-seoul 장애 확인 중')).not.toBeInTheDocument();
  });

  it('새로고침이 실패하면 받은 정보를 그대로 두고 실패를 알린다', async () => {
    let isServerUp = true;
    server.use(
      http.get(CDN_EDGES_URL, () => (isServerUp ? cdnEdgesResponse(EDGES) : serverError())),
    );
    const user = userEvent.setup();
    renderPage();

    await screen.findByRole('region', { name: '부산' });
    isServerUp = false;
    await user.click(screen.getByRole('button', { name: '새로고침' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(
      '최신 Edge 상태를 불러오지 못했습니다. 이전에 받은 정보를 보여 줍니다.',
    );
    expect(alert).toHaveTextContent('INTERNAL_SERVER_ERROR');
    expect(screen.getByRole('region', { name: '부산' })).toBeInTheDocument();
  });
});
