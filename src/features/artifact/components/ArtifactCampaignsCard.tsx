import { Link } from 'react-router';

import { routePaths } from '@/shared/config/routes';
import { formatDate } from '@/shared/lib/formatDateTime';
import { Badge, type BadgeTone } from '@/shared/ui/Badge';
import { buttonClassName } from '@/shared/ui/buttonClassName';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { QueryFallback } from '@/shared/ui/QueryFallback';
import {
  TABLE_CELL as CELL,
  TABLE_HEAD_CELL as HEAD_CELL,
  TABLE_TEXT_CELL as TEXT_CELL,
} from '@/shared/ui/tableClassNames';

import type { ArtifactCampaign } from '../api/getModelCampaigns';
import { useArtifactCampaigns } from '../hooks/useArtifactCampaigns';

const STATUS_TONE: Record<ArtifactCampaign['status'], BadgeTone> = {
  ACTIVE: 'info',
  INACTIVE: 'neutral',
};

type ArtifactCampaignsCardProps = {
  model: string;
  version: string;
};

export function ArtifactCampaignsCard({ model, version }: ArtifactCampaignsCardProps) {
  const { data: campaigns, isPending, refetch } = useArtifactCampaigns(model, version);

  function renderContent() {
    if (campaigns === undefined) {
      return <QueryFallback isPending={isPending} onRetry={() => void refetch()} />;
    }
    if (campaigns.length === 0) {
      return (
        <EmptyState
          title="이 파일을 쓰는 캠페인이 없습니다"
          description="이 파일로 캠페인을 등록하면 여기에 표시됩니다"
        />
      );
    }
    return (
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full border-collapse">
          <thead className="bg-subtle">
            <tr>
              <th scope="col" className={HEAD_CELL}>
                ID
              </th>
              <th scope="col" className={HEAD_CELL}>
                이름
              </th>
              <th scope="col" className={HEAD_CELL}>
                상태
              </th>
              <th scope="col" className={HEAD_CELL}>
                적용 기간
              </th>
              <th scope="col" className={HEAD_CELL}>
                등록일
              </th>
              <th scope="col" className={HEAD_CELL}>
                <span className="sr-only">상세</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.campaignId} className="border-t border-line bg-surface">
                <td className={CELL}>{campaign.campaignId}</td>
                <td className={TEXT_CELL}>{campaign.name}</td>
                <td className="h-12 px-4">
                  <Badge tone={STATUS_TONE[campaign.status]}>{campaign.status}</Badge>
                </td>
                <td className={CELL}>
                  {formatDate(campaign.startAt)} ~ {formatDate(campaign.endAt)}
                </td>
                <td className={CELL}>{formatDate(campaign.createdAt)}</td>
                <td className="h-12 px-4">
                  <Link
                    to={routePaths.campaignDetail(campaign.campaignId)}
                    aria-label={`${campaign.name} 상세`}
                    className={buttonClassName({ variant: 'ghost' })}
                  >
                    상세
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <Card title="이 파일을 쓰는 캠페인" description="같은 차종·버전을 목표로 하는 캠페인">
      {renderContent()}
    </Card>
  );
}
