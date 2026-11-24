import { z } from 'zod';

import { httpClient } from '@/shared/api/httpClient';
import { parseApiResponse } from '@/shared/api/parseApiResponse';

// 파일 상세에 필요한 캠페인 필드만 검증한다. 캠페인 기능을 가져오지 않으려고 따로 둔다
const campaignSchema = z.object({
  campaignId: z.number().int(),
  name: z.string(),
  model: z.string(),
  targetVersion: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  startAt: z.iso.datetime(),
  endAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});

const campaignListSchema = z.object({
  campaigns: z.array(campaignSchema),
});

export type ArtifactCampaign = z.output<typeof campaignSchema>;

/** 이 차종을 대상으로 하는 캠페인 전체. 최근 등록한 순서다 */
export async function getModelCampaigns(
  model: string,
  signal?: AbortSignal,
): Promise<ArtifactCampaign[]> {
  const response = await httpClient.get<unknown>('/admin/campaigns', {
    params: { model },
    signal,
  });
  return parseApiResponse(response.data, campaignListSchema).campaigns;
}
