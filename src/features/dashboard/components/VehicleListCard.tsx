import { useId, useMemo, useState } from 'react';

import { usePagination } from '@/shared/lib/usePagination';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Pagination } from '@/shared/ui/Pagination';
import { SkeletonRow } from '@/shared/ui/SkeletonRow';

import type { VehicleStatus } from '../api/vehicleStatusSchema';
import {
  collectFilterOptions,
  EMPTY_VEHICLE_FILTER,
  filterVehicles,
  type VehicleFilter,
} from '../lib/filterVehicles';

import { VehicleFilters } from './VehicleFilters';
import { VehicleTable } from './VehicleTable';

const SKELETON_ROWS = [1, 2, 3, 4, 5] as const;
const NO_VEHICLES: readonly VehicleStatus[] = [];

export type VehicleListState =
  | { status: 'pending' }
  | { status: 'error'; errorCode?: string; onRetry: () => void }
  | { status: 'success'; vehicles: readonly VehicleStatus[] };

type VehicleListCardProps = {
  state: VehicleListState;
};

export function VehicleListCard({ state }: VehicleListCardProps) {
  const headingId = useId();
  const [filter, setFilter] = useState<VehicleFilter>(EMPTY_VEHICLE_FILTER);
  const vehicles = state.status === 'success' ? state.vehicles : NO_VEHICLES;

  const options = useMemo(() => collectFilterOptions(vehicles), [vehicles]);
  const filtered = useMemo(() => filterVehicles(vehicles, filter), [vehicles, filter]);
  // 필터를 바꿀 때마다 새 객체로 바꾸므로 filter 하나로 1페이지 복귀를 판단한다
  const pagination = usePagination(filtered, { resetDeps: [filter] });

  function renderBody() {
    if (state.status === 'pending') {
      return (
        <div aria-busy="true" className="flex flex-col divide-y divide-line">
          <p className="sr-only">차량 목록을 불러오는 중입니다</p>
          {SKELETON_ROWS.map((row) => (
            <SkeletonRow key={row} />
          ))}
        </div>
      );
    }
    if (state.status === 'error') {
      return (
        <Alert
          type="error"
          title="차량 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
          code={state.errorCode}
          action={
            <Button variant="secondary" onClick={state.onRetry}>
              다시 시도
            </Button>
          }
        />
      );
    }
    if (vehicles.length === 0) {
      return (
        <EmptyState
          title="아직 체크인한 차량이 없습니다"
          description="차량이 처음 체크인하면 여기에 표시됩니다"
        />
      );
    }
    if (filtered.length === 0) {
      return (
        <EmptyState
          title="조건에 맞는 차량이 없습니다"
          description="필터를 바꾸거나 초기화해 보세요"
          action={
            <Button variant="secondary" onClick={() => setFilter(EMPTY_VEHICLE_FILTER)}>
              필터 초기화
            </Button>
          }
        />
      );
    }
    return (
      <>
        <VehicleTable vehicles={pagination.pageItems} labelledBy={headingId} />
        <Pagination
          page={pagination.page}
          pageCount={pagination.pageCount}
          onPageChange={pagination.setPage}
          summary={`${pagination.totalCount}대 중 ${pagination.rangeStart}–${pagination.rangeEnd} · ${pagination.page} / ${pagination.pageCount} 페이지`}
        />
      </>
    );
  }

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={headingId} className="text-md font-bold text-fg">
          차량 목록
        </h2>
        {vehicles.length > 0 && (
          <VehicleFilters
            filter={filter}
            models={options.models}
            edgeIds={options.edgeIds}
            onChange={setFilter}
          />
        )}
      </div>
      {renderBody()}
    </section>
  );
}
