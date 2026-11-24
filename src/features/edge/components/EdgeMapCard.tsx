import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { cn } from '@/shared/lib/cn';
import type { QueryState } from '@/shared/lib/toQueryState';
import { MapSkeleton } from '@/shared/map/MapSkeleton';
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
      return <MapSkeleton label="Edge 위치를 불러오는 중입니다" />;
    }
    if (edgeState.status === 'error') {
      return (
        <LoadErrorAlert
          message="Edge 위치를 불러오지 못했습니다"
          errorCode={edgeState.errorCode}
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
