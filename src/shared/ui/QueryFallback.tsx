import { LoadErrorAlert } from './LoadErrorAlert';
import { LoadingRows, type LoadingRowsVariant } from './LoadingRows';

type QueryFallbackProps = {
  isPending: boolean;
  onRetry: () => void;
  /** 화면 읽기 도구에 알릴 로딩 문구 */
  loadingLabel?: string;
  loadingVariant?: LoadingRowsVariant;
  /** 무엇을 불러오지 못했는지. 예: "차량 정보를 불러오지 못했습니다" */
  errorMessage?: string;
  /** 서버 응답 code. 없으면 생략 */
  errorCode?: string;
};

/** 데이터가 아직 없을 때의 자리. 불러오는 중이면 로딩 행, 실패했으면 다시 시도 안내 */
export function QueryFallback({
  isPending,
  onRetry,
  loadingLabel,
  loadingVariant,
  errorMessage,
  errorCode,
}: QueryFallbackProps) {
  return isPending ? (
    <LoadingRows label={loadingLabel} variant={loadingVariant} />
  ) : (
    <LoadErrorAlert message={errorMessage} code={errorCode} onRetry={onRetry} />
  );
}
