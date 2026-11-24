import { useId } from 'react';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { Badge } from '@/shared/ui/Badge';

import { formatCoordinate } from '../lib/formatCoordinate';

import { EdgeDownloadTable } from './EdgeDownloadTable';

type EdgeCardProps = {
  edge: CdnEdgeStatus;
};

/** Edge 하나의 정상 여부·대표 좌표·배정 차량 수와 캠페인별 다운로드 결과 */
export function EdgeCard({ edge }: EdgeCardProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="flex min-w-0 flex-col gap-3.5 rounded-xl border border-line bg-surface p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 id={titleId} className="truncate text-md font-bold text-fg">
            {edge.name}
          </h2>
          <p className="truncate font-mono text-2xs text-fg-muted">{edge.edgeId}</p>
        </div>
        <Badge tone={edge.healthy ? 'healthy' : 'unhealthy'} className="shrink-0">
          {edge.healthy ? '정상' : '장애'}
        </Badge>
      </div>
      <dl className="grid grid-cols-2 gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <dt className="text-xs text-fg-muted">좌표</dt>
          <dd className="font-mono text-xs break-all text-fg">
            {formatCoordinate(edge.latitude, edge.longitude)}
          </dd>
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <dt className="text-xs text-fg-muted">배정 차량</dt>
          <dd className="text-sm font-medium text-fg">{edge.assignedVehicles}대</dd>
        </div>
      </dl>
      <p className="text-xs font-medium text-fg-muted">캠페인별 다운로드</p>
      <EdgeDownloadTable label={`${edge.name} 캠페인별 다운로드`} downloads={edge.downloads} />
    </section>
  );
}
