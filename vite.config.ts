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
    build: {
      rolldownOptions: {
        output: {
          // 첫 화면에 꼭 필요한 라이브러리는 앱 코드와 나눠, 앱만 바뀐 배포에서 브라우저 캐시를 다시 쓰게 한다.
          // 한 화면에서만 쓰는 라이브러리(지도 등)는 여기 넣지 않는다. 묶음에 들어가면 첫 화면에서 함께 받게 된다
          codeSplitting: {
            groups: [
              { name: 'react', test: /node_modules[\\/].*[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: 'router', test: /node_modules[\\/].*[\\/]react-router[\\/]/ },
              {
                name: 'vendor',
                test: /node_modules[\\/].*[\\/](@tanstack|axios|zod|clsx|tailwind-merge|@microsoft)[\\/]/,
              },
            ],
          },
        },
      },
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
      // 테스트는 src 에만 있다. 저장소 안의 에이전트 worktree(.claude/worktrees)를 읽지 않게 범위를 좁힌다
      include: ['src/**/*.test.{ts,tsx}'],
      restoreMocks: true,
      env: {
        VITE_API_BASE_URL: '/api/v1',
        VITE_MAP_TILE_URL: 'https://tile.example.test/{z}/{x}/{y}.png',
      },
    },
  };
});
