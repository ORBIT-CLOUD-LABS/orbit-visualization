import { http, HttpResponse, type RequestHandler } from 'msw';

import type { VehicleDetail, VehicleUpdateEvent } from '@/features/vehicle/api/vehicleSchemas';

import { failure, success } from './apiEnvelope';

export const VEHICLE_DETAIL_URL = '/api/v1/dashboard/vehicles/:vehicleId';
export const VEHICLE_EVENTS_URL = '/api/v1/dashboard/vehicles/:vehicleId/events';

/** 테스트용 차량 상세. 필요한 필드만 덮어쓴다 */
export function vehicleDetailFixture(overrides: Partial<VehicleDetail> = {}): VehicleDetail {
  return {
    vehicleId: 'VH-0001',
    model: 'MODEL-A',
    hwVersion: 'HW1',
    region: 'KR',
    currentVersion: '1.0.0',
    lastSeenAt: '2026-10-28T01:00:30.000Z',
    updatedAt: '2026-10-28T01:00:30.000Z',
    location: { latitude: 37.52, longitude: 126.9, updatedAt: '2026-10-28T01:00:30.000Z' },
    assignedEdgeId: 'edge-seoul',
    lastUpdate: {
      campaignId: 7,
      result: 'FAILED',
      failureReason: 'SIGNATURE_INVALID',
      failureDetail: 'unknown keyId: v2',
      edgeId: 'edge-seoul',
      finishedAt: '2026-10-28T01:00:00.000Z',
    },
    ...overrides,
  };
}

/** 테스트용 업데이트 시도. 필요한 필드만 덮어쓴다 */
export function vehicleUpdateEventFixture(
  overrides: Partial<VehicleUpdateEvent> = {},
): VehicleUpdateEvent {
  return {
    campaignId: 7,
    version: '1.1.0',
    result: 'FAILED',
    failureReason: 'SIGNATURE_INVALID',
    failureDetail: 'unknown keyId: v2',
    edgeId: 'edge-seoul',
    finishedAt: '2026-10-28T01:00:00.000Z',
    ...overrides,
  };
}

/** 기본 핸들러는 VH-0001 만 있고 나머지는 없는 차량으로 응답한다 */
export const vehicleHandlers: RequestHandler[] = [
  http.get(VEHICLE_EVENTS_URL, ({ params }) => {
    if (params.vehicleId !== 'VH-0001') {
      return HttpResponse.json(failure('VEHICLE_NOT_FOUND'), { status: 404 });
    }
    return HttpResponse.json(success({ events: [vehicleUpdateEventFixture()] }));
  }),
  http.get(VEHICLE_DETAIL_URL, ({ params }) => {
    if (params.vehicleId !== 'VH-0001') {
      return HttpResponse.json(failure('VEHICLE_NOT_FOUND'), { status: 404 });
    }
    return HttpResponse.json(success(vehicleDetailFixture()));
  }),
];
