import { httpClient } from '@/shared/api/httpClient';
import { parseApiResponse } from '@/shared/api/parseApiResponse';

import { campaignDetailSchema, type CampaignDetail } from './campaignSchemas';

/**
 * 활성 캠페인을 비활성으로 바꿔 배포를 중지한다. 이미 비활성이어도 성공한다. 다시 활성화할 수는 없다.
 * @returns 비활성화한 캠페인 상세
 * @throws 없는 캠페인이면 ApiError(404, CAMPAIGN_NOT_FOUND)
 */
export async function deactivateCampaign(campaignId: number): Promise<CampaignDetail> {
  const response = await httpClient.patch<unknown>(`/admin/campaigns/${campaignId}`, {
    status: 'INACTIVE',
  });
  return parseApiResponse(response.data, campaignDetailSchema);
}
