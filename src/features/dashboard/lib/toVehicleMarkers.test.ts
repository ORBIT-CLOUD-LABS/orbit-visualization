import { describe, expect, it } from 'vitest';

import { vehicleStatusFixture } from '@/mocks/dashboardHandlers';

import { toVehicleMarkers } from './toVehicleMarkers';

const LOCATED_AT = '2026-11-24T01:00:00.000Z';

describe('toVehicleMarkers', () => {
  it('위치를 보낸 차량만 마커로 바꾼다', () => {
    const markers = toVehicleMarkers([
      vehicleStatusFixture({
        vehicleId: 'VH-0001',
        location: { latitude: 37.5, longitude: 127, updatedAt: LOCATED_AT },
      }),
      vehicleStatusFixture({ vehicleId: 'VH-0002', location: null }),
    ]);

    expect(markers).toEqual([
      {
        vehicleId: 'VH-0001',
        position: [37.5, 127],
        result: 'SUCCEEDED',
        tone: 'success',
        locatedAt: LOCATED_AT,
        assignedEdgeId: 'edge-seoul',
        downloadedEdgeId: 'edge-seoul',
      },
    ]);
  });

  it('위치를 보낸 차량이 없으면 빈 목록이다', () => {
    expect(toVehicleMarkers([vehicleStatusFixture({ location: null })])).toEqual([]);
  });
});
