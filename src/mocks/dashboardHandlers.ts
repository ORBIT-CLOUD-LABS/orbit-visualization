import { http, HttpResponse, type RequestHandler } from 'msw';

import type { CdnEdgeStatus } from '@/features/dashboard/api/cdnEdgeSchema';
import type { VehicleStatus } from '@/features/dashboard/api/vehicleStatusSchema';

import { success } from './apiEnvelope';

export const DASHBOARD_VEHICLES_URL = '/api/v1/dashboard/vehicles';
export const DASHBOARD_VEHICLES_STREAM_URL = '/api/v1/dashboard/vehicles/stream';
export const DASHBOARD_CDN_EDGES_URL = '/api/v1/dashboard/cdn-edges';

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

/** 테스트용 차량 상태. 필요한 필드만 덮어쓴다 */
export function vehicleStatusFixture(overrides: Partial<VehicleStatus> = {}): VehicleStatus {
  return {
    vehicleId: 'VH-0001',
    model: 'MODEL-A',
    currentVersion: '1.0.0',
    lastSeenAt: '2026-11-24T01:00:30.000Z',
    updatedAt: '2026-11-24T01:00:30.000Z',
    campaignId: 7,
    lastResult: 'SUCCEEDED',
    failureReason: null,
    location: null,
    assignedEdgeId: 'edge-seoul',
    downloadedEdgeId: 'edge-seoul',
    ...overrides,
  };
}

/** 공통 응답 형식으로 감싼 스냅샷 응답 */
export function vehicleSnapshotResponse(vehicles: VehicleStatus[]) {
  return HttpResponse.json(success({ asOf: '2026-11-24T01:00:31.000Z', vehicles }));
}

// 서버처럼 keep-alive 주석만 보내고 연결을 열어 둔다. 본문이 비어 있으면 MSW 가 응답을 넘기지 않는다
function openEventStream() {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(': keep-alive\n\n'));
    },
  });
  return new HttpResponse(body, { headers: { 'Content-Type': 'text/event-stream' } });
}

export const dashboardHandlers: RequestHandler[] = [
  http.get(DASHBOARD_VEHICLES_URL, () => vehicleSnapshotResponse([vehicleStatusFixture()])),
  http.get(DASHBOARD_VEHICLES_STREAM_URL, () => openEventStream()),
  http.get(DASHBOARD_CDN_EDGES_URL, () => cdnEdgesResponse([cdnEdgeStatusFixture()])),
];
