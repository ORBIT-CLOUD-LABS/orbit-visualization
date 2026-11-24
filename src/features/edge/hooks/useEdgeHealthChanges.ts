import { useState } from 'react';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';

import { trackEdgeHealth, type EdgeHealthTracker } from '../lib/trackEdgeHealth';

type Observation = {
  /** 마지막으로 반영한 조회 시각 */
  observedAt: number;
  tracker: EdgeHealthTracker;
};

/**
 * 조회할 때마다 Edge 정상 여부 변화를 쌓는다. 기록은 이 화면의 메모리에만 있어 화면을 떠나면 사라진다.
 * 결과가 같아도 조회 시각(dataUpdatedAt)이 바뀌면 한 번의 조회로 센다
 */
export function useEdgeHealthChanges(
  edges: readonly CdnEdgeStatus[] | undefined,
  dataUpdatedAt: number,
): EdgeHealthTracker | null {
  const [observation, setObservation] = useState<Observation | null>(null);

  // 이전 렌더의 값과 비교해 바로 갱신한다. 조회 결과에서 계산하는 값이라 effect 를 거치지 않는다
  if (edges !== undefined && observation?.observedAt !== dataUpdatedAt) {
    const tracker = trackEdgeHealth(observation?.tracker ?? null, edges, dataUpdatedAt);
    setObservation({ observedAt: dataUpdatedAt, tracker });
    return tracker;
  }
  return observation?.tracker ?? null;
}
