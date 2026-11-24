import { StatCard } from '@/shared/ui/StatCard';

import type { CampaignSummary } from '../api/campaignSchemas';

type CampaignStatsProps = {
  campaigns: readonly CampaignSummary[];
};

export function CampaignStats({ campaigns }: CampaignStatsProps) {
  const activeCount = campaigns.filter(({ status }) => status === 'ACTIVE').length;
  const modelCount = new Set(campaigns.map(({ model }) => model)).size;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="전체 캠페인" value={campaigns.length} />
      <StatCard label="ACTIVE" value={activeCount} />
      <StatCard label="INACTIVE" value={campaigns.length - activeCount} />
      <StatCard label="차종" value={modelCount} />
    </div>
  );
}
