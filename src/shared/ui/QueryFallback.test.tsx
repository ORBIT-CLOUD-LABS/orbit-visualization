import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { QueryFallback } from './QueryFallback';

describe('QueryFallback', () => {
  it('불러오는 중이면 로딩 행을 보여 준다', () => {
    render(<QueryFallback isPending onRetry={vi.fn()} loadingLabel="불러오는 중입니다" />);

    expect(screen.getByText('불러오는 중입니다')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('실패했으면 안내와 다시 시도 버튼을 보여 준다', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();
    render(
      <QueryFallback
        isPending={false}
        onRetry={handleRetry}
        errorMessage="업데이트 이력을 불러오지 못했습니다"
        errorCode="INTERNAL_ERROR"
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      '업데이트 이력을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
    );
    expect(screen.getByText('INTERNAL_ERROR')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(handleRetry).toHaveBeenCalledOnce();
  });
});
