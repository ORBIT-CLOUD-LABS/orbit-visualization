import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { cdnEdgeStatusFixture } from '@/mocks/cdnEdgeHandlers';
import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { formatClockTime } from '@/shared/lib/formatClockTime';
import type { QueryState } from '@/shared/lib/toQueryState';
import type { VehicleLocation } from '@/shared/vehicle/vehicleLocationSchema';
import { mockLeafletMap } from '@/test/reactLeafletMock';

import { VehicleLocationCard } from './VehicleLocationCard';

vi.mock('react-leaflet', () => import('@/test/reactLeafletMock'));

const LOCATION: VehicleLocation = {
  latitude: 37.52,
  longitude: 126.9,
  updatedAt: '2026-10-28T01:00:30.000Z',
};
const SEOUL = cdnEdgeStatusFixture({ edgeId: 'edge-seoul', name: '서울' });
const DAEJEON = cdnEdgeStatusFixture({
  edgeId: 'edge-daejeon',
  name: '대전',
  latitude: 36.35,
  longitude: 127.38,
});
const BUSAN = cdnEdgeStatusFixture({
  edgeId: 'edge-busan',
  name: '부산',
  latitude: 35.1796,
  longitude: 129.0756,
  healthy: false,
});

type RenderOptions = {
  location?: VehicleLocation | null;
  assignedEdgeId?: string | null;
  edgeState?: QueryState<readonly CdnEdgeStatus[]>;
};

function renderCard({
  location = LOCATION,
  assignedEdgeId = 'edge-seoul',
  edgeState = { status: 'success', data: [SEOUL, DAEJEON, BUSAN] },
}: RenderOptions = {}) {
  render(
    <VehicleLocationCard
      location={location}
      assignedEdgeId={assignedEdgeId}
      lastResult="FAILED"
      edgeState={edgeState}
    />,
  );
  return screen.getByRole('region', { name: '위치 · 배정 Edge' });
}

function fittedBounds() {
  return mockLeafletMap.fitBounds.mock.calls.map(([bounds]: unknown[]) => bounds);
}

describe('VehicleLocationCard', () => {
  beforeEach(() => {
    mockLeafletMap.fitBounds.mockClear();
  });

  it('좌표·위치 수신 시각·가장 가까운 Edge 와 거리를 보여 준다', () => {
    const card = renderCard();

    expect(card).toHaveTextContent('37.5200');
    expect(card).toHaveTextContent('126.9000');
    expect(within(card).getByText('edge-seoul · 8.6 km')).toBeInTheDocument();
    expect(card).toHaveTextContent(formatClockTime(LOCATION.updatedAt) ?? '');
  });

  it('지도에 모든 Edge 를 이름으로 그리고 장애 Edge 는 알린다', () => {
    const card = renderCard();

    expect(within(card).getByText('서울')).toBeInTheDocument();
    expect(within(card).getByText('대전')).toBeInTheDocument();
    expect(within(card).getByText('부산 (장애)')).toBeInTheDocument();
  });

  it('차량과 배정·가까운 Edge 가 함께 보이게 범위를 맞춘다', () => {
    renderCard();

    expect(fittedBounds()).toEqual([
      [
        [37.52, 126.9],
        [SEOUL.latitude, SEOUL.longitude],
      ],
    ]);
  });

  it('배정 Edge 와 가까운 Edge 가 다르면 둘 다 담고 가까운 Edge 를 따로 보여 준다', () => {
    const card = renderCard({ assignedEdgeId: 'edge-busan' });

    expect(within(card).getByText('edge-seoul · 8.6 km')).toBeInTheDocument();
    expect(fittedBounds()).toEqual([
      [
        [BUSAN.latitude, 126.9],
        [SEOUL.latitude, BUSAN.longitude],
      ],
    ]);
  });

  it('위치가 없으면 지도 대신 안내하고 가까운 Edge 는 비워 둔다', () => {
    const card = renderCard({ location: null });

    expect(within(card).getByText('아직 위치를 받지 않았습니다')).toBeInTheDocument();
    expect(within(card).queryByText('서울')).not.toBeInTheDocument();
    expect(within(card).queryByText(/km/)).not.toBeInTheDocument();
    expect(mockLeafletMap.fitBounds).not.toHaveBeenCalled();
  });

  it('Edge 를 받는 동안은 범위를 맞추지 않고 불러오는 중이라고 알린다', () => {
    const card = renderCard({ edgeState: { status: 'pending' } });

    expect(within(card).getByText('불러오는 중입니다')).toBeInTheDocument();
    expect(mockLeafletMap.fitBounds).not.toHaveBeenCalled();
  });

  it('Edge 를 받지 못하면 차량만 담고 가까운 Edge 칸에서 다시 시도할 수 있다', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    const card = renderCard({ edgeState: { status: 'error', onRetry } });

    expect(within(card).getByText('Edge 정보를 불러오지 못했습니다')).toBeInTheDocument();
    expect(within(card).queryByText('서울')).not.toBeInTheDocument();
    expect(fittedBounds()).toEqual([
      [
        [37.52, 126.9],
        [37.52, 126.9],
      ],
    ]);
    await user.click(within(card).getByRole('button', { name: '다시 시도' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('Edge 가 하나도 없으면 가까운 Edge 를 비워 둔다', () => {
    const card = renderCard({ edgeState: { status: 'success', data: [] } });

    expect(within(card).queryByText(/km/)).not.toBeInTheDocument();
    expect(fittedBounds()).toHaveLength(1);
  });
});
