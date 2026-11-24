import { http, HttpResponse, type RequestHandler } from 'msw';

import type { CdnEdgeStatus } from '@/features/dashboard/api/cdnEdgeSchema';

import { success } from './apiEnvelope';

export const CDN_EDGES_URL = '/api/v1/dashboard/cdn-edges';

/** 테스트용 CDN Edge 상태. 필요한 필드만 덮어쓴다 */
export function cdnEdgeStatusFixture(overrides: Partial<CdnEdgeStatus> = {}): CdnEdgeStatus {
  return {
    edgeId: 'edge-seoul',
    name: '서울',
    latitude: 37.5665,
    longitude: 126.978,
    healthy: true,
    assignedVehicles: 1,
    downloads: [{ campaignId: 7, succeeded: 1, failed: 0 }],
    ...overrides,
  };
}

/** 공통 응답 형식으로 감싼 CDN Edge 상태 응답 */
export function cdnEdgesResponse(edges: CdnEdgeStatus[]) {
  return HttpResponse.json(success({ edges }));
}

export const cdnEdgeHandlers: RequestHandler[] = [
  http.get(CDN_EDGES_URL, () => cdnEdgesResponse([cdnEdgeStatusFixture()])),
];
