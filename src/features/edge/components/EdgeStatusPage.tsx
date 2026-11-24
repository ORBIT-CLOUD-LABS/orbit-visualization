import { useMemo } from 'react';

import { ApiError } from '@/shared/api/ApiError';
import { useCdnEdges } from '@/shared/cdnEdge/useCdnEdges';
import { formatClockTime } from '@/shared/lib/formatClockTime';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { Topbar } from '@/shared/ui/Topbar';

import { summarizeEdges } from '../lib/summarizeEdges';

import { EdgeCardList } from './EdgeCardList';
import { EdgeStatCards } from './EdgeStatCards';

// 버튼을 여러 번 눌러도 진행 중인 요청을 취소하고 다시 보내지 않는다
const KEEP_IN_FLIGHT = { cancelRefetch: false } as const;

/** 04 CDN Edge 현황. 30초마다 다시 조회하고, 새로고침 버튼으로 바로 다시 불러온다 */
export function EdgeStatusPage() {
  const query = useCdnEdges();
  const edges = query.data;
  const summary = useMemo(() => (edges === undefined ? null : summarizeEdges(edges)), [edges]);
  const lastUpdated = formatClockTime(query.dataUpdatedAt === 0 ? null : query.dataUpdatedAt);
  // 이미 받은 값이 있으면 그대로 두고, 새로고침이 실패했다는 것만 알린다
  const isRefreshFailed = query.isError && edges !== undefined;
  const errorCode = query.error instanceof ApiError ? query.error.code : undefined;

  function handleRefresh() {
    void query.refetch(KEEP_IN_FLIGHT);
  }

  return (
    <>
      <Topbar
        title="CDN Edge 현황"
        subtitle="정상·장애는 요청을 받은 서버가 확인한 결과라 서버마다 잠시 다르게 보일 수 있습니다"
        right={
          <>
            <p className="text-xs text-fg-muted">
              마지막 갱신 <span className="font-mono">{lastUpdated ?? '—'}</span>
            </p>
            <Button variant="secondary" disabled={query.isFetching} onClick={handleRefresh}>
              새로고침
            </Button>
          </>
        }
      />
      <div className="flex flex-col gap-6 p-8">
        {isRefreshFailed && (
          <Alert
            type="error"
            title="최신 Edge 상태를 불러오지 못했습니다. 이전에 받은 정보를 보여 줍니다."
            code={errorCode}
            action={
              <Button variant="secondary" disabled={query.isFetching} onClick={handleRefresh}>
                다시 시도
              </Button>
            }
          />
        )}
        <EdgeStatCards summary={summary} />
        <EdgeCardList
          edges={edges}
          isPending={query.isPending}
          isFetching={query.isFetching}
          errorCode={errorCode}
          onRetry={handleRefresh}
        />
      </div>
    </>
  );
}
