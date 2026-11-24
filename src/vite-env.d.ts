/// <reference types="vite/client" />

// 값의 검증은 src/config.ts 가 한다. 여기서는 이름만 선언하고 타입은 믿지 않도록 unknown 으로 둔다.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: unknown;
  readonly VITE_MAP_TILE_URL: unknown;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
