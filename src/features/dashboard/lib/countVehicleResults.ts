import type { VehicleStatus } from '../api/vehicleStatusSchema';

export type VehicleResultCounts = {
  total: number;
  succeeded: number;
  failed: number;
  /** 최근 업데이트 결과가 없는 차량 */
  noResult: number;
};

/** 통계 카드에 쓰는 차량 수. 최근 업데이트 결과별로 센다 */
export function countVehicleResults(vehicles: readonly VehicleStatus[]): VehicleResultCounts {
  const counts: VehicleResultCounts = {
    total: vehicles.length,
    succeeded: 0,
    failed: 0,
    noResult: 0,
  };
  vehicles.forEach(({ lastResult }) => {
    if (lastResult === 'SUCCEEDED') {
      counts.succeeded += 1;
    } else if (lastResult === 'FAILED') {
      counts.failed += 1;
    } else {
      counts.noResult += 1;
    }
  });
  return counts;
}
