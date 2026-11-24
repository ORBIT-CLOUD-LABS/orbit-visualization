import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { LoadErrorAlert } from './LoadErrorAlert';

describe('LoadErrorAlert', () => {
  it('실패 안내와 다시 시도 버튼을 보여 준다', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();
    render(<LoadErrorAlert onRetry={handleRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      '데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
    );

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(handleRetry).toHaveBeenCalledOnce();
  });

  it('넘긴 문구와 서버 code 를 보여 준다', () => {
    render(
      <LoadErrorAlert
        message="차량 정보를 불러오지 못했습니다"
        code="INTERNAL_ERROR"
        onRetry={vi.fn()}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      '차량 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
    );
    expect(screen.getByText('INTERNAL_ERROR')).toBeInTheDocument();
  });

  it('다시 불러오는 중이면 다시 시도 버튼을 막는다', () => {
    render(<LoadErrorAlert onRetry={vi.fn()} isRetrying />);

    expect(screen.getByRole('button', { name: '다시 시도' })).toBeDisabled();
  });
});
