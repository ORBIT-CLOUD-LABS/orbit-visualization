import { describe, expect, it } from 'vitest';

import { parseConfig } from './config';

const TILE_URL = 'https://{s}.tile.example.test/{z}/{x}/{y}.png';

describe('parseConfig', () => {
  it('같은 origin 경로를 API 기준 주소로 받고 끝의 / 를 뺀다', () => {
    const config = parseConfig({ VITE_API_BASE_URL: '/api/v1/', VITE_MAP_TILE_URL: TILE_URL });

    expect(config).toEqual({ apiBaseUrl: '/api/v1', mapTileUrl: TILE_URL });
  });

  it('http(s) 절대 주소도 API 기준 주소로 받는다', () => {
    const config = parseConfig({
      VITE_API_BASE_URL: 'https://ota.example.test/api/v1',
      VITE_MAP_TILE_URL: '/tiles/{z}/{x}/{y}.png',
    });

    expect(config.apiBaseUrl).toBe('https://ota.example.test/api/v1');
    expect(config.mapTileUrl).toBe('/tiles/{z}/{x}/{y}.png');
  });

  it.each([undefined, '', '   ', 42])('API 기준 주소가 %s 이면 오류를 던진다', (value) => {
    expect(() => parseConfig({ VITE_API_BASE_URL: value, VITE_MAP_TILE_URL: TILE_URL })).toThrow(
      'VITE_API_BASE_URL',
    );
  });

  it.each(['api/v1', '//evil.example.test/api', 'javascript:alert(1)', 'ftp://example.test'])(
    'API 기준 주소가 %s 처럼 허용하지 않는 형식이면 오류를 던진다',
    (value) => {
      expect(() => parseConfig({ VITE_API_BASE_URL: value, VITE_MAP_TILE_URL: TILE_URL })).toThrow(
        'VITE_API_BASE_URL',
      );
    },
  );

  it('타일 주소에 {z}·{x}·{y} 가 없으면 오류를 던진다', () => {
    expect(() =>
      parseConfig({
        VITE_API_BASE_URL: '/api/v1',
        VITE_MAP_TILE_URL: 'https://tile.example.test/{z}.png',
      }),
    ).toThrow('{x}, {y}');
  });

  it('타일 주소가 비어 있으면 오류를 던진다', () => {
    expect(() => parseConfig({ VITE_API_BASE_URL: '/api/v1' })).toThrow('VITE_MAP_TILE_URL');
  });
});
