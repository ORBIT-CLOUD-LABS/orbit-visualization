import { skipToken, useQuery, type UseQueryResult } from '@tanstack/react-query';

import { campaignKeys } from '../api/campaignKeys';
import type { CampaignDetail } from '../api/campaignSchemas';
import { getCampaign } from '../api/getCampaign';

/** campaignId 가 null 이면 요청하지 않는다 */
export function useCampaign(campaignId: number | null): UseQueryResult<CampaignDetail> {
  return useQuery({
    queryKey: campaignKeys.detail(campaignId ?? 0),
    queryFn: campaignId === null ? skipToken : ({ signal }) => getCampaign(campaignId, signal),
  });
}
