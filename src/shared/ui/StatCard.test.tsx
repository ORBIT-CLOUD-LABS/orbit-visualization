import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('라벨과 값, 보조 문구를 보여 준다', () => {
    render(<StatCard label="전체 차량" value="128" sub="위치 없음 3대" />);

    expect(screen.getByText('전체 차량')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.getByText('위치 없음 3대')).toBeInTheDocument();
  });
});
