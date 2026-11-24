import { Link } from 'react-router';

import { routePaths } from '@/shared/config/routes';
import { buttonClassName } from '@/shared/ui/buttonClassName';

import type { CampaignSummary } from '../api/campaignSchemas';
import { formatUtcDate } from '../lib/formatUtc';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import {
  TABLE_CELL as CELL,
  TABLE_HEAD_CELL as HEAD_CELL,
  TABLE_TEXT_CELL as TEXT_CELL,
} from './tableClassNames';

const COLUMNS = ['ID', '이름', '차종', '목표 버전', '상태', '적용 기간', '등록일'] as const;

type CampaignTableProps = {
  campaigns: readonly CampaignSummary[];
};

export function CampaignTable({ campaigns }: CampaignTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse">
        <thead className="bg-subtle">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className={HEAD_CELL}>
                {column}
              </th>
            ))}
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
              <td className={TEXT_CELL}>{campaign.model}</td>
              <td className={CELL}>{campaign.targetVersion}</td>
              <td className="h-12 px-4">
                <CampaignStatusBadge status={campaign.status} />
              </td>
              <td className={CELL}>
                {formatUtcDate(campaign.startAt)} ~ {formatUtcDate(campaign.endAt)}
              </td>
              <td className={CELL}>{formatUtcDate(campaign.createdAt)}</td>
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
