import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { cdnEdgeStatusFixture } from '@/mocks/cdnEdgeHandlers';
import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { formatClockTime } from '@/shared/lib/formatClockTime';

import { trackEdgeHealth, type EdgeHealthTracker } from '../lib/trackEdgeHealth';

import { EdgeHealthChangeCard } from './EdgeHealthChangeCard';

const DOWN_AT = Date.parse('2026-11-24T00:58:30.000Z');
const UP_AT = Date.parse('2026-11-24T01:41:30.000Z');

function edge(edgeId: string, healthy: boolean): CdnEdgeStatus {
  return cdnEdgeStatusFixture({ edgeId, healthy });
}

function renderCard(tracker: EdgeHealthTracker) {
  render(<EdgeHealthChangeCard tracker={tracker} isPending={false} />);
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
    // 기록 시각은 바뀐 값을 처음 본 조회 시각이다
    const recovered = [edge('edge-busan', true), edge('edge-daejeon', true)];
    const failed = [edge('edge-busan', false), edge('edge-daejeon', true)];
    tracker = trackEdgeHealth(tracker, recovered, UP_AT);
    tracker = trackEdgeHealth(tracker, recovered, UP_AT + 30_000);
    tracker = trackEdgeHealth(tracker, failed, DOWN_AT);
    tracker = trackEdgeHealth(tracker, failed, DOWN_AT + 30_000);
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
    render(<EdgeHealthChangeCard tracker={null} isPending />);

    expect(screen.getByText('상태 변화를 불러오는 중입니다')).toBeInTheDocument();
  });

  it('Edge 상태를 받지 못했으면 받은 뒤부터 기록한다고 안내한다', () => {
    render(<EdgeHealthChangeCard tracker={null} isPending={false} />);

    expect(screen.getByText('Edge 상태를 받은 뒤부터 변화를 기록합니다')).toBeInTheDocument();
  });
});
