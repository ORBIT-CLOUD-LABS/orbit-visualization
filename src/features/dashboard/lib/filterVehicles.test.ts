import { describe, expect, it } from 'vitest';

import { vehicleStatusFixture } from '@/mocks/dashboardHandlers';

import { collectFilterOptions, EMPTY_VEHICLE_FILTER, filterVehicles } from './filterVehicles';

const vehicles = [
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
    vehicleId: 'VH-0013',
    model: 'MODEL-A',
    lastResult: null,
    assignedEdgeId: null,
  }),
];

function ids(list: readonly { vehicleId: string }[]) {
  return list.map((vehicle) => vehicle.vehicleId);
}

describe('filterVehicles', () => {
  it('필터가 비어 있으면 모두 돌려준다', () => {
    expect(ids(filterVehicles(vehicles, EMPTY_VEHICLE_FILTER))).toEqual([
      'VH-0001',
      'VH-0002',
      'VH-0013',
    ]);
  });

  it('차종으로 거른다', () => {
    expect(ids(filterVehicles(vehicles, { ...EMPTY_VEHICLE_FILTER, model: 'MODEL-A' }))).toEqual([
      'VH-0001',
      'VH-0013',
    ]);
  });

  it.each([
    ['SUCCEEDED', ['VH-0002']],
    ['FAILED', ['VH-0001']],
    ['NONE', ['VH-0013']],
  ] as const)('결과 %s 로 거른다', (result, expected) => {
    expect(ids(filterVehicles(vehicles, { ...EMPTY_VEHICLE_FILTER, result }))).toEqual(expected);
  });

  it('배정 Edge 로 거른다', () => {
    expect(
      ids(filterVehicles(vehicles, { ...EMPTY_VEHICLE_FILTER, edgeId: 'edge-busan' })),
    ).toEqual(['VH-0002']);
  });

  it('vehicleId 일부를 대소문자 없이 찾는다', () => {
    expect(ids(filterVehicles(vehicles, { ...EMPTY_VEHICLE_FILTER, query: ' vh-001 ' }))).toEqual([
      'VH-0013',
    ]);
  });

  it('여러 조건을 모두 만족하는 차량만 남긴다', () => {
    expect(
      ids(
        filterVehicles(vehicles, { ...EMPTY_VEHICLE_FILTER, model: 'MODEL-A', result: 'FAILED' }),
      ),
    ).toEqual(['VH-0001']);
  });
});

describe('collectFilterOptions', () => {
  it('차종과 배정 Edge 를 겹치지 않게 이름순으로 모은다', () => {
    expect(collectFilterOptions(vehicles)).toEqual({
      models: ['MODEL-A', 'MODEL-B'],
      edgeIds: ['edge-busan', 'edge-seoul'],
    });
  });
});
