import { httpClient } from '@/shared/api/httpClient';
import { parseApiResponse } from '@/shared/api/parseApiResponse';

import { campaignStatsSchema, type CampaignStats } from './campaignSchemas';

/** 캠페인 진행 현황. @throws 없는 캠페인이면 ApiError(404, CAMPAIGN_NOT_FOUND) */
export async function getCampaignStats(
  campaignId: number,
  signal?: AbortSignal,
): Promise<CampaignStats> {
  const response = await httpClient.get<unknown>(`/admin/campaigns/${campaignId}/stats`, {
    signal,
  });
  return parseApiResponse(response.data, campaignStatsSchema);
}
