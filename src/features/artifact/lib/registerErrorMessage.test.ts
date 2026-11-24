import { describe, expect, it } from 'vitest';

import { ApiError } from '@/shared/api/ApiError';
import { NetworkError } from '@/shared/api/NetworkError';

import { registerErrorMessage } from './registerErrorMessage';

describe('registerErrorMessage', () => {
  it.each([
    ['INVALID_INPUT', 400, '입력값이 올바르지 않습니다'],
    ['ARTIFACT_VERSION_EXISTS', 409, '이미 등록된 버전입니다'],
    ['HASH_MISMATCH', 422, 'SHA-256 이 일치하지 않습니다'],
    ['SIGNATURE_INVALID', 422, '서명 검증에 실패했습니다'],
    ['CONTENT_TOO_LARGE', 413, '파일이 너무 큽니다'],
    ['ORIGIN_UPLOAD_FAILED', 502, '파일 서버에 올리지 못했습니다'],
  ])('%s 는 안내 문구로 바꾼다', (code, status, title) => {
    expect(registerErrorMessage(new ApiError(status, code, '서버 원문')).title).toBe(title);
  });

  it('모르는 code 와 그 밖의 오류는 일반 안내를 쓴다', () => {
    expect(registerErrorMessage(new ApiError(500, 'INTERNAL_SERVER_ERROR', '')).title).toBe(
      '파일을 등록하지 못했습니다',
    );
    expect(registerErrorMessage(new Error('형식 오류')).title).toBe('파일을 등록하지 못했습니다');
  });

  it('응답을 받지 못하면 연결 실패로 안내한다', () => {
    expect(registerErrorMessage(new NetworkError('')).title).toBe('서버에 연결하지 못했습니다');
  });
});
