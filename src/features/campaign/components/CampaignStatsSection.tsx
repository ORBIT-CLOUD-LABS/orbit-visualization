import type { UseQueryResult } from '@tanstack/react-query';

import type { CampaignStats } from '../api/campaignSchemas';
import { CampaignProgressCard } from './CampaignProgressCard';
import { FailureReasonsCard } from './FailureReasonsCard';

type CampaignStatsSectionProps = {
  /** 상세와 함께 요청하도록 화면이 불러 넘긴다 */
  statsQuery: UseQueryResult<CampaignStats>;
};

/** 진행 현황과 실패 사유별 건수. 같은 응답 하나로 두 카드를 그린다 */
export function CampaignStatsSection({ statsQuery }: CampaignStatsSectionProps) {
  const { data: stats, isPending, isFetching, isError, refetch } = statsQuery;
  const handleRefresh = () => void refetch();

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <CampaignProgressCard
        stats={stats}
        isPending={isPending}
        isRefreshing={isFetching}
        isRefreshFailed={isError && stats !== undefined}
        onRefresh={handleRefresh}
      />
      <FailureReasonsCard stats={stats} isPending={isPending} onRetry={handleRefresh} />
    </div>
  );
}
