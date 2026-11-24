import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { Sidebar, type SidebarItem } from './Sidebar';

const ITEMS: SidebarItem[] = [
  { to: '/', label: '대시보드', end: true, activeFor: ['/vehicles/:vehicleId'] },
  { to: '/campaigns', label: '캠페인' },
  { to: '/artifacts', label: '파일' },
  { to: '/edges', label: 'CDN Edge' },
];

function renderSidebar(path: string, onChangeToken = vi.fn()) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Sidebar items={ITEMS} maskedToken="Bearer ••••••••3f9a" onChangeToken={onChangeToken} />
    </MemoryRouter>,
  );
}

describe('Sidebar', () => {
  it('메뉴를 링크로 보여 준다', () => {
    renderSidebar('/');

    const nav = screen.getByRole('navigation', { name: '주 메뉴' });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '캠페인' })).toHaveAttribute('href', '/campaigns');
    expect(screen.getByRole('link', { name: 'CDN Edge' })).toHaveAttribute('href', '/edges');
  });

  it('지금 경로의 메뉴만 선택 상태로 표시한다', () => {
    renderSidebar('/campaigns/7');

    expect(screen.getByRole('link', { name: '캠페인' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '대시보드' })).not.toHaveAttribute('aria-current');
  });

  it('activeFor 경로에서도 메뉴를 선택 상태로 표시한다', () => {
    renderSidebar('/vehicles/VH-001');

    expect(screen.getByRole('link', { name: '대시보드' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '캠페인' })).not.toHaveAttribute('aria-current');
  });

  it('가린 토큰을 보여 주고 토큰 변경을 누르면 알린다', async () => {
    const user = userEvent.setup();
    const handleChangeToken = vi.fn();
    renderSidebar('/', handleChangeToken);

    expect(screen.getByText('Bearer ••••••••3f9a')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '토큰 변경' }));

    expect(handleChangeToken).toHaveBeenCalledOnce();
  });
});
