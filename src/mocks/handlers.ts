import type { RequestHandler } from 'msw';

// 기능별 기본 응답 핸들러를 모은다. 테스트에서 상태를 바꿀 때는 server.use() 로 덮어쓴다.
export const handlers: RequestHandler[] = [];
