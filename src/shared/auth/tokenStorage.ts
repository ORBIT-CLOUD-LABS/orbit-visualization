// 관리자 토큰을 sessionStorage 에 둔다. 이유는 docs/decisions/0001-admin-token-session-storage.md
const STORAGE_KEY = 'orbit.adminToken';
const MAX_TOKEN_LENGTH = 4096;
// Authorization 헤더에 그대로 넣을 수 있는 문자(공백 없는 ASCII)만 받는다
const TOKEN_PATTERN = /^[\x21-\x7E]+$/;

function isValidToken(value: unknown): value is string {
  return typeof value === 'string' && value.length <= MAX_TOKEN_LENGTH && TOKEN_PATTERN.test(value);
}

// 사이트 데이터를 막은 브라우저는 접근만 해도 SecurityError 를 던진다. 토큰이 없는 것으로 보고 로그인 화면으로 보낸다
function readStorage(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export const tokenStorage = {
  /** 저장할 수 있는 형식인지 본다. 입력 화면이 저장 전에 확인할 때 쓴다 */
  isValid(token: string): boolean {
    return isValidToken(token);
  },

  /** 저장된 토큰을 검증해 돌려준다. 없거나 형식이 다르거나 저장소를 쓸 수 없으면 null */
  get(): string | null {
    const value = readStorage();
    if (value === null) {
      return null;
    }
    if (!isValidToken(value)) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return value;
  },

  set(token: string): void {
    if (!isValidToken(token)) {
      throw new Error('관리자 토큰 형식이 올바르지 않습니다');
    }
    sessionStorage.setItem(STORAGE_KEY, token);
  },

  clear(): void {
    sessionStorage.removeItem(STORAGE_KEY);
  },
};
