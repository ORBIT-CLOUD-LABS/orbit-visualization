import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadErrorAlert } from '@/shared/ui/LoadErrorAlert';
import { LoadingRows } from '@/shared/ui/LoadingRows';

import { EdgeCard } from './EdgeCard';

const FALLBACK_CLASS = 'rounded-xl border border-line bg-surface p-5';

type EdgeCardListProps = {
  /** 아직 받지 못했으면 undefined */
  edges: readonly CdnEdgeStatus[] | undefined;
  isPending: boolean;
  /** 다시 불러오는 중이면 다시 시도 버튼을 막는다 */
  isFetching: boolean;
  /** 서버 응답 code. 없으면 생략 */
  errorCode?: string;
  onRetry: () => void;
};

/** Edge 마다 카드 하나. 처음 불러오는 중·실패·Edge 없음은 카드 자리에 안내를 둔다 */
export function EdgeCardList({
  edges,
  isPending,
  isFetching,
  errorCode,
  onRetry,
}: EdgeCardListProps) {
  function renderBody() {
    if (isPending) {
      return (
        <div className={FALLBACK_CLASS}>
          <LoadingRows label="CDN Edge 상태를 불러오는 중입니다" variant="divided" />
        </div>
      );
    }
    if (edges === undefined) {
      return (
        <div className={FALLBACK_CLASS}>
          <LoadErrorAlert
            message="Edge 상태를 불러오지 못했습니다"
            code={errorCode}
            onRetry={onRetry}
            isRetrying={isFetching}
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
