import { ApiError } from '@/shared/api/ApiError';
import { NetworkError } from '@/shared/api/NetworkError';

export type ErrorMessage = {
  title: string;
  description: string;
};

// 서버 ArtifactErrorCode·CommonErrorCode 중 등록에서 생기는 것. 401 은 httpClient 가 로그인 화면으로 보낸다
const MESSAGE_BY_CODE: Record<string, ErrorMessage> = {
  INVALID_INPUT: {
    title: '입력값이 올바르지 않습니다',
    description: '차종·버전·SHA-256 형식을 확인하세요',
  },
  ARTIFACT_VERSION_EXISTS: {
    title: '이미 등록된 버전입니다',
    description: '같은 차종에 같은 버전(1.0 과 1.0.0 포함)이 있습니다. 더 높은 버전으로 등록하세요',
  },
  HASH_MISMATCH: {
    title: 'SHA-256 이 일치하지 않습니다',
    description: '입력한 SHA-256 이 올린 파일의 값과 같은지 확인하세요',
  },
  SIGNATURE_INVALID: {
    title: '서명 검증에 실패했습니다',
    description: '차종·버전·파일이 서명할 때와 같은지, 키 버전이 맞는지 확인하세요',
  },
  CONTENT_TOO_LARGE: {
    title: '파일이 너무 큽니다',
    description: '1GB 이하 파일만 등록할 수 있습니다',
  },
  ORIGIN_UPLOAD_FAILED: {
    title: '파일 서버에 올리지 못했습니다',
    description: '잠시 후 다시 시도해 주세요',
  },
};

const NETWORK_MESSAGE: ErrorMessage = {
  title: '서버에 연결하지 못했습니다',
  description: '네트워크 상태를 확인하고 다시 시도해 주세요',
};

const UNKNOWN_MESSAGE: ErrorMessage = {
  title: '파일을 등록하지 못했습니다',
  description: '잠시 후 다시 시도해 주세요',
};

/** 등록 실패를 사람이 읽는 안내로 바꾼다. 서버 code·message 원문은 보여 주지 않는다 */
export function registerErrorMessage(error: unknown): ErrorMessage {
  if (error instanceof ApiError) {
    return MESSAGE_BY_CODE[error.code] ?? UNKNOWN_MESSAGE;
  }
  if (error instanceof NetworkError) {
    return NETWORK_MESSAGE;
  }
  return UNKNOWN_MESSAGE;
}
