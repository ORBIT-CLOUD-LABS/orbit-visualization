import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';

describe('Card', () => {
  it('제목으로 이름 붙인 영역에 설명·배지·동작·본문을 그린다', () => {
    render(
      <Card
        title="차량 정보"
        description="최근 50건"
        badge={<Badge tone="success">성공</Badge>}
        action={<Button variant="secondary">새로고침</Button>}
      >
        <p>본문</p>
      </Card>,
    );

    const card = screen.getByRole('region', { name: '차량 정보' });
    expect(within(card).getByRole('heading', { level: 2, name: '차량 정보' })).toBeInTheDocument();
    expect(within(card).getByText('최근 50건')).toBeInTheDocument();
    expect(within(card).getByText('성공')).toBeInTheDocument();
    expect(within(card).getByRole('button', { name: '새로고침' })).toBeInTheDocument();
    expect(within(card).getByText('본문')).toBeInTheDocument();
  });

  it('설명·동작이 없으면 제목과 본문만 그린다', () => {
    render(
      <Card title="파일 목록">
        <p>본문</p>
      </Card>,
    );

    const card = screen.getByRole('region', { name: '파일 목록' });
    expect(within(card).queryByRole('button')).not.toBeInTheDocument();
    expect(within(card).getByText('본문')).toBeInTheDocument();
  });

  it('넘긴 titleId 로 본문 요소도 제목으로 이름 붙일 수 있다', () => {
    render(
      <Card title="차량 목록" titleId="vehicle-list-title">
        <table aria-labelledby="vehicle-list-title" />
      </Card>,
    );

    expect(screen.getByRole('region', { name: '차량 목록' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: '차량 목록' })).toBeInTheDocument();
  });
});
