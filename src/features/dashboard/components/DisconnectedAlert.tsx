import { formatClockTime } from '@/shared/lib/formatClockTime';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';

type DisconnectedAlertProps = {
  /** 마지막으로 데이터를 받은 시각(ms). 아직 받지 못했으면 null */
  lastUpdatedAt: number | null;
  onReconnect: () => void;
};

/** 실시간 연결이 끊겨 재연결을 멈췄을 때 본문 위에 두는 경고 */
export function DisconnectedAlert({ lastUpdatedAt, onReconnect }: DisconnectedAlertProps) {
  const lastUpdated = formatClockTime(lastUpdatedAt);
  const title = `실시간 연결이 끊겨 화면이 갱신되지 않습니다.${lastUpdated === null ? '' : ` 마지막 갱신 ${lastUpdated}`}`;

  return (
    <Alert
      type="warning"
      title={title}
      action={
        <Button variant="secondary" onClick={onReconnect}>
          다시 연결
        </Button>
      }
    />
  );
}
