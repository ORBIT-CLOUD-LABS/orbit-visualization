import { http, HttpResponse, type RequestHandler } from 'msw';

import { success } from './apiEnvelope';

const CAMPAIGNS_PATH = '/api/v1/admin/campaigns';

export const campaignFixtures = [
  {
    campaignId: 7,
    name: 'MODEL-A 1.1.0 배포',
    model: 'MODEL-A',
    targetVersion: '1.1.0',
    status: 'ACTIVE',
    startAt: '2026-10-28T00:00:00Z',
    endAt: '2026-11-28T00:00:00Z',
    createdAt: '2026-10-27T09:00:00Z',
  },
  {
    campaignId: 5,
    name: 'MODEL-B 2.0.1 배포',
    model: 'MODEL-B',
    targetVersion: '2.0.1',
    status: 'INACTIVE',
    startAt: '2026-10-01T00:00:00Z',
    endAt: '2026-10-15T00:00:00Z',
    createdAt: '2026-09-30T09:00:00Z',
  },
];

export const campaignHandlers: RequestHandler[] = [
  http.get(CAMPAIGNS_PATH, () => HttpResponse.json(success({ campaigns: campaignFixtures }))),
];
