import { ApiError } from './ApiError';

/** 서버가 돌려준 오류 code. 서버 응답이 아닌 오류(네트워크 등)면 undefined */
export function errorCodeOf(error: unknown): string | undefined {
  return error instanceof ApiError ? error.code : undefined;
}
