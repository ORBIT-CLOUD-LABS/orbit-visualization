import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { cdnEdgeStatusFixture } from '@/mocks/cdnEdgeHandlers';
import { ROUTES } from '@/shared/config/routes';

import type { CdnEdgeStatus } from '../api/cdnEdgeSchema';
import type { QueryState } from '../lib/toQueryState';

import { CdnEdgeStatusCard } from './CdnEdgeStatusCard';

function renderCard(state: QueryState<readonly CdnEdgeStatus[]>) {
  return render(
    <MemoryRouter>
      <CdnEdgeStatusCard state={state} />
    </MemoryRouter>,
  );
}

describe('CdnEdgeStatusCard', () => {
  it('Edge 마다 이름·id·정상 여부·배정 차량 수를 그린다', () => {
    renderCard({
      status: 'success',
      data: [
        cdnEdgeStatusFixture({ assignedVehicles: 64 }),
        cdnEdgeStatusFixture({
          edgeId: 'edge-busan',
          name: '부산',
          healthy: false,
          assignedVehicles: 22,
        }),
      ],
    });

    const [seoul, busan] = screen.getAllByRole('listitem');
    expect(seoul).toHaveTextContent('서울edge-seoul정상배정 64대');
    expect(busan).toHaveTextContent('부산edge-busan장애배정 22대');
  });

  it('자세히 링크로 CDN Edge 화면에 간다', () => {
    renderCard({ status: 'success', data: [cdnEdgeStatusFixture()] });

    expect(screen.getByRole('link', { name: '자세히' })).toHaveAttribute('href', ROUTES.edges);
  });

  it('불러오는 중이면 로딩 상태를 보여 준다', () => {
    renderCard({ status: 'pending' });

    expect(screen.getByText('CDN Edge 상태를 불러오는 중입니다')).toBeInTheDocument();
  });

  it('불러오지 못하면 오류 코드와 다시 시도 버튼을 보여 준다', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    renderCard({ status: 'error', errorCode: 'INTERNAL_SERVER_ERROR', onRetry });

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('CDN Edge 상태를 불러오지 못했습니다');
    expect(alert).toHaveTextContent('INTERNAL_SERVER_ERROR');

    await user.click(within(alert).getByRole('button', { name: '다시 시도' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('Edge 가 없으면 빈 상태를 보여 준다', () => {
    renderCard({ status: 'success', data: [] });

    expect(screen.getByText('등록된 CDN Edge가 없습니다')).toBeInTheDocument();
  });
});
