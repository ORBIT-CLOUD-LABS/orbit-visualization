import { Badge } from '@/shared/ui/Badge';

import type { UpdateResult } from './updateResult';

type VehicleResultBadgeProps = {
  result: UpdateResult | null;
};

/** 차량의 최근 업데이트 결과. 결과가 없으면 "결과 없음" */
export function VehicleResultBadge({ result }: VehicleResultBadgeProps) {
  if (result === 'SUCCEEDED') {
    return <Badge tone="success">SUCCEEDED</Badge>;
  }
  if (result === 'FAILED') {
    return <Badge tone="failed">FAILED</Badge>;
  }
  return <Badge tone="neutral">결과 없음</Badge>;
}
