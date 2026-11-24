import { tokenStorage } from './tokenStorage';

type UnauthorizedListener = () => void;

const listeners = new Set<UnauthorizedListener>();

/**
 * 서버가 401 을 주면 부를 함수를 등록한다. shared 는 라우터를 모르므로 이동은 app 이 등록한 함수가 맡는다.
 * @returns 등록을 푸는 함수
 */
export function onUnauthorized(listener: UnauthorizedListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** 저장된 토큰을 지우고 등록된 함수에 알린다. httpClient 와 sseClient 가 401 을 받으면 부른다 */
export function reportUnauthorized(): void {
  tokenStorage.clear();
  listeners.forEach((listener) => {
    listener();
  });
}
