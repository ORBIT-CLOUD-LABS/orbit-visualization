import { useId } from 'react';

import { RESULT_FILTERS, type ResultFilter, type VehicleFilter } from '../lib/filterVehicles';

import { FilterSelect, type FilterOption } from './FilterSelect';

const ALL_OPTION: FilterOption = { value: '', label: '전체' };

const RESULT_LABEL: Record<ResultFilter, string> = {
  ALL: '전체',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  NONE: '결과 없음',
};

const RESULT_OPTIONS: FilterOption[] = RESULT_FILTERS.map((result) => ({
  value: result,
  label: RESULT_LABEL[result],
}));

// 고른 값이 실시간 갱신으로 목록에서 빠져도 선택 상자가 다른 값을 보여 주지 않도록 남겨 둔다
function toOptions(values: readonly string[], selected: string): FilterOption[] {
  const all = selected === '' || values.includes(selected) ? values : [...values, selected];
  return [ALL_OPTION, ...all.map((value) => ({ value, label: value }))];
}

type VehicleFiltersProps = {
  filter: VehicleFilter;
  models: readonly string[];
  edgeIds: readonly string[];
  onChange: (filter: VehicleFilter) => void;
};

export function VehicleFilters({ filter, models, edgeIds, onChange }: VehicleFiltersProps) {
  const searchId = useId();

  function handleResultChange(value: string): void {
    const result = RESULT_FILTERS.find((candidate) => candidate === value);
    if (result !== undefined) {
      onChange({ ...filter, result });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterSelect
        label="차종"
        value={filter.model}
        options={toOptions(models, filter.model)}
        onChange={(model) => onChange({ ...filter, model })}
      />
      <FilterSelect
        label="결과"
        value={filter.result}
        options={RESULT_OPTIONS}
        onChange={handleResultChange}
      />
      <FilterSelect
        label="Edge"
        value={filter.edgeId}
        options={toOptions(edgeIds, filter.edgeId)}
        onChange={(edgeId) => onChange({ ...filter, edgeId })}
      />
      <label htmlFor={searchId} className="sr-only">
        vehicleId 검색
      </label>
      <input
        id={searchId}
        type="search"
        value={filter.query}
        onChange={(event) => onChange({ ...filter, query: event.target.value })}
        placeholder="vehicleId 검색"
        className="h-10 w-60 rounded-md border border-line bg-surface px-3 text-sm text-fg placeholder:text-fg-muted focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary"
      />
    </div>
  );
}
