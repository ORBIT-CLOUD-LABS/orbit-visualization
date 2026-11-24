import { skipToken, useQuery, type UseQueryResult } from '@tanstack/react-query';

import { campaignKeys } from '../api/campaignKeys';
import type { CampaignStats } from '../api/campaignSchemas';
import { getCampaignStats } from '../api/getCampaignStats';

/** campaignId 가 null 이면 요청하지 않는다. 화면의 새로고침 버튼으로 다시 불러온다 */
export function useCampaignStats(campaignId: number | null): UseQueryResult<CampaignStats> {
  return useQuery({
    queryKey: campaignKeys.stats(campaignId ?? 0),
    queryFn: campaignId === null ? skipToken : ({ signal }) => getCampaignStats(campaignId, signal),
  });
}
