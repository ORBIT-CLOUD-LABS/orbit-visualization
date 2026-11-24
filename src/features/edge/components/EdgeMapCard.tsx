import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { cn } from '@/shared/lib/cn';
import type { QueryState } from '@/shared/lib/toQueryState';
import { Card } from '@/shared/ui/Card';
import { LoadErrorAlert } from '@/shared/ui/LoadErrorAlert';

import { EdgeMap } from './EdgeMap';

type EdgeMapCardProps = {
  edgeState: QueryState<readonly CdnEdgeStatus[]>;
  className?: string;
};

/** Edge 위치와 정상 여부, 마커 팝업의 배정 차량 수를 보여 주는 지도 카드 */
export function EdgeMapCard({ edgeState, className }: EdgeMapCardProps) {
  function renderBody() {
    if (edgeState.status === 'pending') {
      return (
        <div aria-busy="true" className="min-h-52.5 flex-1 animate-pulse rounded-lg bg-map">
          <p className="sr-only">Edge 위치를 불러오는 중입니다</p>
        </div>
      );
    }
    if (edgeState.status === 'error') {
      return (
        <LoadErrorAlert
          message="Edge 위치를 불러오지 못했습니다"
          code={edgeState.errorCode}
          onRetry={edgeState.onRetry}
        />
      );
    }
    return <EdgeMap edges={edgeState.data} />;
  }

  return (
    <Card title="Edge 위치 · 배정 차량" className={cn('min-w-0 gap-3', className)}>
      {renderBody()}
    </Card>
  );
}
