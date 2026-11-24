import { Link } from 'react-router';

import { routePaths } from '@/shared/config/routes';
import { Badge, type BadgeTone } from '@/shared/ui/Badge';
import { buttonClassName } from '@/shared/ui/buttonClassName';
import { EmptyState } from '@/shared/ui/EmptyState';

import type { ArtifactCampaign } from '../api/getModelCampaigns';
import { useArtifactCampaigns } from '../hooks/useArtifactCampaigns';
import { formatDate } from '../lib/formatDateTime';
import { Card } from './Card';
import { LoadErrorAlert } from './LoadErrorAlert';
import { LoadingRows } from './LoadingRows';

const STATUS_TONE: Record<ArtifactCampaign['status'], BadgeTone> = {
  ACTIVE: 'info',
  INACTIVE: 'neutral',
};

const HEAD_CELL = 'h-10 px-4 text-left text-xs font-medium whitespace-nowrap text-fg-muted';
const CELL = 'h-12 px-4 font-mono text-xs whitespace-nowrap text-fg';

type ArtifactCampaignsCardProps = {
  model: string;
  version: string;
};

export function ArtifactCampaignsCard({ model, version }: ArtifactCampaignsCardProps) {
  const { data: campaigns, isPending, refetch } = useArtifactCampaigns(model, version);

  function renderContent() {
    if (campaigns === undefined) {
      return isPending ? <LoadingRows /> : <LoadErrorAlert onRetry={() => void refetch()} />;
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
                <td className="h-12 px-4 text-sm whitespace-nowrap text-fg">{campaign.name}</td>
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
