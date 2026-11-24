import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { cdnEdgeStatusFixture } from '@/mocks/cdnEdgeHandlers';
import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';

import { useEdgeHealthChanges } from './useEdgeHealthChanges';

type Props = { edges: CdnEdgeStatus[] | undefined; dataUpdatedAt: number };

function render(initialProps: Props) {
  return renderHook(
    ({ edges, dataUpdatedAt }: Props) => useEdgeHealthChanges(edges, dataUpdatedAt),
    {
      initialProps,
    },
  );
}

describe('useEdgeHealthChanges', () => {
  it('아직 받은 값이 없으면 null 이다', () => {
    const { result } = render({ edges: undefined, dataUpdatedAt: 0 });

    expect(result.current).toBeNull();
  });

  it('결과가 같은 객체여도 조회 시각이 바뀌면 한 번의 조회로 센다', () => {
    const down = [cdnEdgeStatusFixture({ healthy: false })];
    const { result, rerender } = render({
      edges: [cdnEdgeStatusFixture({ healthy: true })],
      dataUpdatedAt: 1000,
    });

    rerender({ edges: down, dataUpdatedAt: 2000 });
    rerender({ edges: down, dataUpdatedAt: 2000 });
    expect(result.current?.changes).toEqual([]);

    rerender({ edges: down, dataUpdatedAt: 3000 });
    expect(result.current?.changes).toEqual([
      { id: 'edge-seoul@3000', edgeId: 'edge-seoul', healthy: false, detectedAt: 3000 },
    ]);
  });
});
