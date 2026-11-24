import { httpClient } from '@/shared/api/httpClient';
import { parseApiResponse } from '@/shared/api/parseApiResponse';

import { campaignListSchema, type CampaignSummary } from './campaignSchemas';

/** 등록한 캠페인 전체. 최근 등록한 순서다. 상태·차종은 화면에서 거른다 */
export async function getCampaigns(signal?: AbortSignal): Promise<CampaignSummary[]> {
  const response = await httpClient.get<unknown>('/admin/campaigns', { signal });
  return parseApiResponse(response.data, campaignListSchema).campaigns;
}
