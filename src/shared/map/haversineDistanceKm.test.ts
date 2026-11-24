import { describe, expect, it } from 'vitest';

import { haversineDistanceKm } from './haversineDistanceKm';

describe('haversineDistanceKm', () => {
  it('같은 좌표면 0 이다', () => {
    expect(haversineDistanceKm([37.5, 127], [37.5, 127])).toBe(0);
  });

  it('적도에서 경도 1도는 약 111.19 km 다', () => {
    expect(haversineDistanceKm([0, 0], [0, 1])).toBeCloseTo(111.19, 2);
  });

  it('서울 시청에서 부산 시청까지 약 325 km 다', () => {
    const distance = haversineDistanceKm([37.5665, 126.978], [35.1796, 129.0756]);

    expect(distance).toBeGreaterThan(320);
    expect(distance).toBeLessThan(330);
  });

  it('방향을 바꿔도 거리가 같다', () => {
    expect(haversineDistanceKm([35.1, 129], [37.5, 127])).toBeCloseTo(
      haversineDistanceKm([37.5, 127], [35.1, 129]),
      10,
    );
  });

  it('날짜 변경선을 건너도 짧은 쪽 거리를 잰다', () => {
    expect(haversineDistanceKm([0, 179.5], [0, -179.5])).toBeCloseTo(111.19, 2);
  });

  it('지구 반대편은 반 바퀴 거리다', () => {
    expect(haversineDistanceKm([0, 0], [0, 180])).toBeCloseTo(Math.PI * 6371, 6);
  });
});
