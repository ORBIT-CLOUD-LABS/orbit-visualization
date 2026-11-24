// 서버 UpdateFailureReason 값. 목록에 없는 값이 와도 화면은 그린다
const FAILURE_REASON_LABEL: Record<string, string> = {
  DOWNLOAD_FAILED: '파일 다운로드 실패',
  HASH_MISMATCH: '파일 해시 불일치 — 차량이 설치하지 않음',
  SIGNATURE_INVALID: '펌웨어 서명 검증 실패 — 차량이 설치하지 않음',
  DOWNGRADE_REJECTED: '이전 버전이라 차량이 설치를 거부함',
  INSTALL_FAILED: '차량에서 설치 실패',
};

/** 실패 사유 코드를 사람이 읽는 문장으로. 모르는 코드면 일반 문구 */
export function failureReasonLabel(reason: string | null): string {
  if (reason === null) {
    return '업데이트 실패';
  }
  return FAILURE_REASON_LABEL[reason] ?? '업데이트 실패';
}
