import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DisconnectedAlert } from './DisconnectedAlert';

describe('DisconnectedAlert', () => {
  it('마지막 갱신 시각과 함께 끊김을 알린다', () => {
    const lastUpdatedAt = new Date(2026, 10, 24, 10, 0, 31).getTime();

    render(<DisconnectedAlert lastUpdatedAt={lastUpdatedAt} onReconnect={vi.fn()} />);

    expect(
      screen.getByText('실시간 연결이 끊겨 화면이 갱신되지 않습니다. 마지막 갱신 10:00:31'),
    ).toBeInTheDocument();
  });

  it('다시 연결을 누르면 onReconnect 를 부른다', async () => {
    const user = userEvent.setup();
    const onReconnect = vi.fn();
    render(<DisconnectedAlert lastUpdatedAt={null} onReconnect={onReconnect} />);

    await user.click(screen.getByRole('button', { name: '다시 연결' }));

    expect(onReconnect).toHaveBeenCalledOnce();
  });
});
