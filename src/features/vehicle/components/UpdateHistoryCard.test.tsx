import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { vehicleUpdateEventFixture } from '@/mocks/vehicleHandlers';

import { UpdateHistoryCard } from './UpdateHistoryCard';

function eventsFinishedAt(count: number) {
  return Array.from({ length: count }, (_, index) =>
    vehicleUpdateEventFixture({
      campaignId: index + 1,
      finishedAt: new Date(Date.UTC(2026, 9, 28, 0, 0, count - index)).toISOString(),
    }),
  );
}

describe('UpdateHistoryCard', () => {
  it('불러오는 동안 로딩 행을 보여 준다', () => {
    render(<UpdateHistoryCard events={undefined} isPending onRetry={vi.fn()} />);

    expect(screen.getByText('불러오는 중입니다')).toBeInTheDocument();
  });

  it('실패하면 다시 시도할 수 있다', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(
      <UpdateHistoryCard
        events={undefined}
        isPending={false}
        errorCode="INTERNAL_ERROR"
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('업데이트 이력을 불러오지 못했습니다');
    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('이력이 없으면 빈 상태를 보여 준다', () => {
    render(<UpdateHistoryCard events={[]} isPending={false} onRetry={vi.fn()} />);

    expect(screen.getByText('업데이트 이력이 없습니다')).toBeInTheDocument();
  });

  it('받은 순서대로 20개씩 나눠 보여 준다', async () => {
    const user = userEvent.setup();
    render(<UpdateHistoryCard events={eventsFinishedAt(25)} isPending={false} onRetry={vi.fn()} />);

    const table = screen.getByRole('table', { name: '업데이트 이력' });
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(21);
    expect(within(rows[1] ?? table).getAllByRole('cell')[1]).toHaveTextContent('1');
    expect(screen.getByText('25건 중 1–20 · 1 / 2 페이지')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '2 페이지' }));

    expect(within(table).getAllByRole('row')).toHaveLength(6);
  });

  it('실패 사유가 없는 시도는 빈 값 기호로 보여 준다', () => {
    const event = vehicleUpdateEventFixture({
      result: 'SUCCEEDED',
      failureReason: null,
      failureDetail: null,
      edgeId: null,
    });
    render(<UpdateHistoryCard events={[event]} isPending={false} onRetry={vi.fn()} />);

    const cells = screen.getAllByRole('cell');
    expect(cells[3]).toHaveTextContent('SUCCEEDED');
    expect(cells[4]).toHaveTextContent('—');
    expect(cells[5]).toHaveTextContent('—');
  });
});
