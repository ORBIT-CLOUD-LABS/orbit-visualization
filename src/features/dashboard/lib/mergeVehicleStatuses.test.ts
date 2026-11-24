import { describe, expect, it } from 'vitest';

import { vehicleStatusFixture } from '@/mocks/dashboardHandlers';

import { mergeVehicleStatuses } from './mergeVehicleStatuses';

const EARLIER = '2026-11-24T01:00:00.000Z';
const LATER = '2026-11-24T01:00:05.000Z';

describe('mergeVehicleStatuses', () => {
  it('updatedAt 이 늦은 변경분으로 바꾼다', () => {
    const current = [vehicleStatusFixture({ updatedAt: EARLIER, lastResult: null })];
    const change = vehicleStatusFixture({ updatedAt: LATER, lastResult: 'FAILED' });

    expect(mergeVehicleStatuses(current, [change])).toEqual([change]);
  });

  it('updatedAt 이 이른 변경분은 버린다', () => {
    const current = [vehicleStatusFixture({ updatedAt: LATER, lastResult: 'SUCCEEDED' })];
    const stale = vehicleStatusFixture({ updatedAt: EARLIER, lastResult: 'FAILED' });

    expect(mergeVehicleStatuses(current, [stale])).toEqual(current);
  });

  it('처음 보는 차량은 vehicleId 순서에 맞춰 넣는다', () => {
    const current = [
      vehicleStatusFixture({ vehicleId: 'VH-0001' }),
      vehicleStatusFixture({ vehicleId: 'VH-0003' }),
    ];

    const merged = mergeVehicleStatuses(current, [vehicleStatusFixture({ vehicleId: 'VH-0002' })]);

    expect(merged.map((vehicle) => vehicle.vehicleId)).toEqual(['VH-0001', 'VH-0002', 'VH-0003']);
  });

  it('같은 차량이 변경분에 여러 번 오면 가장 늦은 것을 쓴다', () => {
    const latest = vehicleStatusFixture({ updatedAt: LATER, currentVersion: '1.1.0' });

    const merged = mergeVehicleStatuses(
      [],
      [latest, vehicleStatusFixture({ updatedAt: EARLIER, currentVersion: '1.0.0' })],
    );

    expect(merged).toEqual([latest]);
  });
});
