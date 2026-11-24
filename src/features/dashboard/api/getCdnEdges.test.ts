import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { success } from '@/mocks/apiEnvelope';
import {
  cdnEdgeStatusFixture,
  cdnEdgesResponse,
  DASHBOARD_CDN_EDGES_URL,
} from '@/mocks/dashboardHandlers';
import { server } from '@/mocks/server';

import { getCdnEdges } from './getCdnEdges';

describe('getCdnEdges', () => {
  it('Edge 상태를 검증해 돌려준다', async () => {
    const edges = [
      cdnEdgeStatusFixture(),
      cdnEdgeStatusFixture({
        edgeId: 'edge-busan',
        name: '부산',
        healthy: false,
        assignedVehicles: 0,
        downloads: [],
      }),
    ];
    server.use(http.get(DASHBOARD_CDN_EDGES_URL, () => cdnEdgesResponse(edges)));

    await expect(getCdnEdges()).resolves.toEqual({ edges });
  });

  it('좌표가 빠지면 형식 오류로 실패한다', async () => {
    const { latitude: _latitude, ...withoutLatitude } = cdnEdgeStatusFixture();
    server.use(
      http.get(DASHBOARD_CDN_EDGES_URL, () =>
        HttpResponse.json(success({ edges: [withoutLatitude] })),
      ),
    );

    await expect(getCdnEdges()).rejects.toThrow('서버 응답 data 형식이 다릅니다');
  });

  it('위도·경도 범위를 벗어나면 형식 오류로 실패한다', async () => {
    server.use(
      http.get(DASHBOARD_CDN_EDGES_URL, () =>
        cdnEdgesResponse([cdnEdgeStatusFixture({ latitude: 1265 })]),
      ),
    );

    await expect(getCdnEdges()).rejects.toThrow('서버 응답 data 형식이 다릅니다');
  });
});
