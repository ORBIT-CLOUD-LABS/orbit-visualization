import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { VehicleStatCards } from './VehicleStatCards';

describe('VehicleStatCards', () => {
  it('통계 카드 4개에 차량 수를 보여 준다', () => {
    render(<VehicleStatCards counts={{ total: 128, succeeded: 96, failed: 7, noResult: 25 }} />);

    const stats = screen.getByRole('region', { name: '차량 통계' });
    expect(stats).toHaveTextContent(
      '전체 차량128최근 결과 SUCCEEDED96최근 결과 FAILED7결과 없음25',
    );
  });

  it('아직 집계할 데이터가 없으면 — 를 보여 준다', () => {
    render(<VehicleStatCards counts={null} />);

    expect(screen.getAllByText('—')).toHaveLength(4);
  });
});
