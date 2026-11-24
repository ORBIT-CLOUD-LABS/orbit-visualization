import { useCampaignStats } from '../hooks/useCampaignStats';
import { CampaignProgressCard } from './CampaignProgressCard';
import { FailureReasonsCard } from './FailureReasonsCard';

type CampaignStatsSectionProps = {
  campaignId: number;
};

/** 진행 현황과 실패 사유별 건수. 같은 응답 하나로 두 카드를 그린다 */
export function CampaignStatsSection({ campaignId }: CampaignStatsSectionProps) {
  const { data: stats, isPending, isFetching, isError, refetch } = useCampaignStats(campaignId);
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
