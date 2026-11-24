import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { cdnEdgeStatusFixture } from '@/mocks/cdnEdgeHandlers';

import { EdgeCard } from './EdgeCard';

describe('EdgeCard', () => {
  it('이름·id·정상 여부·좌표·배정 차량 수를 보여 준다', () => {
    render(<EdgeCard edge={cdnEdgeStatusFixture({ assignedVehicles: 64 })} />);

    const card = screen.getByRole('region', { name: '서울' });
    expect(card).toHaveTextContent('edge-seoul');
    expect(within(card).getByText('정상')).toBeInTheDocument();
    expect(within(card).getByText('37.5665, 126.9780')).toBeInTheDocument();
    expect(within(card).getByText('64대')).toBeInTheDocument();
  });

  it('장애 Edge 는 장애 배지를 단다', () => {
    render(<EdgeCard edge={cdnEdgeStatusFixture({ healthy: false })} />);

    expect(screen.getByText('장애')).toBeInTheDocument();
  });

  it('캠페인별 다운로드 성공·실패 수를 서버 순서대로 표로 그린다', () => {
    render(
      <EdgeCard
        edge={cdnEdgeStatusFixture({
          downloads: [
            { campaignId: 6, succeeded: 120, failed: 1 },
            { campaignId: 7, succeeded: 40, failed: 2 },
          ],
        })}
      />,
    );

    const table = screen.getByRole('table', { name: '서울 캠페인별 다운로드' });
    const rows = within(table).getAllByRole('row');
    expect(rows.map((row) => row.textContent)).toEqual(['캠페인성공실패', '#61201', '#7402']);
  });

  it('다운로드 기록이 없으면 표 대신 안내를 보여 준다', () => {
    render(<EdgeCard edge={cdnEdgeStatusFixture({ downloads: [] })} />);

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByText('이 Edge에서 받은 다운로드 기록이 없습니다')).toBeInTheDocument();
  });
});
