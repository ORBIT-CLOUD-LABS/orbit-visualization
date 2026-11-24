import { Badge, type BadgeTone } from '@/shared/ui/Badge';

import type { CampaignStatus } from '../api/campaignSchemas';

const STATUS_TONE: Record<CampaignStatus, BadgeTone> = {
  ACTIVE: 'info',
  INACTIVE: 'neutral',
};

type CampaignStatusBadgeProps = {
  status: CampaignStatus;
};

export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  return <Badge tone={STATUS_TONE[status]}>{status}</Badge>;
}
