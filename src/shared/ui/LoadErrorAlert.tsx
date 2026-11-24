import { Alert } from './Alert';
import { Button } from './Button';

type LoadErrorAlertProps = {
  /** 무엇을 불러오지 못했는지. 끝에 마침표를 붙이지 않는다. 예: "차량 정보를 불러오지 못했습니다" */
  message?: string;
  /** 서버 응답 code. 없으면 생략 */
  code?: string;
  onRetry: () => void;
  /** 다시 불러오는 중이면 true. 다시 시도 버튼을 막는다 */
  isRetrying?: boolean;
};

/** 불러오기 실패와 다시 시도 버튼. 서버 응답 원문은 보여 주지 않는다 */
export function LoadErrorAlert({
  message = '데이터를 불러오지 못했습니다',
  code,
  onRetry,
  isRetrying = false,
}: LoadErrorAlertProps) {
  return (
    <Alert
      type="error"
      title={`${message}. 잠시 후 다시 시도해 주세요.`}
      code={code}
      action={
        <Button variant="secondary" disabled={isRetrying} onClick={onRetry}>
          다시 시도
        </Button>
      }
    />
  );
}
