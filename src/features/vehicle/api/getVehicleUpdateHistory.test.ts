import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { success } from '@/mocks/apiEnvelope';
import { server } from '@/mocks/server';
import { VEHICLE_EVENTS_URL, vehicleUpdateEventFixture } from '@/mocks/vehicleHandlers';

import { getVehicleUpdateHistory } from './getVehicleUpdateHistory';

describe('getVehicleUpdateHistory', () => {
  it('업데이트 시도 목록을 받은 순서대로 돌려준다', async () => {
    const events = [
      vehicleUpdateEventFixture(),
      vehicleUpdateEventFixture({
        campaignId: 5,
        version: '1.0.0',
        result: 'SUCCEEDED',
        failureReason: null,
        failureDetail: null,
        finishedAt: '2026-10-20T05:02:10.000Z',
      }),
    ];
    server.use(http.get(VEHICLE_EVENTS_URL, () => HttpResponse.json(success({ events }))));

    await expect(getVehicleUpdateHistory('VH-0001')).resolves.toEqual(events);
  });

  it('시도한 적이 없으면 빈 목록을 돌려준다', async () => {
    server.use(http.get(VEHICLE_EVENTS_URL, () => HttpResponse.json(success({ events: [] }))));

    await expect(getVehicleUpdateHistory('VH-0001')).resolves.toEqual([]);
  });

  it('형식이 다르면 실패한다', async () => {
    server.use(
      http.get(VEHICLE_EVENTS_URL, () =>
        HttpResponse.json(success({ events: [{ ...vehicleUpdateEventFixture(), version: 1 }] })),
      ),
    );

    await expect(getVehicleUpdateHistory('VH-0001')).rejects.toThrow(
      '서버 응답 data 형식이 다릅니다',
    );
  });
});
