// 환경변수는 이 모듈에서만 읽고 검증한다. 다른 코드는 import.meta.env 를 직접 읽지 않는다.

export type AppConfig = {
  /** API 기준 주소. 끝의 `/` 는 뺀다. 같은 origin 배포면 `/api/v1` 같은 경로다 */
  apiBaseUrl: string;
  /** 지도 타일 주소 템플릿. `{z}`·`{x}`·`{y}` 를 포함한다 */
  mapTileUrl: string;
};

const TILE_PLACEHOLDERS = ['{z}', '{x}', '{y}'] as const;

function requireEnv(name: string, value: unknown): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`환경변수 ${name} 이 비어 있습니다. .env.example 을 확인하세요`);
  }
  return value.trim();
}

// 절대 주소(http·https)나 `/` 로 시작하는 같은 origin 경로만 받는다
function isHttpUrlOrRootPath(value: string): boolean {
  if (value.startsWith('/')) {
    return !value.startsWith('//');
  }
  const protocol = parseProtocol(value);
  return protocol === 'http:' || protocol === 'https:';
}

// URL.canParse 는 Chrome 120 미만에 없어 시작 시 앱 전체가 멈춘다. 생성자로 확인한다
function parseProtocol(value: string): string | null {
  try {
    return new URL(value).protocol;
  } catch {
    return null;
  }
}

function requireBaseUrlEnv(name: string, value: unknown): string {
  const url = requireEnv(name, value);
  if (!isHttpUrlOrRootPath(url)) {
    throw new Error(`환경변수 ${name} 은 http(s) 주소나 / 로 시작하는 경로여야 합니다`);
  }
  return url.replace(/\/+$/, '');
}

function requireTileUrlEnv(name: string, value: unknown): string {
  const url = requireEnv(name, value);
  const missing = TILE_PLACEHOLDERS.filter((placeholder) => !url.includes(placeholder));
  if (missing.length > 0) {
    throw new Error(`환경변수 ${name} 에 ${missing.join(', ')} 가 없습니다`);
  }
  // 템플릿 자리표시자를 예시 값으로 바꿔 주소 형식만 확인한다
  const sample = url.replaceAll(/\{[a-z]+\}/g, '0');
  if (!isHttpUrlOrRootPath(sample)) {
    throw new Error(`환경변수 ${name} 은 http(s) 주소나 / 로 시작하는 경로여야 합니다`);
  }
  return url;
}

export function parseConfig(env: Record<string, unknown>): AppConfig {
  return {
    apiBaseUrl: requireBaseUrlEnv('VITE_API_BASE_URL', env.VITE_API_BASE_URL),
    mapTileUrl: requireTileUrlEnv('VITE_MAP_TILE_URL', env.VITE_MAP_TILE_URL),
  };
}

// 변수 이름을 그대로 적어야 빌드 도구가 값으로 바꾼다
export const config: AppConfig = parseConfig({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_MAP_TILE_URL: import.meta.env.VITE_MAP_TILE_URL,
});
