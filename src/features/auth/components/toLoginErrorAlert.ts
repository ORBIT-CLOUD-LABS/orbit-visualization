import { ApiError } from '@/shared/api/ApiError';
import { NetworkError } from '@/shared/api/NetworkError';

const UNAUTHORIZED = 401;

export type LoginErrorAlert = {
  title: string;
  code?: string;
};

/** 토큰 확인 실패를 화면에 보여 줄 문구로 바꾼다. 잘못된 토큰과 서버 접속 실패를 구분한다 */
export function toLoginErrorAlert(error: unknown): LoginErrorAlert {
  if (error instanceof ApiError && error.status === UNAUTHORIZED) {
    return {
      title: '토큰이 올바르지 않습니다. 다시 입력해 주세요.',
      code: `${error.status} ${error.code}`,
    };
  }
  if (error instanceof NetworkError) {
    return { title: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.' };
  }
  const title = '토큰을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.';
  if (error instanceof ApiError) {
    return { title, code: `${error.status} ${error.code}` };
  }
  return { title };
}
