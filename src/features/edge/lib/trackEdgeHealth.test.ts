import { describe, expect, it } from 'vitest';

import { cdnEdgeStatusFixture } from '@/mocks/cdnEdgeHandlers';
import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';

import {
  listEdgeHealthCandidates,
  MAX_EDGE_HEALTH_CHANGES,
  trackEdgeHealth,
  type EdgeHealthTracker,
} from './trackEdgeHealth';

function seoul(healthy: boolean) {
  return cdnEdgeStatusFixture({ healthy });
}

function busan(healthy: boolean) {
  return cdnEdgeStatusFixture({ edgeId: 'edge-busan', name: '부산', healthy });
}

/** 조회 결과를 차례로 반영한다. i 번째 조회 시각은 i * 1000 */
function observe(first: CdnEdgeStatus[], ...rest: CdnEdgeStatus[][]): EdgeHealthTracker {
  return rest.reduce(
    (tracker, edges, index) => trackEdgeHealth(tracker, edges, (index + 1) * 1000),
    trackEdgeHealth(null, first, 0),
  );
}

describe('trackEdgeHealth', () => {
  it('첫 조회는 기준값이라 기록하지 않는다', () => {
    const tracker = observe([seoul(true), busan(false)]);

    expect(tracker.changes).toEqual([]);
    expect(listEdgeHealthCandidates(tracker)).toEqual([]);
  });

  it('바뀐 값이 한 번만 조회되면 확인 중으로 두고 기록하지 않는다', () => {
    const tracker = observe([busan(true)], [busan(false)]);

    expect(tracker.changes).toEqual([]);
    expect(listEdgeHealthCandidates(tracker)).toEqual([
      { edgeId: 'edge-busan', healthy: false, firstSeenAt: 1000 },
    ]);
  });

  it('바뀐 값이 두 번 연속 조회되면 처음 본 조회 시각으로 기록한다', () => {
    const tracker = observe([busan(true)], [busan(false)], [busan(false)]);

    expect(tracker.changes).toEqual([
      { id: 'edge-busan@1000', edgeId: 'edge-busan', healthy: false, detectedAt: 1000 },
    ]);
    expect(listEdgeHealthCandidates(tracker)).toEqual([]);
  });

  it('한 번만 다르게 보이고 원래 값으로 돌아오면 기록하지 않는다', () => {
    const tracker = observe([busan(true)], [busan(false)], [busan(true)], [busan(true)]);

    expect(tracker.changes).toEqual([]);
    expect(listEdgeHealthCandidates(tracker)).toEqual([]);
  });

  it('장애와 복구를 최신순으로 쌓는다', () => {
    const tracker = observe(
      [seoul(true), busan(false)],
      [seoul(true), busan(true)],
      [seoul(false), busan(true)],
      [seoul(false), busan(true)],
    );

    expect(tracker.changes.map(({ edgeId, healthy }) => ({ edgeId, healthy }))).toEqual([
      { edgeId: 'edge-seoul', healthy: false },
      { edgeId: 'edge-busan', healthy: true },
    ]);
  });

  it('새로 생긴 Edge 는 기준값으로 두고 사라진 Edge 는 잊는다', () => {
    const tracker = observe([seoul(true)], [seoul(true), busan(false)], [busan(false)]);

    expect(tracker.changes).toEqual([]);
    expect([...tracker.confirmed]).toEqual([['edge-busan', false]]);
  });

  it(`기록은 최근 ${MAX_EDGE_HEALTH_CHANGES}개까지만 남긴다`, () => {
    const rest: CdnEdgeStatus[][] = [];
    for (let flip = 0; flip <= MAX_EDGE_HEALTH_CHANGES; flip += 1) {
      const healthy = flip % 2 === 1;
      rest.push([busan(healthy)], [busan(healthy)]);
    }

    const tracker = observe([busan(true)], ...rest);

    expect(tracker.changes).toHaveLength(MAX_EDGE_HEALTH_CHANGES);
    expect(tracker.changes[0]?.detectedAt).toBe((rest.length - 1) * 1000);
  });
});
