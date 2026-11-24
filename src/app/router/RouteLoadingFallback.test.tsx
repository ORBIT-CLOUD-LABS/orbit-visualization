import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RouteLoadingFallback } from './RouteLoadingFallback';

describe('RouteLoadingFallback', () => {
  it('화면을 불러오는 중임을 화면 읽기 도구에 알린다', () => {
    render(<RouteLoadingFallback />);

    expect(screen.getByRole('status')).toHaveTextContent('화면을 불러오는 중입니다');
  });
});
