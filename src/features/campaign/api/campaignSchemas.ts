import { z } from 'zod';

export const CAMPAIGN_STATUSES = ['ACTIVE', 'INACTIVE'] as const;

const campaignStatusSchema = z.enum(CAMPAIGN_STATUSES);

// 서버 CampaignSummaryResponse. 목록 한 항목
export const campaignSummarySchema = z.object({
  campaignId: z.number().int(),
  name: z.string(),
  model: z.string(),
  targetVersion: z.string(),
  status: campaignStatusSchema,
  startAt: z.iso.datetime(),
  endAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});

export const campaignListSchema = z.object({
  campaigns: z.array(campaignSummarySchema),
});

// 서버 CampaignDetailResponse. 비활성 캠페인도 같은 모양이다
export const campaignDetailSchema = z.object({
  campaignId: z.number().int(),
  name: z.string(),
  artifactId: z.number().int(),
  targetVersion: z.string(),
  target: z.object({
    model: z.string(),
    /** 비어 있으면 전체 */
    hwVersions: z.array(z.string()),
    /** 비어 있으면 전체 */
    regions: z.array(z.string()),
    /** null 이면 제한 없음 */
    currentVersionMin: z.string().nullable(),
    currentVersionMax: z.string().nullable(),
  }),
  status: campaignStatusSchema,
  startAt: z.iso.datetime(),
  endAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});

const countSchema = z.number().int().nonnegative();

// 서버 CampaignStatsResponse. inProgress = targetVehicles - succeeded - failed (대상인데 결과를 보고하지 않은 차량)
export const campaignStatsSchema = z.object({
  campaignId: z.number().int(),
  targetVehicles: countSchema,
  succeeded: countSchema,
  failed: countSchema,
  // 사유 목록이 서버에서 늘어나도 화면이 깨지지 않도록 키는 문자열로 받는다
  failureReasons: z.record(z.string(), countSchema),
  inProgress: countSchema,
});

// 서버 CampaignRegistrationResponse
export const campaignRegistrationSchema = z.object({
  campaignId: z.number().int(),
});

// 서버 ArtifactSummaryResponse 중 배포할 파일을 고르는 데 쓰는 필드. 파일 기능을 가져오지 않으려고 따로 둔다
export const artifactOptionSchema = z.object({
  artifactId: z.number().int(),
  model: z.string(),
  version: z.string(),
  keyId: z.string(),
});

export const artifactOptionListSchema = z.object({
  artifacts: z.array(artifactOptionSchema),
});

export type CampaignStatus = z.output<typeof campaignStatusSchema>;
export type CampaignSummary = z.output<typeof campaignSummarySchema>;
export type CampaignDetail = z.output<typeof campaignDetailSchema>;
export type CampaignStats = z.output<typeof campaignStatsSchema>;
export type CampaignRegistration = z.output<typeof campaignRegistrationSchema>;
export type ArtifactOption = z.output<typeof artifactOptionSchema>;
