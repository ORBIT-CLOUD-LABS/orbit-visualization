/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const DEFAULT_DEV_PROXY_TARGET = 'http://localhost:8080';

export default defineConfig(({ mode }) => {
  // 접두사 없이 읽어 VITE_ 가 아닌 개발 전용 변수도 쓴다. 이 값은 브라우저 코드에 들어가지 않는다
  const env = loadEnv(mode, process.cwd(), '');
  const devProxyTarget = env.DEV_PROXY_TARGET?.trim() || DEFAULT_DEV_PROXY_TARGET;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      // `@/` alias 는 tsconfig.app.json 의 paths 한 곳에서 정한다
      tsconfigPaths: true,
    },
    server: {
      // 운영은 서버와 같은 origin 으로 제공한다. 개발 중에도 같은 origin 처럼 보이도록 /api 를 서버로 넘긴다
      proxy: {
        '/api': {
          target: devProxyTarget,
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      restoreMocks: true,
      env: {
        VITE_API_BASE_URL: '/api/v1',
        VITE_MAP_TILE_URL: 'https://tile.example.test/{z}/{x}/{y}.png',
      },
    },
  };
});
