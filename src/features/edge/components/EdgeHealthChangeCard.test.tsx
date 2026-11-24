import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { cdnEdgeStatusFixture } from '@/mocks/cdnEdgeHandlers';
import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { formatClockTime } from '@/shared/lib/formatClockTime';

import { trackEdgeHealth } from '../lib/trackEdgeHealth';

import { EdgeHealthChangeCard } from './EdgeHealthChangeCard';

const DOWN_AT = Date.parse('2026-11-24T00:58:30.000Z');
const UP_AT = Date.parse('2026-11-24T01:41:30.000Z');

function edge(edgeId: string, healthy: boolean): CdnEdgeStatus {
  return cdnEdgeStatusFixture({ edgeId, healthy });
}

function renderCard(tracker: ReturnType<typeof trackEdgeHealth> | null) {
  const data = [edge('edge-busan', true)];
  render(<EdgeHealthChangeCard edgeState={{ status: 'success', data }} tracker={tracker} />);
}

describe('EdgeHealthChangeCard', () => {
  it('화면을 떠나면 기록이 사라진다고 안내한다', () => {
    renderCard(trackEdgeHealth(null, [edge('edge-busan', true)], 0));

    expect(
      screen.getByText('이 화면에서 감지한 변화만 보여 주며, 화면을 떠나면 기록이 사라집니다'),
    ).toBeInTheDocument();
    expect(screen.getByText('감지된 상태 변화가 없습니다')).toBeInTheDocument();
  });

  it('확정한 장애·복구를 시각과 함께 최신순으로 보여 준다', () => {
    let tracker = trackEdgeHealth(null, [edge('edge-busan', true), edge('edge-daejeon', false)], 0);
    tracker = trackEdgeHealth(tracker, [edge('edge-busan', true), edge('edge-daejeon', true)], 1);
    tracker = trackEdgeHealth(
      tracker,
      [edge('edge-busan', true), edge('edge-daejeon', true)],
      UP_AT,
    );
    tracker = trackEdgeHealth(tracker, [edge('edge-busan', false), edge('edge-daejeon', true)], 2);
    tracker = trackEdgeHealth(
      tracker,
      [edge('edge-busan', false), edge('edge-daejeon', true)],
      DOWN_AT,
    );
    renderCard(tracker);

    const items = within(screen.getByRole('list', { name: '감지한 변화' })).getAllByRole(
      'listitem',
    );
    expect(items.map((item) => item.textContent)).toEqual([
      `edge-busan 장애 감지 (${formatClockTime(DOWN_AT)})정상 → 장애`,
      `edge-daejeon 복구 감지 (${formatClockTime(UP_AT)})장애 → 정상`,
    ]);
  });

  it('한 번만 바뀐 값은 확인 중으로 보여 준다', () => {
    const tracker = trackEdgeHealth(
      trackEdgeHealth(null, [edge('edge-busan', true)], 0),
      [edge('edge-busan', false)],
      1,
    );
    renderCard(tracker);

    expect(screen.getByRole('list', { name: '확인 중인 변화' })).toHaveTextContent(
      'edge-busan 장애 확인 중다음 조회에서도 같으면 기록합니다',
    );
    expect(screen.queryByRole('list', { name: '감지한 변화' })).not.toBeInTheDocument();
  });

  it('불러오는 중이면 로딩 행을 보여 준다', () => {
    render(<EdgeHealthChangeCard edgeState={{ status: 'pending' }} tracker={null} />);

    expect(screen.getByText('상태 변화를 불러오는 중입니다')).toBeInTheDocument();
  });

  it('불러오지 못하면 오류 코드와 다시 시도 버튼을 보여 준다', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(
      <EdgeHealthChangeCard
        edgeState={{ status: 'error', errorCode: 'INTERNAL_SERVER_ERROR', onRetry }}
        tracker={null}
      />,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('INTERNAL_SERVER_ERROR');
    await user.click(within(alert).getByRole('button', { name: '다시 시도' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
