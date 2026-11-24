import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from './Button';
import { Topbar } from './Topbar';

describe('Topbar', () => {
  it('제목을 화면 제목으로, 부제와 오른쪽 영역을 함께 보여 준다', () => {
    render(
      <Topbar title="캠페인" subtitle="배포 캠페인 목록" right={<Button>새 캠페인</Button>} />,
    );

    expect(screen.getByRole('heading', { level: 1, name: '캠페인' })).toBeInTheDocument();
    expect(screen.getByText('배포 캠페인 목록')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '새 캠페인' })).toBeInTheDocument();
  });
});
