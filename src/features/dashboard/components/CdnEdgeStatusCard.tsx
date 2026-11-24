import { Link } from 'react-router';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { EdgeHealthBadge } from '@/shared/cdnEdge/EdgeHealthBadge';
import { ROUTES } from '@/shared/config/routes';
import type { QueryState } from '@/shared/lib/toQueryState';
import { buttonClassName } from '@/shared/ui/buttonClassName';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadErrorAlert } from '@/shared/ui/LoadErrorAlert';
import { SkeletonRow } from '@/shared/ui/SkeletonRow';

const SKELETON_ROWS = [1, 2, 3] as const;

type CdnEdgeStatusCardProps = {
  state: QueryState<readonly CdnEdgeStatus[]>;
};

/** Edge 별 정상 여부와 배정 차량 수. 자세한 내용은 04 CDN Edge 화면으로 보낸다 */
export function CdnEdgeStatusCard({ state }: CdnEdgeStatusCardProps) {
  function renderBody() {
    if (state.status === 'pending') {
      return (
        <div aria-busy="true" className="flex flex-col gap-2">
          <p className="sr-only">CDN Edge 상태를 불러오는 중입니다</p>
          {SKELETON_ROWS.map((row) => (
            <SkeletonRow key={row} className="rounded-md bg-subtle" />
          ))}
        </div>
      );
    }
    if (state.status === 'error') {
      return (
        <LoadErrorAlert
          message="CDN Edge 상태를 불러오지 못했습니다"
          errorCode={state.errorCode}
          onRetry={state.onRetry}
        />
      );
    }
    if (state.data.length === 0) {
      return (
        <EmptyState
          title="등록된 CDN Edge가 없습니다"
          description="서버 설정에 Edge가 추가되면 여기에 표시됩니다"
        />
      );
    }
    return (
      <ul className="flex flex-col gap-3">
        {state.data.map((edge) => (
          <li
            key={edge.edgeId}
            className="flex items-center justify-between gap-2.5 rounded-md bg-subtle px-3 py-2.5"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="truncate text-sm font-medium text-fg">{edge.name}</p>
              <p className="truncate font-mono text-2xs text-fg-muted">{edge.edgeId}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <EdgeHealthBadge healthy={edge.healthy} />
              <p className="text-xs text-fg-muted">배정 {edge.assignedVehicles}대</p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Card
      title="CDN Edge 상태"
      description="Edge별 상태와 배정 차량 수"
      action={
        <Link to={ROUTES.edges} className={buttonClassName({ variant: 'ghost' })}>
          자세히
        </Link>
      }
      className="gap-3"
    >
      {renderBody()}
    </Card>
  );
}
