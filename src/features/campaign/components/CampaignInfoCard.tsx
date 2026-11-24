import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { routePaths } from '@/shared/config/routes';
import { buttonClassName } from '@/shared/ui/buttonClassName';

import type { CampaignDetail } from '../api/campaignSchemas';
import { formatTargetList, formatVersionRange } from '../lib/formatTarget';
import { formatUtcDateTime } from '../lib/formatUtc';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { KeyValue } from './KeyValue';

type CampaignInfoCardProps = {
  campaign: CampaignDetail;
  /** 제목 오른쪽에 더 둘 동작. 예: 비활성화 버튼 */
  action?: ReactNode;
};

export function CampaignInfoCard({ campaign, action }: CampaignInfoCardProps) {
  const { target } = campaign;

  return (
    <section
      aria-label="캠페인 정보"
      className="flex flex-col gap-5 rounded-xl border border-line bg-surface p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold text-fg">{campaign.name}</h2>
          <span className="font-mono text-base text-fg-muted">#{campaign.campaignId}</span>
          <CampaignStatusBadge status={campaign.status} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={routePaths.artifactDetail(campaign.artifactId)}
            className={buttonClassName({ variant: 'secondary' })}
          >
            파일 #{campaign.artifactId} 보기
          </Link>
          {action}
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">
        <KeyValue label="배포 파일">
          #{campaign.artifactId} · {target.model} {campaign.targetVersion}
        </KeyValue>
        <KeyValue label="목표 버전">{campaign.targetVersion}</KeyValue>
        <KeyValue label="차종">{target.model}</KeyValue>
        <KeyValue label="HW 버전">{formatTargetList(target.hwVersions)}</KeyValue>
        <KeyValue label="지역">{formatTargetList(target.regions)}</KeyValue>
        <KeyValue label="현재 버전 범위">
          {formatVersionRange(target.currentVersionMin, target.currentVersionMax)}
        </KeyValue>
        <KeyValue label="적용 기간">
          {formatUtcDateTime(campaign.startAt)} ~ {formatUtcDateTime(campaign.endAt)} (UTC)
        </KeyValue>
        <KeyValue label="등록 일시">{formatUtcDateTime(campaign.createdAt)}</KeyValue>
      </dl>
    </section>
  );
}
