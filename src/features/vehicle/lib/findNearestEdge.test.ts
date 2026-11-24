import { describe, expect, it } from 'vitest';

import { cdnEdgeStatusFixture } from '@/mocks/cdnEdgeHandlers';

import { findNearestEdge } from './findNearestEdge';

const SEOUL = cdnEdgeStatusFixture({ edgeId: 'edge-seoul', latitude: 37.5665, longitude: 126.978 });
const DAEJEON = cdnEdgeStatusFixture({
  edgeId: 'edge-daejeon',
  latitude: 36.35,
  longitude: 127.38,
});
const BUSAN = cdnEdgeStatusFixture({
  edgeId: 'edge-busan',
  latitude: 35.1796,
  longitude: 129.0756,
  healthy: false,
});

describe('findNearestEdge', () => {
  it('가장 가까운 Edge 와 거리(km)를 돌려준다', () => {
    const nearest = findNearestEdge([37.52, 126.9], [BUSAN, DAEJEON, SEOUL]);

    expect(nearest?.edge.edgeId).toBe('edge-seoul');
    expect(nearest?.distanceKm).toBeCloseTo(8.6, 1);
  });

  it('장애 Edge 도 거리로만 고른다', () => {
    expect(findNearestEdge([35.2, 129.1], [SEOUL, BUSAN])?.edge.edgeId).toBe('edge-busan');
  });

  it('거리가 같으면 목록에서 먼저 나온 Edge 를 고른다', () => {
    const twin = cdnEdgeStatusFixture({
      edgeId: 'edge-twin',
      latitude: 37.5665,
      longitude: 126.978,
    });

    expect(findNearestEdge([37.52, 126.9], [twin, SEOUL])?.edge.edgeId).toBe('edge-twin');
  });

  it('Edge 가 없으면 null', () => {
    expect(findNearestEdge([37.52, 126.9], [])).toBeNull();
  });
});
