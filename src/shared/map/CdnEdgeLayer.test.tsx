import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { cdnEdgeStatusFixture } from '@/mocks/cdnEdgeHandlers';

import { CdnEdgeLayer } from './CdnEdgeLayer';

vi.mock('react-leaflet', () => import('@/test/reactLeafletMock'));

const PATH_STYLES = { healthy: {}, unhealthy: {} };

describe('CdnEdgeLayer', () => {
  it('Edge 마다 이름 라벨을 그리고 장애면 라벨에 알린다', () => {
    render(
      <CdnEdgeLayer
        edges={[
          cdnEdgeStatusFixture(),
          cdnEdgeStatusFixture({ edgeId: 'edge-busan', name: '부산', healthy: false }),
        ]}
        pathStyles={PATH_STYLES}
      />,
    );

    expect(screen.getByText('서울')).toBeInTheDocument();
    expect(screen.getByText('부산 (장애)')).toBeInTheDocument();
  });

  it('renderPopup 을 넘기면 Edge 마다 팝업 내용을 그린다', () => {
    render(
      <CdnEdgeLayer
        edges={[cdnEdgeStatusFixture({ assignedVehicles: 64 })]}
        pathStyles={PATH_STYLES}
        renderPopup={(edge) => `배정 차량 ${edge.assignedVehicles}대`}
      />,
    );

    expect(screen.getByText('배정 차량 64대')).toBeInTheDocument();
  });
});
