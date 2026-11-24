import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { vehicleStatusFixture } from '@/mocks/dashboardHandlers';
import { formatClockTime } from '@/shared/lib/formatClockTime';
import type { QueryState } from '@/shared/lib/toQueryState';

import type { VehicleStatus } from '../api/vehicleStatusSchema';

import { VehicleListCard } from './VehicleListCard';

function renderCard(state: QueryState<readonly VehicleStatus[]>) {
  return render(
    <MemoryRouter>
      <VehicleListCard state={state} />
    </MemoryRouter>,
  );
}

function renderVehicles(vehicles: VehicleStatus[]) {
  return renderCard({ status: 'success', data: vehicles });
}

function manyVehicles(count: number): VehicleStatus[] {
  return Array.from({ length: count }, (_, index) =>
    vehicleStatusFixture({ vehicleId: `VH-${String(index + 1).padStart(4, '0')}` }),
  );
}

function bodyRows() {
  const [, ...rows] = screen.getAllByRole('row');
  return rows;
}

describe('VehicleListCard', () => {
  it('차량마다 한 행을 그리고 vehicleId 를 차량 상세 링크로 만든다', () => {
    const lastSeenAt = '2026-11-24T01:00:30.000Z';
    renderVehicles([
      vehicleStatusFixture({
        vehicleId: 'VH-0001',
        model: 'MODEL-A',
        currentVersion: '1.0.0',
        campaignId: 7,
        lastResult: 'FAILED',
        failureReason: 'SIGNATURE_INVALID',
        assignedEdgeId: 'edge-seoul',
        downloadedEdgeId: 'edge-daejeon',
        lastSeenAt,
      }),
    ]);

    expect(screen.getByRole('table', { name: '차량 목록' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'VH-0001' })).toHaveAttribute(
      'href',
      '/vehicles/VH-0001',
    );
    const [row] = bodyRows();
    expect(row).toBeDefined();
    const cells = within(row ?? document.body).getAllByRole('cell');
    expect(cells.map((cell) => cell.textContent)).toEqual([
      'MODEL-A',
      '1.0.0',
      '7',
      'FAILED',
      'SIGNATURE_INVALID',
      'edge-seoul',
      'edge-daejeon',
      formatClockTime(lastSeenAt),
    ]);
  });

  it('값이 없는 칸은 — 로, 결과가 없으면 결과 없음으로 보여 준다', () => {
    renderVehicles([
      vehicleStatusFixture({
        campaignId: null,
        lastResult: null,
        failureReason: null,
        assignedEdgeId: null,
        downloadedEdgeId: null,
        lastSeenAt: null,
      }),
    ]);

    const cells = within(bodyRows()[0] ?? document.body).getAllByRole('cell');
    expect(cells.map((cell) => cell.textContent)).toEqual([
      'MODEL-A',
      '1.0.0',
      '—',
      '결과 없음',
      '—',
      '—',
      '—',
      '—',
    ]);
  });

  it('20개씩 페이지로 나누고 요약을 보여 준다', async () => {
    const user = userEvent.setup();
    renderVehicles(manyVehicles(25));

    expect(bodyRows()).toHaveLength(20);
    expect(screen.getByText('25대 중 1–20 · 1 / 2 페이지')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(bodyRows()).toHaveLength(5);
    expect(screen.getByText('25대 중 21–25 · 2 / 2 페이지')).toBeInTheDocument();
  });

  it('필터나 검색어가 바뀌면 1페이지로 돌아간다', async () => {
    const user = userEvent.setup();
    renderVehicles(manyVehicles(45));
    await user.click(screen.getByRole('button', { name: '3 페이지' }));

    await user.type(screen.getByRole('searchbox', { name: 'vehicleId 검색' }), 'VH-00');

    expect(screen.getByText('45대 중 1–20 · 1 / 3 페이지')).toBeInTheDocument();
  });

  it('차종·결과·Edge 로 거르고 vehicleId 로 찾는다', async () => {
    const user = userEvent.setup();
    renderVehicles([
      vehicleStatusFixture({
        vehicleId: 'VH-0001',
        model: 'MODEL-A',
        lastResult: 'FAILED',
        assignedEdgeId: 'edge-seoul',
      }),
      vehicleStatusFixture({
        vehicleId: 'VH-0002',
        model: 'MODEL-B',
        lastResult: 'SUCCEEDED',
        assignedEdgeId: 'edge-busan',
      }),
      vehicleStatusFixture({
        vehicleId: 'VH-0003',
        model: 'MODEL-A',
        lastResult: null,
        assignedEdgeId: 'edge-busan',
      }),
    ]);

    await user.selectOptions(screen.getByRole('combobox', { name: '차종' }), 'MODEL-A');
    expect(screen.getByText('2대 중 1–2 · 1 / 1 페이지')).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Edge' }), 'edge-busan');
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(['VH-0003']);

    await user.selectOptions(screen.getByRole('combobox', { name: '결과' }), '결과 없음');
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(['VH-0003']);

    await user.selectOptions(screen.getByRole('combobox', { name: '차종' }), '전체');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Edge' }), '전체');
    await user.selectOptions(screen.getByRole('combobox', { name: '결과' }), '전체');
    await user.type(screen.getByRole('searchbox', { name: 'vehicleId 검색' }), '0002');
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(['VH-0002']);
  });

  it('조건에 맞는 차량이 없으면 안내하고 필터를 초기화할 수 있다', async () => {
    const user = userEvent.setup();
    renderVehicles(manyVehicles(3));

    await user.type(screen.getByRole('searchbox', { name: 'vehicleId 검색' }), 'nothing');

    expect(screen.getByText('조건에 맞는 차량이 없습니다')).toBeInTheDocument();
    expect(screen.getByText('필터를 바꾸거나 초기화해 보세요')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '필터 초기화' }));

    expect(bodyRows()).toHaveLength(3);
    expect(screen.getByRole('searchbox', { name: 'vehicleId 검색' })).toHaveValue('');
  });

  it('체크인한 차량이 없으면 빈 상태를 보여 준다', () => {
    renderVehicles([]);

    expect(screen.getByText('아직 체크인한 차량이 없습니다')).toBeInTheDocument();
    expect(screen.getByText('차량이 처음 체크인하면 여기에 표시됩니다')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('불러오는 중이면 스켈레톤을 보여 준다', () => {
    renderCard({ status: 'pending' });

    expect(screen.getByText('차량 목록을 불러오는 중입니다')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('불러오지 못하면 오류와 다시 시도 버튼을 보여 준다', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    renderCard({ status: 'error', errorCode: 'INTERNAL_SERVER_ERROR', onRetry });

    expect(screen.getByRole('alert')).toHaveTextContent('차량 목록을 불러오지 못했습니다');

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
