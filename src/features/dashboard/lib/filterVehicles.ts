import type { VehicleStatus } from '../api/vehicleStatusSchema';

/** 결과 필터. NONE 은 최근 업데이트 결과가 없는 차량이다 */
export const RESULT_FILTERS = ['ALL', 'SUCCEEDED', 'FAILED', 'NONE'] as const;
export type ResultFilter = (typeof RESULT_FILTERS)[number];

export type VehicleFilter = {
  /** 차종. 빈 문자열이면 전체 */
  model: string;
  result: ResultFilter;
  /** 배정 Edge. 빈 문자열이면 전체 */
  edgeId: string;
  /** vehicleId 검색어. 대소문자를 가리지 않고 일부만 맞아도 된다 */
  query: string;
};

export const EMPTY_VEHICLE_FILTER: VehicleFilter = {
  model: '',
  result: 'ALL',
  edgeId: '',
  query: '',
};

function matchesResult(vehicle: VehicleStatus, result: ResultFilter): boolean {
  switch (result) {
    case 'ALL':
      return true;
    case 'NONE':
      return vehicle.lastResult === null;
    default:
      return vehicle.lastResult === result;
  }
}

/** 차종·결과·배정 Edge·vehicleId 검색어로 차량을 거른다. 순서는 그대로 둔다 */
export function filterVehicles(
  vehicles: readonly VehicleStatus[],
  filter: VehicleFilter,
): VehicleStatus[] {
  const query = filter.query.trim().toLowerCase();
  return vehicles.filter(
    (vehicle) =>
      (filter.model === '' || vehicle.model === filter.model) &&
      (filter.edgeId === '' || vehicle.assignedEdgeId === filter.edgeId) &&
      matchesResult(vehicle, filter.result) &&
      (query === '' || vehicle.vehicleId.toLowerCase().includes(query)),
  );
}

/** 필터 선택지에 쓰는 차종과 배정 Edge 목록. 겹치지 않게 이름순으로 돌려준다 */
export function collectFilterOptions(vehicles: readonly VehicleStatus[]): {
  models: string[];
  edgeIds: string[];
} {
  const models = new Set<string>();
  const edgeIds = new Set<string>();
  vehicles.forEach((vehicle) => {
    models.add(vehicle.model);
    if (vehicle.assignedEdgeId !== null) {
      edgeIds.add(vehicle.assignedEdgeId);
    }
  });
  return { models: [...models].sort(), edgeIds: [...edgeIds].sort() };
}
