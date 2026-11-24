import { ApiError } from '@/shared/api/ApiError';
import { NetworkError } from '@/shared/api/NetworkError';

export type ErrorMessage = {
  title: string;
  description: string;
};

// 서버 CampaignErrorCode·ArtifactErrorCode·CommonErrorCode 중 등록에서 생기는 것. 401 은 httpClient 가 로그인 화면으로 보낸다
const MESSAGE_BY_CODE: Record<string, ErrorMessage> = {
  INVALID_INPUT: {
    title: '입력값이 올바르지 않습니다',
    description: '필수 값과 현재 버전 범위, 시작·종료 일시를 확인하세요',
  },
  ARTIFACT_NOT_FOUND: {
    title: '선택한 파일을 찾을 수 없습니다',
    description: '파일이 삭제됐을 수 있습니다. 다른 파일을 선택하세요',
  },
  ACTIVE_CAMPAIGN_EXISTS: {
    title: '같은 대상 조건과 목표 버전의 활성 캠페인이 이미 있습니다',
    description: '기존 캠페인을 비활성화하거나 대상 조건·목표 버전을 바꿔 주세요',
  },
};

const NETWORK_MESSAGE: ErrorMessage = {
  title: '서버에 연결하지 못했습니다',
  description: '캠페인 목록에서 등록됐는지 확인한 뒤 다시 시도해 주세요',
};

const UNKNOWN_MESSAGE: ErrorMessage = {
  title: '캠페인을 등록하지 못했습니다',
  description: '잠시 후 다시 시도해 주세요',
};

const UNCONFIRMED_MESSAGE: ErrorMessage = {
  title: '등록 결과를 확인하지 못했습니다',
  description: '다시 등록하기 전에 캠페인 목록에서 등록됐는지 확인하세요',
};

/** 등록 실패를 사람이 읽는 안내로 바꾼다. 서버 code·message 원문은 보여 주지 않는다 */
export function registerErrorMessage(error: unknown): ErrorMessage {
  if (error instanceof ApiError) {
    return MESSAGE_BY_CODE[error.code] ?? UNKNOWN_MESSAGE;
  }
  if (error instanceof NetworkError) {
    return NETWORK_MESSAGE;
  }
  // 서버는 성공으로 응답했지만 응답 형식 검증에 실패한 경우다. 이미 등록됐을 수 있다
  return UNCONFIRMED_MESSAGE;
}
