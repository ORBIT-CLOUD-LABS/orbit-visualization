import { edgeHealthLabel } from '@/shared/cdnEdge/edgeHealthLabel';
import { cn } from '@/shared/lib/cn';
import { formatClockTime } from '@/shared/lib/formatClockTime';
import { Card } from '@/shared/ui/Card';
import { LoadingRows } from '@/shared/ui/LoadingRows';

import type { EdgeHealthTracker } from '../lib/trackEdgeHealth';

import { EdgeHealthEntry } from './EdgeHealthEntry';

const SKELETON_ROW_COUNT = 2;
const EMPTY_CLASS = 'rounded-md bg-subtle px-3.5 py-6 text-center text-xs text-fg-muted';

type EdgeHealthChangeCardProps = {
  /** 화면에서 감지한 변화. 아직 받은 값이 없으면 null */
  tracker: EdgeHealthTracker | null;
  /** Edge 상태를 처음 불러오는 중이면 true */
  isPending: boolean;
  className?: string;
};

/**
 * 다시 조회할 때 감지한 Edge 장애·복구 기록. 화면 메모리에만 두므로 화면을 떠나면 사라진다.
 * 불러오기 실패는 같은 조회를 쓰는 지도·Edge 목록 카드가 알리므로 여기서는 기록이 없다고만 보여 준다
 */
export function EdgeHealthChangeCard({ tracker, isPending, className }: EdgeHealthChangeCardProps) {
  function renderBody() {
    if (isPending) {
      return (
        <LoadingRows
          label="상태 변화를 불러오는 중입니다"
          rows={SKELETON_ROW_COUNT}
          variant="divided"
        />
      );
    }
    if (tracker === null) {
      return <p className={EMPTY_CLASS}>Edge 상태를 받은 뒤부터 변화를 기록합니다</p>;
    }
    const candidates = [...tracker.candidates.values()];
    const { changes } = tracker;
    if (changes.length === 0 && candidates.length === 0) {
      return <p className={EMPTY_CLASS}>감지된 상태 변화가 없습니다</p>;
    }
    return (
      <div className="flex flex-col gap-3">
        {candidates.length > 0 && (
          <ul aria-label="확인 중인 변화" className="flex flex-col gap-3">
            {candidates.map(({ edgeId, healthy }) => (
              <EdgeHealthEntry
                key={edgeId}
                tone="warning"
                title={`${edgeId} ${edgeHealthLabel(healthy)} 확인 중`}
                detail="다음 조회에서도 같으면 기록합니다"
              />
            ))}
          </ul>
        )}
        {changes.length > 0 && (
          <ol aria-label="감지한 변화" className="flex flex-col gap-3">
            {changes.map(({ edgeId, healthy, detectedAt }) => (
              <EdgeHealthEntry
                key={`${edgeId}@${detectedAt}`}
                tone={healthy ? 'info' : 'danger'}
                title={`${edgeId} ${healthy ? '복구' : '장애'} 감지 (${formatClockTime(detectedAt)})`}
                detail={`${edgeHealthLabel(!healthy)} → ${edgeHealthLabel(healthy)}`}
                isMonoDetail
              />
            ))}
          </ol>
        )}
      </div>
    );
  }

  return (
    <Card
      title="상태 변화 (화면 감지)"
      description="이 화면에서 감지한 변화만 보여 주며, 화면을 떠나면 기록이 사라집니다"
      className={cn('min-w-0 gap-3', className)}
    >
      {renderBody()}
    </Card>
  );
}
