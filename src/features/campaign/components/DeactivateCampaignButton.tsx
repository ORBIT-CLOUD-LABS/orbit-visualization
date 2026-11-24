import { Button } from '@/shared/ui/Button';

import { useDeactivateCampaign } from '../hooks/useDeactivateCampaign';

const CONFIRM_MESSAGE = '이 캠페인을 비활성화할까요? 배포가 중지되고 다시 활성화할 수 없습니다.';

type DeactivateCampaignButtonProps = {
  campaignId: number;
};

/** 확인을 받은 뒤 캠페인을 비활성화한다 */
export function DeactivateCampaignButton({ campaignId }: DeactivateCampaignButtonProps) {
  const deactivation = useDeactivateCampaign();

  function handleClick() {
    if (window.confirm(CONFIRM_MESSAGE)) {
      deactivation.mutate(campaignId);
    }
  }

  return (
    <>
      {deactivation.isError && (
        <p role="alert" className="text-xs text-danger">
          비활성화하지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}
      <Button variant="danger" disabled={deactivation.isPending} onClick={handleClick}>
        {deactivation.isPending ? '비활성화 중…' : '비활성화'}
      </Button>
    </>
  );
}
