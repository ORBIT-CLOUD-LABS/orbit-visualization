import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('제목과 보조 문구, 다음 행동을 보여 준다', async () => {
    const user = userEvent.setup();
    const handleCreate = vi.fn();
    render(
      <EmptyState
        title="등록된 캠페인이 없습니다"
        description="새 캠페인을 만들어 보세요"
        action={<Button onClick={handleCreate}>캠페인 만들기</Button>}
      />,
    );

    expect(screen.getByText('등록된 캠페인이 없습니다')).toBeInTheDocument();
    expect(screen.getByText('새 캠페인을 만들어 보세요')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '캠페인 만들기' }));

    expect(handleCreate).toHaveBeenCalledOnce();
  });
});
