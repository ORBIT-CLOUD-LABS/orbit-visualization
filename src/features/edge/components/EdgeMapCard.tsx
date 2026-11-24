import { useId } from 'react';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { cn } from '@/shared/lib/cn';
import type { QueryState } from '@/shared/lib/toQueryState';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';

import { EdgeMap } from './EdgeMap';

type EdgeMapCardProps = {
  edgeState: QueryState<readonly CdnEdgeStatus[]>;
  className?: string;
};

/** Edge 위치와 정상 여부, 마커 팝업의 배정 차량 수를 보여 주는 지도 카드 */
export function EdgeMapCard({ edgeState, className }: EdgeMapCardProps) {
  const headingId = useId();

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
        <Alert
          type="error"
          title="Edge 위치를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
          code={edgeState.errorCode}
          action={
            <Button variant="secondary" onClick={edgeState.onRetry}>
              다시 시도
            </Button>
          }
        />
      );
    }
    return <EdgeMap edges={edgeState.data} />;
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'flex min-w-0 flex-col gap-3 rounded-xl border border-line bg-surface p-5',
        className,
      )}
    >
      <h2 id={headingId} className="text-md font-bold text-fg">
        Edge 위치 · 배정 차량
      </h2>
      {renderBody()}
    </section>
  );
}
