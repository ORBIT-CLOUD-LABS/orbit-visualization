import { useState } from 'react';

import { formatPageSummary } from '@/shared/lib/formatPageSummary';
import { usePagination } from '@/shared/lib/usePagination';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Pagination } from '@/shared/ui/Pagination';

import { CAMPAIGN_STATUSES, type CampaignSummary } from '../api/campaignSchemas';
import { CampaignTable } from './CampaignTable';
import { ALL, FilterSelect } from './FilterSelect';
import { RegisterCampaignLink } from './RegisterCampaignLink';

export const LIST_TITLE = '캠페인 목록';
export const LIST_DESCRIPTION = '등록일 내림차순';

type CampaignListCardProps = {
  campaigns: readonly CampaignSummary[];
};

export function CampaignListCard({ campaigns }: CampaignListCardProps) {
  const [status, setStatus] = useState(ALL);
  const [selectedModel, setModel] = useState(ALL);
  const models = [...new Set(campaigns.map((campaign) => campaign.model))].toSorted();
  // 다시 불러온 목록에 고른 차종이 없으면 전체로 본다
  const model = models.includes(selectedModel) ? selectedModel : ALL;
  const filtered = campaigns.filter(
    (campaign) =>
      (status === ALL || campaign.status === status) && (model === ALL || campaign.model === model),
  );
  const pagination = usePagination(filtered, { resetDeps: [status, model] });

  return (
    <Card
      title={LIST_TITLE}
      description={LIST_DESCRIPTION}
      action={
        <>
          <FilterSelect
            label="상태"
            value={status}
            options={CAMPAIGN_STATUSES}
            onChange={setStatus}
          />
          <FilterSelect label="차종" value={model} options={models} onChange={setModel} />
          <RegisterCampaignLink>+ 캠페인 등록</RegisterCampaignLink>
        </>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState
          title="조건에 맞는 캠페인이 없습니다"
          description="상태·차종 필터를 바꾸거나 새 캠페인을 등록하세요"
        />
      ) : (
        <>
          <CampaignTable campaigns={pagination.pageItems} />
          <Pagination
            page={pagination.page}
            pageCount={pagination.pageCount}
            onPageChange={pagination.setPage}
            summary={formatPageSummary(pagination, '개')}
          />
        </>
      )}
    </Card>
  );
}
