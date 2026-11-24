import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppLayout } from './AppLayout';

describe('AppLayout', () => {
  it('사이드바와 본문을 나란히 그린다', () => {
    render(
      <AppLayout sidebar={<nav aria-label="주 메뉴" />}>
        <h1>대시보드</h1>
      </AppLayout>,
    );

    expect(screen.getByRole('navigation', { name: '주 메뉴' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toContainElement(
      screen.getByRole('heading', { name: '대시보드' }),
    );
  });
});
