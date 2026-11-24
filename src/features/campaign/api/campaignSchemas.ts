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
export type CampaignRegistration = z.output<typeof campaignRegistrationSchema>;
export type ArtifactOption = z.output<typeof artifactOptionSchema>;
