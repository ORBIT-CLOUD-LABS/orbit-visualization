import { useId } from 'react';
import { Link } from 'react-router';

import { ROUTES } from '@/shared/config/routes';
import { Alert } from '@/shared/ui/Alert';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { buttonClassName } from '@/shared/ui/buttonClassName';
import { EmptyState } from '@/shared/ui/EmptyState';
import { SkeletonRow } from '@/shared/ui/SkeletonRow';

import type { CdnEdgeStatus } from '../api/cdnEdgeSchema';
import type { QueryState } from '../lib/toQueryState';

const SKELETON_ROWS = [1, 2, 3] as const;

type CdnEdgeStatusCardProps = {
  state: QueryState<readonly CdnEdgeStatus[]>;
};

/** Edge 별 정상 여부와 배정 차량 수. 자세한 내용은 04 CDN Edge 화면으로 보낸다 */
export function CdnEdgeStatusCard({ state }: CdnEdgeStatusCardProps) {
  const headingId = useId();

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
        <Alert
          type="error"
          title="CDN Edge 상태를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
          code={state.errorCode}
          action={
            <Button variant="secondary" onClick={state.onRetry}>
              다시 시도
            </Button>
          }
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
              <Badge tone={edge.healthy ? 'healthy' : 'unhealthy'}>
                {edge.healthy ? '정상' : '장애'}
              </Badge>
              <p className="text-xs text-fg-muted">배정 {edge.assignedVehicles}대</p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 id={headingId} className="text-md font-bold text-fg">
            CDN Edge 상태
          </h2>
          <p className="text-xs text-fg-muted">Edge별 상태와 배정 차량 수</p>
        </div>
        <Link to={ROUTES.edges} className={buttonClassName({ variant: 'ghost' })}>
          자세히
        </Link>
      </div>
      {renderBody()}
    </section>
  );
}
