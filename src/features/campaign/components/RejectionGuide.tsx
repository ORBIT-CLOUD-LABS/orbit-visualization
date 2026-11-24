import { Alert } from '@/shared/ui/Alert';
import { Card } from '@/shared/ui/Card';

// 서버가 등록을 거부하는 경우(INVALID_INPUT·ARTIFACT_NOT_FOUND·ACTIVE_CAMPAIGN_EXISTS). code 원문은 보여 주지 않는다
const REJECTIONS = [
  {
    title: '입력값이 올바르지 않을 때',
    description:
      '필수 값이 비었거나, 차종·목표 버전이 파일과 다르거나, 종료 일시가 시작 일시보다 빠른 경우',
  },
  {
    title: '파일을 찾을 수 없을 때',
    description: '선택한 파일이 없거나 삭제된 경우',
  },
  {
    title: '같은 캠페인이 이미 있을 때',
    description: '같은 대상 조건·목표 버전으로 진행 중인 캠페인이 이미 있는 경우',
  },
] as const;

export function RejectionGuide() {
  return (
    <Card title="등록이 거부되는 경우" description="거부 사유별 안내">
      <ul className="flex flex-col gap-3">
        {REJECTIONS.map((rejection) => (
          <li key={rejection.title} className="flex flex-col gap-1 rounded-md bg-subtle p-3">
            <p className="text-xs font-medium text-danger">{rejection.title}</p>
            <p className="text-xs text-fg-muted">{rejection.description}</p>
          </li>
        ))}
      </ul>
      <Alert type="info" title="등록되면 캠페인 상세 화면으로 이동합니다" />
    </Card>
  );
}
