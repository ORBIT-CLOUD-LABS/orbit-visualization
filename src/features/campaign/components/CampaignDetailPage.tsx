import { Link, useParams } from 'react-router';

import { ApiError } from '@/shared/api/ApiError';
import { ROUTES } from '@/shared/config/routes';
import { buttonClassName } from '@/shared/ui/buttonClassName';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { QueryFallback } from '@/shared/ui/QueryFallback';
import { Topbar } from '@/shared/ui/Topbar';

import { useCampaign } from '../hooks/useCampaign';
import { useCampaignStats } from '../hooks/useCampaignStats';
import { parseId } from '../lib/parseId';
import { Breadcrumb } from './Breadcrumb';
import { CampaignInfoCard } from './CampaignInfoCard';
import { CampaignStatsSection } from './CampaignStatsSection';
import { DeactivateCampaignButton } from './DeactivateCampaignButton';

const NOT_FOUND = 404;

/** 07 캠페인 상세 */
export function CampaignDetailPage() {
  const params = useParams();
  const campaignId = parseId(params.campaignId);
  const { data: campaign, error, isPending, refetch } = useCampaign(campaignId);
  // 상세를 기다리지 않고 진행 현황도 함께 요청한다
  const statsQuery = useCampaignStats(campaignId);
  const isNotFound =
    campaignId === null || (error instanceof ApiError && error.status === NOT_FOUND);

  function renderContent() {
    if (isNotFound) {
      return (
        <EmptyState
          title="캠페인을 찾을 수 없습니다"
          description="삭제됐거나 잘못된 주소입니다"
          action={
            <Link to={ROUTES.campaigns} className={buttonClassName({ variant: 'secondary' })}>
              캠페인 목록으로
            </Link>
          }
        />
      );
    }
    if (campaign !== undefined) {
      return (
        <>
          <Breadcrumb current={`#${campaign.campaignId} ${campaign.name}`} />
          <CampaignInfoCard
            campaign={campaign}
            action={
              campaign.status === 'ACTIVE' && (
                <DeactivateCampaignButton campaignId={campaign.campaignId} />
              )
            }
          />
          <CampaignStatsSection statsQuery={statsQuery} />
        </>
      );
    }
    return (
      <>
        <Breadcrumb current="캠페인 상세" />
        <Card title="캠페인 정보">
          <QueryFallback isPending={isPending} onRetry={() => void refetch()} />
        </Card>
      </>
    );
  }

  return (
    <>
      <Topbar title="캠페인 상세" />
      <div className="flex flex-col gap-6 p-8">{renderContent()}</div>
    </>
  );
}
