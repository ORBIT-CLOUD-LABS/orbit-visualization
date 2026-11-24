import { httpClient } from '@/shared/api/httpClient';
import { parseApiResponse } from '@/shared/api/parseApiResponse';

import { campaignRegistrationSchema, type CampaignRegistration } from './campaignSchemas';

// 서버 RegisterCampaignRequest
export type RegisterCampaignInput = {
  name: string;
  artifactId: number;
  /** 고른 파일의 버전 */
  targetVersion: string;
  target: {
    /** 고른 파일의 차종 */
    model: string;
    /** 비어 있으면 전체 */
    hwVersions: string[];
    /** 비어 있으면 전체 */
    regions: string[];
    /** null 이면 제한 없음 */
    currentVersionMin: string | null;
    currentVersionMax: string | null;
  };
  /** ISO-8601 UTC */
  startAt: string;
  endAt: string;
};

/**
 * 캠페인을 등록한다. 등록 즉시 활성 상태가 된다.
 * @throws 같은 대상 조건·파일의 활성 캠페인이 있으면 ApiError(409, ACTIVE_CAMPAIGN_EXISTS)
 */
export async function registerCampaign(
  input: RegisterCampaignInput,
): Promise<CampaignRegistration> {
  const response = await httpClient.post<unknown>('/admin/campaigns', input);
  return parseApiResponse(response.data, campaignRegistrationSchema);
}
