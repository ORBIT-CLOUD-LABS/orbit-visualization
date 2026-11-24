import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EdgeStatCards } from './EdgeStatCards';

describe('EdgeStatCards', () => {
  it('통계 카드 4개에 Edge 수와 배정 차량 합계를 보여 준다', () => {
    render(
      <EdgeStatCards summary={{ total: 3, healthy: 2, unhealthy: 1, assignedVehicles: 127 }} />,
    );

    expect(screen.getByRole('region', { name: 'Edge 통계' })).toHaveTextContent(
      'Edge 수3정상 Edge2장애 Edge1배정 차량 합계127',
    );
  });

  it('아직 집계할 데이터가 없으면 — 를 보여 준다', () => {
    render(<EdgeStatCards summary={null} />);

    expect(screen.getAllByText('—')).toHaveLength(4);
  });
});
