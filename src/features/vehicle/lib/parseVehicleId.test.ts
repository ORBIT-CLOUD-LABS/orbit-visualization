import { describe, expect, it } from 'vitest';

import { parseVehicleId } from './parseVehicleId';

describe('parseVehicleId', () => {
  it('값을 그대로 돌려준다', () => {
    expect(parseVehicleId('VH-0001')).toBe('VH-0001');
  });

  it('SSE 경로와 겹치는 stream 은 null', () => {
    expect(parseVehicleId('stream')).toBeNull();
  });

  it('없거나 공백뿐이면 null', () => {
    expect(parseVehicleId(undefined)).toBeNull();
    expect(parseVehicleId('')).toBeNull();
    expect(parseVehicleId('  ')).toBeNull();
  });
});
