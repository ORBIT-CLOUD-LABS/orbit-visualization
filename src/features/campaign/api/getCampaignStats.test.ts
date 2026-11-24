import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { success } from '@/mocks/apiEnvelope';
import { campaignStatsFixture } from '@/mocks/campaignHandlers';
import { server } from '@/mocks/server';

import { getCampaignStats } from './getCampaignStats';

describe('getCampaignStats', () => {
  it('진행 현황을 검증해 돌려준다', async () => {
    await expect(getCampaignStats(7)).resolves.toEqual(campaignStatsFixture);
  });

  it('처음 보는 실패 사유도 받는다', async () => {
    server.use(
      http.get('/api/v1/admin/campaigns/7/stats', () =>
        HttpResponse.json(success({ ...campaignStatsFixture, failureReasons: { NEW_REASON: 3 } })),
      ),
    );

    await expect(getCampaignStats(7)).resolves.toMatchObject({
      failureReasons: { NEW_REASON: 3 },
    });
  });

  it('없는 캠페인이면 404 오류를 던진다', async () => {
    await expect(getCampaignStats(999)).rejects.toMatchObject({
      status: 404,
      code: 'CAMPAIGN_NOT_FOUND',
    });
  });
});
