import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { ApiError } from '@/shared/api/ApiError';
import { success } from '@/mocks/apiEnvelope';
import { server } from '@/mocks/server';
import { VEHICLE_DETAIL_URL, vehicleDetailFixture } from '@/mocks/vehicleHandlers';

import { getVehicleDetail } from './getVehicleDetail';

describe('getVehicleDetail', () => {
  it('차량 상세를 검증해 돌려준다', async () => {
    await expect(getVehicleDetail('VH-0001')).resolves.toEqual(vehicleDetailFixture());
  });

  it('결과·위치가 없는 차량도 받는다', async () => {
    const vehicle = vehicleDetailFixture({ lastUpdate: null, location: null, lastSeenAt: null });
    server.use(http.get(VEHICLE_DETAIL_URL, () => HttpResponse.json(success(vehicle))));

    await expect(getVehicleDetail('VH-0001')).resolves.toEqual(vehicle);
  });

  it('vehicleId 를 경로 조각으로 인코딩한다', async () => {
    let requestedId: unknown;
    server.use(
      http.get(VEHICLE_DETAIL_URL, ({ params }) => {
        requestedId = params.vehicleId;
        return HttpResponse.json(success(vehicleDetailFixture()));
      }),
    );

    await getVehicleDetail('VH/0001?x');

    expect(requestedId).toBe('VH/0001?x');
  });

  it('없는 차량이면 VEHICLE_NOT_FOUND 로 실패한다', async () => {
    const error: unknown = await getVehicleDetail('VH-9999').catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, code: 'VEHICLE_NOT_FOUND' });
  });

  it('알 수 없는 결과 값이 오면 형식 오류로 실패한다', async () => {
    const lastUpdate = { ...vehicleDetailFixture().lastUpdate, result: 'IN_PROGRESS' };
    server.use(
      http.get(VEHICLE_DETAIL_URL, () =>
        HttpResponse.json(success({ ...vehicleDetailFixture(), lastUpdate })),
      ),
    );

    await expect(getVehicleDetail('VH-0001')).rejects.toThrow('서버 응답 data 형식이 다릅니다');
  });
});
