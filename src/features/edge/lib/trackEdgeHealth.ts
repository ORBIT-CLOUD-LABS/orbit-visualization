import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';

/** 화면에 남기는 상태 변화 기록 수. 넘으면 오래된 것부터 지운다 */
export const MAX_EDGE_HEALTH_CHANGES = 20;

/** 같은 값이 두 번 연속 조회되어 확정된 정상 여부 변화 */
export type EdgeHealthChange = {
  /** 목록 key. 같은 Edge 가 같은 조회에서 두 번 바뀔 수 없으므로 Edge 와 조회 시각으로 만든다 */
  id: string;
  edgeId: string;
  /** 바뀐 뒤의 정상 여부 */
  healthy: boolean;
  /** 확정한 조회의 시각 (epoch ms) */
  detectedAt: number;
};

/** 한 번만 조회되어 아직 확정하지 않은 변화 */
export type EdgeHealthCandidate = {
  edgeId: string;
  healthy: boolean;
};

export type EdgeHealthTracker = {
  /** Edge 마다 마지막으로 확정한 정상 여부 */
  confirmed: ReadonlyMap<string, boolean>;
  /** 확정 값과 다르게 한 번 조회된 값. 다음 조회에서도 같으면 확정한다 */
  candidates: ReadonlyMap<string, boolean>;
  /** 최신순, 최대 MAX_EDGE_HEALTH_CHANGES 개 */
  changes: readonly EdgeHealthChange[];
};

/**
 * 새로 조회한 Edge 상태를 반영한다.
 * 정상 여부는 요청을 받은 서버 Pod 의 헬스체크 결과라 Pod 마다 잠깐 다를 수 있으므로,
 * 확정 값과 다른 값이 두 번 연속 조회되어야 변화로 기록한다.
 * 첫 조회와 새로 생긴 Edge 의 값은 기준값이라 기록하지 않는다
 */
export function trackEdgeHealth(
  previous: EdgeHealthTracker | null,
  edges: readonly CdnEdgeStatus[],
  observedAt: number,
): EdgeHealthTracker {
  const confirmed = new Map<string, boolean>();
  const candidates = new Map<string, boolean>();
  const detected: EdgeHealthChange[] = [];

  for (const { edgeId, healthy } of edges) {
    const known = previous?.confirmed.get(edgeId);
    if (known === undefined || known === healthy) {
      confirmed.set(edgeId, healthy);
      continue;
    }
    if (previous?.candidates.get(edgeId) === healthy) {
      confirmed.set(edgeId, healthy);
      detected.push({ id: `${edgeId}@${observedAt}`, edgeId, healthy, detectedAt: observedAt });
      continue;
    }
    confirmed.set(edgeId, known);
    candidates.set(edgeId, healthy);
  }

  return {
    confirmed,
    candidates,
    changes: [...detected, ...(previous?.changes ?? [])].slice(0, MAX_EDGE_HEALTH_CHANGES),
  };
}

/** 확인 중인 변화 목록 (Edge 목록 순서) */
export function listEdgeHealthCandidates(tracker: EdgeHealthTracker): EdgeHealthCandidate[] {
  return Array.from(tracker.candidates, ([edgeId, healthy]) => ({ edgeId, healthy }));
}
