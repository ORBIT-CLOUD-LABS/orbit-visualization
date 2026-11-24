import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { cdnEdgeStatusFixture, vehicleStatusFixture } from '@/mocks/dashboardHandlers';
import { routePaths } from '@/shared/config/routes';
import { mockLeafletMap, mockTileLayer } from '@/test/reactLeafletMock';

import type { CdnEdgeStatus } from '../api/cdnEdgeSchema';
import type { VehicleStatus } from '../api/vehicleStatusSchema';
import { formatClockTime } from '../lib/formatClockTime';
import type { QueryState } from '../lib/toQueryState';

import { VehicleMapCard } from './VehicleMapCard';

vi.mock('react-leaflet', () => import('@/test/reactLeafletMock'));

const LOCATED_AT = '2026-11-24T01:00:00.000Z';
const SEOUL_EDGE = cdnEdgeStatusFixture({ latitude: 37.5, longitude: 127 });

type CardProps = {
  vehicleState: QueryState<readonly VehicleStatus[]>;
  edges?: readonly CdnEdgeStatus[];
  isEdgesSettled?: boolean;
};

function card({ vehicleState, edges = [SEOUL_EDGE], isEdgesSettled = true }: CardProps) {
  return (
    <MemoryRouter>
      <VehicleMapCard vehicleState={vehicleState} edges={edges} isEdgesSettled={isEdgesSettled} />
    </MemoryRouter>
  );
}

function located(vehicleId: string, latitude: number, longitude: number): VehicleStatus {
  return vehicleStatusFixture({
    vehicleId,
    location: { latitude, longitude, updatedAt: LOCATED_AT },
  });
}

describe('VehicleMapCard', () => {
  beforeEach(() => {
    mockLeafletMap.fitBounds.mockClear();
  });

  it('위치를 보낸 차량만 마커로 그리고 팝업에 결과·위치 시각·상세 링크를 둔다', () => {
    render(
      card({
        vehicleState: {
          status: 'success',
          data: [
            located('VH-0001', 37.4, 127.1),
            vehicleStatusFixture({ vehicleId: 'VH-0002', location: null }),
          ],
        },
      }),
    );

    expect(screen.getByRole('link', { name: 'VH-0001' })).toHaveAttribute(
      'href',
      routePaths.vehicleDetail('VH-0001'),
    );
    expect(screen.queryByRole('link', { name: 'VH-0002' })).not.toBeInTheDocument();
    expect(screen.getByText('SUCCEEDED')).toBeInTheDocument();
    expect(screen.getByText(formatClockTime(LOCATED_AT) ?? '')).toBeInTheDocument();
    expect(
      screen.getByText('위치 정보가 없는 차량 1대는 지도에 표시되지 않습니다'),
    ).toBeInTheDocument();
  });

  it('Edge 는 이름 라벨로 그리고 장애면 라벨에 알린다', () => {
    render(
      card({
        vehicleState: { status: 'success', data: [] },
        edges: [
          SEOUL_EDGE,
          cdnEdgeStatusFixture({ edgeId: 'edge-busan', name: '부산', healthy: false }),
        ],
      }),
    );

    expect(screen.getByText('서울')).toBeInTheDocument();
    expect(screen.getByText('부산 (장애)')).toBeInTheDocument();
  });

  it('차량과 Edge 를 다 받으면 모든 마커가 보이게 한 번만 범위를 맞춘다', () => {
    const { rerender } = render(
      card({
        vehicleState: { status: 'success', data: [located('VH-0001', 35, 129)] },
        isEdgesSettled: false,
      }),
    );
    expect(mockLeafletMap.fitBounds).not.toHaveBeenCalled();

    rerender(card({ vehicleState: { status: 'success', data: [located('VH-0001', 35, 129)] } }));

    expect(mockLeafletMap.fitBounds).toHaveBeenCalledOnce();
    expect(mockLeafletMap.fitBounds).toHaveBeenCalledWith(
      [
        [35, 127],
        [37.5, 129],
      ],
      expect.any(Object),
    );

    // SSE 로 위치가 바뀌어도 사용자가 옮긴 화면을 유지한다
    rerender(card({ vehicleState: { status: 'success', data: [located('VH-0001', 33, 126)] } }));

    expect(mockLeafletMap.fitBounds).toHaveBeenCalledOnce();
  });

  it('위치를 보낸 차량이 없으면 지도 위에 안내한다', () => {
    render(
      card({
        vehicleState: {
          status: 'success',
          data: [vehicleStatusFixture({ location: null })],
        },
      }),
    );

    expect(screen.getByText('위치를 보낸 차량이 없습니다')).toBeInTheDocument();
  });

  it('결과별 색과 선 모양 범례를 보여 준다', () => {
    render(card({ vehicleState: { status: 'success', data: [] } }));

    const legend = screen.getByRole('list', { name: '지도 범례' });
    expect(
      within(legend)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Edge', '차량(정상)', '차량(실패)', '차량(결과 없음)', '배정 Edge', '재배정']);
  });

  it('타일을 불러오지 못하면 지도 영역에 오류를 보여 준다', () => {
    render(card({ vehicleState: { status: 'success', data: [] } }));

    act(() => {
      mockTileLayer.eventHandlers?.tileerror?.();
    });

    expect(screen.getByRole('alert')).toHaveTextContent('지도를 불러오지 못했습니다');

    act(() => {
      mockTileLayer.eventHandlers?.tileload?.();
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('타일이 한 번 뜬 뒤의 일부 실패는 알리지 않는다', () => {
    render(card({ vehicleState: { status: 'success', data: [] } }));

    act(() => {
      mockTileLayer.eventHandlers?.tileload?.();
      mockTileLayer.eventHandlers?.tileerror?.();
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('불러오는 중이면 로딩 상태를 보여 준다', () => {
    render(card({ vehicleState: { status: 'pending' } }));

    expect(screen.getByText('차량 위치를 불러오는 중입니다')).toBeInTheDocument();
  });

  it('불러오지 못하면 오류와 다시 시도 버튼을 보여 준다', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      card({ vehicleState: { status: 'error', errorCode: 'INTERNAL_SERVER_ERROR', onRetry } }),
    );

    expect(screen.getByRole('alert')).toHaveTextContent('차량 위치를 불러오지 못했습니다');

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
