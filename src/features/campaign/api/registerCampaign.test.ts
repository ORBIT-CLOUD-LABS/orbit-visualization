import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { failure, success } from '@/mocks/apiEnvelope';
import { server } from '@/mocks/server';
import { ApiError } from '@/shared/api/ApiError';

import { registerCampaign, type RegisterCampaignInput } from './registerCampaign';

const input: RegisterCampaignInput = {
  name: 'MODEL-A 1.1.0 배포',
  artifactId: 12,
  targetVersion: '1.1.0',
  target: {
    model: 'MODEL-A',
    hwVersions: ['HW1'],
    regions: [],
    currentVersionMin: '1.0.0',
    currentVersionMax: null,
  },
  startAt: '2026-10-28T00:00:00.000Z',
  endAt: '2026-11-28T00:00:00.000Z',
};

describe('registerCampaign', () => {
  it('입력값을 JSON 으로 보내고 등록한 캠페인 ID 를 돌려준다', async () => {
    let body: unknown;
    server.use(
      http.post('/api/v1/admin/campaigns', async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(success({ campaignId: 9 }, 'CREATED'), { status: 201 });
      }),
    );

    await expect(registerCampaign(input)).resolves.toEqual({ campaignId: 9 });
    expect(body).toEqual(input);
  });

  it('같은 활성 캠페인이 있으면 409 ApiError 를 던진다', async () => {
    server.use(
      http.post('/api/v1/admin/campaigns', () =>
        HttpResponse.json(failure('ACTIVE_CAMPAIGN_EXISTS'), { status: 409 }),
      ),
    );

    const error: unknown = await registerCampaign(input).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 409, code: 'ACTIVE_CAMPAIGN_EXISTS' });
  });
});
