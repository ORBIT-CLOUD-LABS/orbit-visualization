import { describe, expect, it } from 'vitest';

import { cdnEdgeStatusFixture } from '@/mocks/cdnEdgeHandlers';

import { buildEdgeLinks } from './buildEdgeLinks';
import type { VehicleMarker } from './toVehicleMarkers';

const SEOUL = cdnEdgeStatusFixture({ edgeId: 'edge-seoul', latitude: 37.5, longitude: 127 });
const BUSAN = cdnEdgeStatusFixture({ edgeId: 'edge-busan', latitude: 35.1, longitude: 129 });

function marker(overrides: Partial<VehicleMarker>): VehicleMarker {
  return {
    vehicleId: 'VH-0001',
    position: [36, 128],
    result: null,
    tone: 'neutral',
    locatedAt: '2026-11-24T01:00:00.000Z',
    assignedEdgeId: null,
    downloadedEdgeId: null,
    ...overrides,
  };
}

describe('buildEdgeLinks', () => {
  it('배정 Edge 와 받은 Edge 가 같으면 실선 하나만 긋는다', () => {
    const links = buildEdgeLinks(
      [marker({ assignedEdgeId: 'edge-seoul', downloadedEdgeId: 'edge-seoul' })],
      [SEOUL, BUSAN],
    );

    expect(links).toEqual([
      {
        id: 'VH-0001:assigned',
        kind: 'assigned',
        positions: [
          [36, 128],
          [37.5, 127],
        ],
      },
    ]);
  });

  it('받은 Edge 가 배정 Edge 와 다르면 받은 Edge 로 점선을 더 긋는다', () => {
    const links = buildEdgeLinks(
      [marker({ assignedEdgeId: 'edge-busan', downloadedEdgeId: 'edge-seoul' })],
      [SEOUL, BUSAN],
    );

    expect(links.map((link) => [link.kind, link.positions[1]])).toEqual([
      ['assigned', [35.1, 129]],
      ['reassigned', [37.5, 127]],
    ]);
  });

  it('배정받지 않았거나 지도에 없는 Edge 로는 선을 긋지 않는다', () => {
    const links = buildEdgeLinks(
      [
        marker({ vehicleId: 'VH-0001' }),
        marker({ vehicleId: 'VH-0002', assignedEdgeId: 'edge-gone', downloadedEdgeId: 'edge-old' }),
      ],
      [SEOUL],
    );

    expect(links).toEqual([]);
  });
});
