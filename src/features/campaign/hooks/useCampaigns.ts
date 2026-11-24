import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { campaignKeys } from '../api/campaignKeys';
import type { CampaignSummary } from '../api/campaignSchemas';
import { getCampaigns } from '../api/getCampaigns';

export function useCampaigns(): UseQueryResult<CampaignSummary[]> {
  return useQuery({
    queryKey: campaignKeys.list(),
    queryFn: ({ signal }) => getCampaigns(signal),
  });
}
