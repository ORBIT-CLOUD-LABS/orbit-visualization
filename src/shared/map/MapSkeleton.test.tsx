import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MapSkeleton } from './MapSkeleton';

describe('MapSkeleton', () => {
  it('불러오는 중임을 화면 읽기 도구에 알린다', () => {
    const { container } = render(<MapSkeleton label="Edge 위치를 불러오는 중입니다" />);

    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Edge 위치를 불러오는 중입니다')).toBeInTheDocument();
  });
});
