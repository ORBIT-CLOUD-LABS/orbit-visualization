import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('요약 문구와 현재 페이지를 보여 준다', () => {
    render(
      <Pagination
        page={1}
        pageCount={7}
        onPageChange={vi.fn()}
        summary="128대 중 1–20 · 1 / 7 페이지"
      />,
    );

    expect(screen.getByText('128대 중 1–20 · 1 / 7 페이지')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1 페이지' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: '이전' })).toBeDisabled();
  });

  it('번호·이전·다음을 누르면 옮길 페이지를 알린다', async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();
    render(<Pagination page={10} pageCount={22} onPageChange={handlePageChange} />);

    await user.click(screen.getByRole('button', { name: '11 페이지' }));
    await user.click(screen.getByRole('button', { name: '이전' }));
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(screen.getByRole('button', { name: '22 페이지' }));

    expect(handlePageChange.mock.calls).toEqual([[11], [9], [11], [22]]);
  });

  it('페이지가 많으면 생략 표시와 마지막 페이지를 보여 준다', () => {
    render(<Pagination page={1} pageCount={22} onPageChange={vi.fn()} />);

    expect(screen.getByText('…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '22 페이지' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '6 페이지' })).not.toBeInTheDocument();
  });

  it('마지막 페이지에서는 다음을 누를 수 없다', () => {
    render(<Pagination page={22} pageCount={22} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
  });
});
