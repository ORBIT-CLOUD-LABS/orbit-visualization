import { describe, expect, it } from 'vitest';

import { failureReasonLabel } from './failureReasonLabel';

describe('failureReasonLabel', () => {
  it('아는 실패 사유는 문장으로 바꾼다', () => {
    expect(failureReasonLabel('SIGNATURE_INVALID')).toBe(
      '펌웨어 서명 검증 실패 — 차량이 설치하지 않음',
    );
  });

  it('모르는 사유나 null 이면 일반 문구를 쓴다', () => {
    expect(failureReasonLabel('NEW_REASON')).toBe('업데이트 실패');
    expect(failureReasonLabel(null)).toBe('업데이트 실패');
  });
});
