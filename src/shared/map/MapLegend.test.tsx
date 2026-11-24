import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MapLegend } from './MapLegend';

describe('MapLegend', () => {
  it('항목 이름을 지도 범례 목록으로 보여 준다', () => {
    render(
      <MapLegend
        items={[
          { label: 'Edge', shape: 'dot', colorClass: 'bg-primary' },
          { label: '재배정', shape: 'line', colorClass: 'border-dashed border-warning' },
        ]}
      />,
    );

    const legend = screen.getByRole('list', { name: '지도 범례' });
    const items = within(legend).getAllByRole('listitem');
    expect(items.map((item) => item.textContent)).toEqual(['Edge', '재배정']);
  });
});
