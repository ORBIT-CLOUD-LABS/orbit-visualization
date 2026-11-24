import { Badge } from '@/shared/ui/Badge';

import { edgeHealthLabel } from './edgeHealthLabel';

type EdgeHealthBadgeProps = {
  healthy: boolean;
  className?: string;
};

/** Edge 정상 여부 배지 */
export function EdgeHealthBadge({ healthy, className }: EdgeHealthBadgeProps) {
  return (
    <Badge tone={healthy ? 'healthy' : 'unhealthy'} className={className}>
      {edgeHealthLabel(healthy)}
    </Badge>
  );
}
