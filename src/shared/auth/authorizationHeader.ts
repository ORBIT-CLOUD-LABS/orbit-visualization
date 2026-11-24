import { tokenStorage } from './tokenStorage';

/** 관리자 토큰으로 Authorization 헤더 값을 만든다 */
export function bearerAuthorization(token: string): string {
  return `Bearer ${token}`;
}

/** 저장된 관리자 토큰으로 만든 Authorization 헤더 값. 토큰이 없으면 null */
export function authorizationHeader(): string | null {
  const token = tokenStorage.get();
  return token === null ? null : bearerAuthorization(token);
}
