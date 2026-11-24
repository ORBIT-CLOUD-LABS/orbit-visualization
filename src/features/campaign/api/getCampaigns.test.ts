import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { success } from '@/mocks/apiEnvelope';
import { campaignFixtures } from '@/mocks/campaignHandlers';
import { server } from '@/mocks/server';

import { getCampaigns } from './getCampaigns';

describe('getCampaigns', () => {
  it('캠페인 목록을 검증해 돌려준다', async () => {
    await expect(getCampaigns()).resolves.toEqual(campaignFixtures);
  });

  it('모르는 상태가 오면 오류를 던진다', async () => {
    server.use(
      http.get('/api/v1/admin/campaigns', () =>
        HttpResponse.json(success({ campaigns: [{ ...campaignFixtures[0], status: 'PAUSED' }] })),
      ),
    );

    await expect(getCampaigns()).rejects.toThrow('data 형식');
  });
});
