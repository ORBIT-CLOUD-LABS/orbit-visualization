import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { StatCard } from '@/shared/ui/StatCard';

import type { CampaignStats } from '../api/campaignSchemas';
import { resultRatios } from '../lib/resultRatios';
import { QueryFallback } from './QueryFallback';
import { ResultBar } from './ResultBar';

type CampaignProgressCardProps = {
  /** 아직 받지 못했으면 undefined */
  stats: CampaignStats | undefined;
  isPending: boolean;
  isRefreshing: boolean;
  /** 이미 받은 값이 있는데 다시 불러오기에 실패했다 */
  isRefreshFailed: boolean;
  onRefresh: () => void;
};

export function CampaignProgressCard({
  stats,
  isPending,
  isRefreshing,
  isRefreshFailed,
  onRefresh,
}: CampaignProgressCardProps) {
  function renderContent() {
    if (stats === undefined) {
      return <QueryFallback isPending={isPending} onRetry={onRefresh} />;
    }
    return (
      <>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="대상 차량" value={stats.targetVehicles} />
          <StatCard label="성공" value={stats.succeeded} />
          <StatCard label="실패" value={stats.failed} />
          {/* 서버 inProgress 는 대상인데 결과를 보고하지 않은 차량이다 */}
          <StatCard label="대기·미보고" value={stats.inProgress} />
        </div>
        <ResultBar ratios={resultRatios(stats)} />
        {isRefreshFailed && (
          <Alert type="error" title="새로고침하지 못했습니다. 잠시 후 다시 시도해 주세요." />
        )}
        <ul className="flex flex-col gap-1 rounded-md bg-subtle p-3 text-xs text-fg-muted">
          <li>
            · 대기·미보고: 대상 차량 중 아직 업데이트 결과를 보고하지 않은 차량 (다운로드·설치
            중이거나 체크인 전)
          </li>
          <li>· 비율은 대상 차량 수 기준이며, 새로고침을 누르면 다시 조회합니다</li>
        </ul>
      </>
    );
  }

  return (
    <Card
      title="진행 현황"
      className="flex-1"
      action={
        <Button variant="ghost" disabled={isRefreshing} onClick={onRefresh}>
          {isRefreshing ? '새로고침 중…' : '새로고침'}
        </Button>
      }
    >
      {renderContent()}
    </Card>
  );
}
