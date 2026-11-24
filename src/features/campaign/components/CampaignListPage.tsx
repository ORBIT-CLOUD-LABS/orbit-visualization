import { EmptyState } from '@/shared/ui/EmptyState';
import { Topbar } from '@/shared/ui/Topbar';

import { useCampaigns } from '../hooks/useCampaigns';
import { CampaignListCard, LIST_DESCRIPTION, LIST_TITLE } from './CampaignListCard';
import { CampaignStats } from './CampaignStats';
import { Card } from './Card';
import { QueryFallback } from './QueryFallback';
import { RegisterCampaignLink } from './RegisterCampaignLink';

/** 05 캠페인 목록 */
export function CampaignListPage() {
  const { data: campaigns, isPending, refetch } = useCampaigns();

  function renderContent() {
    if (campaigns !== undefined && campaigns.length > 0) {
      return (
        <>
          <CampaignStats campaigns={campaigns} />
          <CampaignListCard campaigns={campaigns} />
        </>
      );
    }
    if (campaigns !== undefined) {
      return (
        <Card title={LIST_TITLE} description={LIST_DESCRIPTION}>
          <EmptyState
            title="등록된 캠페인이 없습니다"
            description="파일을 등록한 뒤 캠페인을 만들어 배포를 시작하세요"
            action={<RegisterCampaignLink>캠페인 등록</RegisterCampaignLink>}
          />
        </Card>
      );
    }
    return (
      <Card
        title={LIST_TITLE}
        description={LIST_DESCRIPTION}
        action={<RegisterCampaignLink>+ 캠페인 등록</RegisterCampaignLink>}
      >
        <QueryFallback isPending={isPending} onRetry={() => void refetch()} />
      </Card>
    );
  }

  return (
    <>
      <Topbar title="캠페인" />
      <div className="flex flex-col gap-6 p-8">{renderContent()}</div>
    </>
  );
}
