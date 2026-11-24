import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LoadingRows } from './LoadingRows';

describe('LoadingRows', () => {
  it('불러오는 중임을 화면 읽기 도구에 알린다', () => {
    const { container } = render(<LoadingRows />);

    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('불러오는 중')).toBeInTheDocument();
  });

  it('넘긴 문구와 행 수로 그린다', () => {
    const { container } = render(
      <LoadingRows label="차량 목록을 불러오는 중입니다" rows={5} variant="divided" />,
    );

    expect(screen.getByText('차량 목록을 불러오는 중입니다')).toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(5);
  });
});
