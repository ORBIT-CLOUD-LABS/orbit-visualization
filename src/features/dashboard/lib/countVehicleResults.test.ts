import { describe, expect, it } from 'vitest';

import { vehicleStatusFixture } from '@/mocks/dashboardHandlers';

import { countVehicleResults } from './countVehicleResults';

describe('countVehicleResults', () => {
  it('전체와 최근 결과별 차량 수를 센다', () => {
    const vehicles = [
      vehicleStatusFixture({ vehicleId: 'VH-0001', lastResult: 'SUCCEEDED' }),
      vehicleStatusFixture({ vehicleId: 'VH-0002', lastResult: 'FAILED' }),
      vehicleStatusFixture({ vehicleId: 'VH-0003', lastResult: 'SUCCEEDED' }),
      vehicleStatusFixture({ vehicleId: 'VH-0004', lastResult: null }),
    ];

    expect(countVehicleResults(vehicles)).toEqual({
      total: 4,
      succeeded: 2,
      failed: 1,
      noResult: 1,
    });
  });

  it('차량이 없으면 모두 0 이다', () => {
    expect(countVehicleResults([])).toEqual({ total: 0, succeeded: 0, failed: 0, noResult: 0 });
  });
});
