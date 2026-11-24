import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  it('위 화면 링크와 지금 화면 이름을 보여 준다', () => {
    render(
      <MemoryRouter>
        <Breadcrumb parent={{ label: '캠페인', to: '/campaigns' }} current="새 캠페인" />
      </MemoryRouter>,
    );

    const nav = screen.getByRole('navigation', { name: '위치' });
    expect(within(nav).getByRole('link', { name: '캠페인' })).toHaveAttribute('href', '/campaigns');
    expect(within(nav).getByText('새 캠페인')).toHaveAttribute('aria-current', 'page');
  });
});
