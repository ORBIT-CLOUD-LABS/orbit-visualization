import { useId } from 'react';

import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';
import { cn } from '@/shared/lib/cn';
import { formatClockTime } from '@/shared/lib/formatClockTime';
import type { QueryState } from '@/shared/lib/toQueryState';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { SkeletonRow } from '@/shared/ui/SkeletonRow';
import { TONE_CLASS } from '@/shared/ui/toneClass';

import { listEdgeHealthCandidates, type EdgeHealthTracker } from '../lib/trackEdgeHealth';

const SKELETON_ROWS = [1, 2] as const;
const ENTRY_CLASS = 'flex items-center gap-2.5 rounded-md px-3.5 py-3';

function healthLabel(healthy: boolean): string {
  return healthy ? '정상' : '장애';
}

function transitionLabel(healthy: boolean): string {
  return `${healthLabel(!healthy)} → ${healthLabel(healthy)}`;
}

type EdgeHealthChangeCardProps = {
  /** Edge 상태 조회 결과. 처음 불러오는 중·실패를 카드 안에 보여 준다 */
  edgeState: QueryState<readonly CdnEdgeStatus[]>;
  /** 화면에서 감지한 변화. 아직 받은 값이 없으면 null */
  tracker: EdgeHealthTracker | null;
  className?: string;
};

/** 다시 조회할 때 감지한 Edge 장애·복구 기록. 화면 메모리에만 두므로 화면을 떠나면 사라진다 */
export function EdgeHealthChangeCard({ edgeState, tracker, className }: EdgeHealthChangeCardProps) {
  const headingId = useId();

  function renderBody() {
    if (edgeState.status === 'pending') {
      return (
        <div aria-busy="true" className="flex flex-col divide-y divide-line">
          <p className="sr-only">상태 변화를 불러오는 중입니다</p>
          {SKELETON_ROWS.map((row) => (
            <SkeletonRow key={row} />
          ))}
        </div>
      );
    }
    if (edgeState.status === 'error') {
      return (
        <Alert
          type="error"
          title="Edge 상태를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
          code={edgeState.errorCode}
          action={
            <Button variant="secondary" onClick={edgeState.onRetry}>
              다시 시도
            </Button>
          }
        />
      );
    }
    const changes = tracker?.changes ?? [];
    const candidates = tracker === null ? [] : listEdgeHealthCandidates(tracker);
    if (changes.length === 0 && candidates.length === 0) {
      return (
        <p className="rounded-md bg-subtle px-3.5 py-6 text-center text-xs text-fg-muted">
          감지된 상태 변화가 없습니다
        </p>
      );
    }
    return (
      <div className="flex flex-col gap-3">
        {candidates.length > 0 && (
          <ul aria-label="확인 중인 변화" className="flex flex-col gap-3">
            {candidates.map(({ edgeId, healthy }) => (
              <li key={edgeId} className={cn(ENTRY_CLASS, TONE_CLASS.warning.surface)}>
                <span
                  aria-hidden="true"
                  className={cn('size-2 shrink-0 rounded-full', TONE_CLASS.warning.dot)}
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="text-sm font-medium break-all">
                    {edgeId} {healthLabel(healthy)} 확인 중
                  </p>
                  <p className="text-2xs">다음 조회에서도 같으면 기록합니다</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {changes.length > 0 && (
          <ol aria-label="감지한 변화" className="flex flex-col gap-3">
            {changes.map(({ id, edgeId, healthy, detectedAt }) => {
              const tone = TONE_CLASS[healthy ? 'info' : 'danger'];
              return (
                <li key={id} className={cn(ENTRY_CLASS, tone.surface)}>
                  <span
                    aria-hidden="true"
                    className={cn('size-2 shrink-0 rounded-full', tone.dot)}
                  />
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="text-sm font-medium break-all">
                      {edgeId} {healthy ? '복구' : '장애'} 감지 ({formatClockTime(detectedAt)})
                    </p>
                    <p className="font-mono text-2xs">{transitionLabel(healthy)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    );
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'flex min-w-0 flex-col gap-3 rounded-xl border border-line bg-surface p-5',
        className,
      )}
    >
      <div className="flex flex-col gap-0.5">
        <h2 id={headingId} className="text-md font-bold text-fg">
          상태 변화 (화면 감지)
        </h2>
        <p className="text-xs text-fg-muted">
          이 화면에서 감지한 변화만 보여 주며, 화면을 떠나면 기록이 사라집니다
        </p>
      </div>
      {renderBody()}
    </section>
  );
}
