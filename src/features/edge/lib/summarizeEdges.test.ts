import { describe, expect, it } from 'vitest';

import { cdnEdgeStatusFixture } from '@/mocks/cdnEdgeHandlers';

import { summarizeEdges } from './summarizeEdges';

describe('summarizeEdges', () => {
  it('Edge 수·정상/장애 수·배정 차량 합계를 센다', () => {
    const edges = [
      cdnEdgeStatusFixture({ assignedVehicles: 64 }),
      cdnEdgeStatusFixture({ edgeId: 'edge-daejeon', assignedVehicles: 41 }),
      cdnEdgeStatusFixture({ edgeId: 'edge-busan', healthy: false, assignedVehicles: 22 }),
    ];

    expect(summarizeEdges(edges)).toEqual({
      total: 3,
      healthy: 2,
      unhealthy: 1,
      assignedVehicles: 127,
    });
  });

  it('Edge 가 없으면 모두 0 이다', () => {
    expect(summarizeEdges([])).toEqual({
      total: 0,
      healthy: 0,
      unhealthy: 0,
      assignedVehicles: 0,
    });
  });
});
