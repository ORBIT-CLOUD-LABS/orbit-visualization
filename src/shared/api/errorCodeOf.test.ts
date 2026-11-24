import { describe, expect, it } from 'vitest';

import { ApiError } from './ApiError';
import { errorCodeOf } from './errorCodeOf';
import { NetworkError } from './NetworkError';

describe('errorCodeOf', () => {
  it('서버 응답 오류면 code 를 돌려준다', () => {
    expect(errorCodeOf(new ApiError(500, 'INTERNAL_ERROR', '서버 오류'))).toBe('INTERNAL_ERROR');
  });

  it('서버 응답이 아닌 오류나 값이 없으면 undefined 를 돌려준다', () => {
    expect(errorCodeOf(new NetworkError('연결 실패'))).toBeUndefined();
    expect(errorCodeOf(null)).toBeUndefined();
  });
});
