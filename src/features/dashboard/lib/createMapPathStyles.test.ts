import { describe, expect, it } from 'vitest';

import { createMapPathStyles } from './createMapPathStyles';

const readToken = (token: string) => `token:${token}`;

describe('createMapPathStyles', () => {
  it('차량 마커는 결과별 상태색으로 채운다', () => {
    const { vehicle } = createMapPathStyles(readToken);

    expect(vehicle.success.fillColor).toBe('token:success');
    expect(vehicle.danger.fillColor).toBe('token:danger');
    expect(vehicle.neutral.fillColor).toBe('token:neutral');
  });

  it('장애 Edge 는 danger, 재배정 선은 warning 점선이다', () => {
    const { edge, link } = createMapPathStyles(readToken);

    expect(edge.healthy.fillColor).toBe('token:primary');
    expect(edge.unhealthy.fillColor).toBe('token:danger');
    expect(link.assigned).toMatchObject({ color: 'token:primary' });
    expect(link.reassigned).toMatchObject({ color: 'token:warning', dashArray: '4 4' });
  });
});
