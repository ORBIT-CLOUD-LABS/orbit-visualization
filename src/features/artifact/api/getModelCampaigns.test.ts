import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { success } from '@/mocks/apiEnvelope';
import { server } from '@/mocks/server';

import { getModelCampaigns } from './getModelCampaigns';

describe('getModelCampaigns', () => {
  it('차종으로 걸러 캠페인 목록을 받는다', async () => {
    let model: string | null = null;
    server.use(
      http.get('/api/v1/admin/campaigns', ({ request }) => {
        model = new URL(request.url).searchParams.get('model');
        return HttpResponse.json(success({ campaigns: [] }));
      }),
    );

    await expect(getModelCampaigns('MODEL-A')).resolves.toEqual([]);
    expect(model).toBe('MODEL-A');
  });
});
