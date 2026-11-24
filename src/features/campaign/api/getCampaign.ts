import { httpClient } from '@/shared/api/httpClient';
import { parseApiResponse } from '@/shared/api/parseApiResponse';

import { campaignDetailSchema, type CampaignDetail } from './campaignSchemas';

/** @throws 없는 캠페인이면 ApiError(404, CAMPAIGN_NOT_FOUND) */
export async function getCampaign(
  campaignId: number,
  signal?: AbortSignal,
): Promise<CampaignDetail> {
  const response = await httpClient.get<unknown>(`/admin/campaigns/${campaignId}`, { signal });
  return parseApiResponse(response.data, campaignDetailSchema);
}
