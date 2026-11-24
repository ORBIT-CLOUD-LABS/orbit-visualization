import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MapEmptyNotice } from './MapEmptyNotice';

describe('MapEmptyNotice', () => {
  it('넘긴 안내 문구를 보여 준다', () => {
    render(<MapEmptyNotice>위치를 보낸 차량이 없습니다</MapEmptyNotice>);

    expect(screen.getByText('위치를 보낸 차량이 없습니다')).toBeInTheDocument();
  });
});
