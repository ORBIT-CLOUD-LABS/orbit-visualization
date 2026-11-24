import { describe, expect, it } from 'vitest';

import { ApiError } from '@/shared/api/ApiError';
import { NetworkError } from '@/shared/api/NetworkError';

import { registerErrorMessage } from './registerErrorMessage';

describe('registerErrorMessage', () => {
  it.each([
    ['INVALID_INPUT', 400, '입력값이 올바르지 않습니다'],
    ['ARTIFACT_NOT_FOUND', 404, '선택한 파일을 찾을 수 없습니다'],
    ['ACTIVE_CAMPAIGN_EXISTS', 409, '같은 대상 조건과 목표 버전의 활성 캠페인이 이미 있습니다'],
  ])('%s 는 안내 문구로 바꾼다', (code, status, title) => {
    expect(registerErrorMessage(new ApiError(status, code, '서버 원문')).title).toBe(title);
  });

  it('모르는 code 는 일반 안내를 쓴다', () => {
    expect(registerErrorMessage(new ApiError(500, 'INTERNAL_SERVER_ERROR', '')).title).toBe(
      '캠페인을 등록하지 못했습니다',
    );
  });

  it('응답 형식이 다르면 이미 등록됐는지 확인하라고 안내한다', () => {
    expect(registerErrorMessage(new Error('형식 오류')).title).toBe(
      '등록 결과를 확인하지 못했습니다',
    );
  });

  it('응답을 받지 못하면 연결 실패로 안내한다', () => {
    expect(registerErrorMessage(new NetworkError('')).title).toBe('서버에 연결하지 못했습니다');
  });
});
