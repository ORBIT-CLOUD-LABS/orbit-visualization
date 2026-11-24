import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { success } from '@/mocks/apiEnvelope';
import {
  DASHBOARD_VEHICLES_URL,
  vehicleSnapshotResponse,
  vehicleStatusFixture,
} from '@/mocks/dashboardHandlers';
import { server } from '@/mocks/server';

import { getVehicleStatusSnapshot } from './getVehicleStatusSnapshot';

describe('getVehicleStatusSnapshot', () => {
  it('스냅샷을 검증해 돌려준다', async () => {
    const vehicle = vehicleStatusFixture({
      lastResult: null,
      campaignId: null,
      location: { latitude: 37.5, longitude: 127, updatedAt: '2026-11-24T01:00:00.000Z' },
    });
    server.use(http.get(DASHBOARD_VEHICLES_URL, () => vehicleSnapshotResponse([vehicle])));

    await expect(getVehicleStatusSnapshot()).resolves.toEqual({
      asOf: '2026-11-24T01:00:31.000Z',
      vehicles: [vehicle],
    });
  });

  it('알 수 없는 결과 값이 오면 형식 오류로 실패한다', async () => {
    server.use(
      http.get(DASHBOARD_VEHICLES_URL, () =>
        HttpResponse.json(
          success({
            asOf: '2026-11-24T01:00:31.000Z',
            vehicles: [{ ...vehicleStatusFixture(), lastResult: 'IN_PROGRESS' }],
          }),
        ),
      ),
    );

    await expect(getVehicleStatusSnapshot()).rejects.toThrow('서버 응답 data 형식이 다릅니다');
  });
});
