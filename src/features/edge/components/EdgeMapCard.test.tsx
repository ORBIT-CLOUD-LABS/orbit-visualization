import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { cdnEdgeStatusFixture } from '@/mocks/cdnEdgeHandlers';
import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { mockLeafletMap, mockTileLayer } from '@/test/reactLeafletMock';

import { EdgeMapCard } from './EdgeMapCard';

vi.mock('react-leaflet', () => import('@/test/reactLeafletMock'));

const SEOUL = cdnEdgeStatusFixture({ latitude: 37.5, longitude: 127, assignedVehicles: 64 });
const BUSAN = cdnEdgeStatusFixture({
  edgeId: 'edge-busan',
  name: '부산',
  latitude: 35,
  longitude: 129,
  healthy: false,
  assignedVehicles: 22,
});

function card(edges: readonly CdnEdgeStatus[]) {
  return <EdgeMapCard edgeState={{ status: 'success', data: edges }} />;
}

describe('EdgeMapCard', () => {
  beforeEach(() => {
    mockLeafletMap.fitBounds.mockClear();
  });

  it('Edge 마다 이름 라벨과 정상 여부·배정 차량 수 팝업을 그린다', () => {
    render(card([SEOUL, BUSAN]));

    expect(screen.getByRole('region', { name: 'Edge 위치 · 배정 차량' })).toBeInTheDocument();
    expect(screen.getByText('부산 (장애)')).toBeInTheDocument();
    expect(screen.getByText('서울 · 정상')).toBeInTheDocument();
    expect(screen.getByText('배정 차량 64대')).toBeInTheDocument();
    expect(screen.getByText('부산 · 장애')).toBeInTheDocument();
    expect(screen.getByText('배정 차량 22대')).toBeInTheDocument();
  });

  it('모든 Edge 가 보이게 처음 한 번만 범위를 맞춘다', () => {
    const { rerender } = render(card([SEOUL, BUSAN]));

    expect(mockLeafletMap.fitBounds).toHaveBeenCalledWith(
      [
        [35, 127],
        [37.5, 129],
      ],
      expect.any(Object),
    );

    // 30초 갱신으로 값이 바뀌어도 사용자가 옮긴 화면을 유지한다
    rerender(card([SEOUL, { ...BUSAN, healthy: true }]));

    expect(mockLeafletMap.fitBounds).toHaveBeenCalledOnce();
  });

  it('정상·장애 색 범례를 보여 준다', () => {
    render(card([SEOUL]));

    const legend = screen.getByRole('list', { name: '지도 범례' });
    expect(
      within(legend)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Edge(정상)', 'Edge(장애)']);
  });

  it('Edge 가 없으면 지도 위에 안내하고, 생기면 그때 범위를 맞춘다', () => {
    const { rerender } = render(card([]));

    expect(screen.getByText('등록된 CDN Edge가 없습니다')).toBeInTheDocument();
    expect(mockLeafletMap.fitBounds).not.toHaveBeenCalled();

    rerender(card([SEOUL]));
    expect(mockLeafletMap.fitBounds).toHaveBeenCalledOnce();

    // 잠깐 비었다 돌아와도 다시 맞추지 않는다
    rerender(card([]));
    rerender(card([SEOUL]));
    expect(mockLeafletMap.fitBounds).toHaveBeenCalledOnce();
  });

  it('타일을 불러오지 못하면 지도 영역에 오류를 보여 준다', () => {
    render(card([SEOUL]));

    act(() => {
      mockTileLayer.eventHandlers?.tileerror?.();
    });

    expect(screen.getByRole('alert')).toHaveTextContent('지도를 불러오지 못했습니다');
  });

  it('불러오는 중이면 로딩 상태를 보여 준다', () => {
    render(<EdgeMapCard edgeState={{ status: 'pending' }} />);

    expect(screen.getByText('Edge 위치를 불러오는 중입니다')).toBeInTheDocument();
  });

  it('불러오지 못하면 오류와 다시 시도 버튼을 보여 준다', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(
      <EdgeMapCard edgeState={{ status: 'error', errorCode: 'INTERNAL_SERVER_ERROR', onRetry }} />,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Edge 위치를 불러오지 못했습니다');
    expect(alert).toHaveTextContent('INTERNAL_SERVER_ERROR');
    await user.click(within(alert).getByRole('button', { name: '다시 시도' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
