import { describe, expect, it } from 'vitest';

import { routePaths } from './routes';

describe('routePaths', () => {
  it('파라미터를 넣어 실제 경로를 만든다', () => {
    expect(routePaths.campaignDetail(3)).toBe('/campaigns/3');
    expect(routePaths.artifactDetail(7)).toBe('/artifacts/7');
  });

  it('차량 id 의 특수 문자를 인코딩한다', () => {
    expect(routePaths.vehicleDetail('car 1/a')).toBe('/vehicles/car%201%2Fa');
  });
});
