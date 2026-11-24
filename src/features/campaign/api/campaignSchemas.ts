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

export type CampaignStatus = z.output<typeof campaignStatusSchema>;
export type CampaignSummary = z.output<typeof campaignSummarySchema>;
