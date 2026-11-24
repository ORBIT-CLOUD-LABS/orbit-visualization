import { ApiError } from '@/shared/api/ApiError';
import { NetworkError } from '@/shared/api/NetworkError';

const UNAUTHORIZED = 401;
const UNKNOWN_FAILURE = '토큰을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.';

export type LoginErrorAlert = {
  title: string;
  code?: string;
};

/** 토큰 확인 실패를 화면에 보여 줄 문구로 바꾼다. 잘못된 토큰과 서버 접속 실패를 구분한다 */
export function toLoginErrorAlert(error: unknown): LoginErrorAlert {
  if (error instanceof NetworkError) {
    return { title: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.' };
  }
  if (error instanceof ApiError) {
    return {
      title:
        error.status === UNAUTHORIZED
          ? '토큰이 올바르지 않습니다. 다시 입력해 주세요.'
          : UNKNOWN_FAILURE,
      code: `${error.status} ${error.code}`,
    };
  }
  return { title: UNKNOWN_FAILURE };
}
