import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { SkeletonRow } from '@/shared/ui/SkeletonRow';

import { EdgeCard } from './EdgeCard';

const SKELETON_ROWS = [1, 2, 3] as const;
const FALLBACK_CLASS = 'rounded-xl border border-line bg-surface p-5';

type EdgeCardListProps = {
  /** 아직 받지 못했으면 undefined */
  edges: readonly CdnEdgeStatus[] | undefined;
  isPending: boolean;
  /** 서버 응답 code. 없으면 생략 */
  errorCode?: string;
  onRetry: () => void;
};

/** Edge 마다 카드 하나. 처음 불러오는 중·실패·Edge 없음은 카드 자리에 안내를 둔다 */
export function EdgeCardList({ edges, isPending, errorCode, onRetry }: EdgeCardListProps) {
  function renderBody() {
    if (edges === undefined && isPending) {
      return (
        <div aria-busy="true" className={FALLBACK_CLASS}>
          <p className="sr-only">CDN Edge 상태를 불러오는 중입니다</p>
          <div className="flex flex-col divide-y divide-line">
            {SKELETON_ROWS.map((row) => (
              <SkeletonRow key={row} />
            ))}
          </div>
        </div>
      );
    }
    if (edges === undefined) {
      return (
        <div className={FALLBACK_CLASS}>
          <Alert
            type="error"
            title="Edge 상태를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
            code={errorCode}
            action={
              <Button variant="secondary" onClick={onRetry}>
                다시 시도
              </Button>
            }
          />
        </div>
      );
    }
    if (edges.length === 0) {
      return (
        <EmptyState
          title="등록된 CDN Edge가 없습니다"
          description="서버 설정에 Edge가 추가되면 여기에 표시됩니다"
          className="border border-line"
        />
      );
    }
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {edges.map((edge) => (
          <EdgeCard key={edge.edgeId} edge={edge} />
        ))}
      </div>
    );
  }

  return <section aria-label="Edge 목록">{renderBody()}</section>;
}
