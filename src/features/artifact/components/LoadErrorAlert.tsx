import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';

type LoadErrorAlertProps = {
  onRetry: () => void;
};

/** 불러오기 실패. 서버 응답 원문은 보여 주지 않는다 */
export function LoadErrorAlert({ onRetry }: LoadErrorAlertProps) {
  return (
    <Alert
      type="error"
      title="데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
      action={
        <Button variant="secondary" onClick={onRetry}>
          다시 시도
        </Button>
      }
    />
  );
}
