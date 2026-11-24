import { Link } from 'react-router';

import { ROUTES } from '@/shared/config/routes';

type VehicleBreadcrumbProps = {
  /** 지금 화면 이름. 보통 vehicleId */
  current: string;
};

/** 대시보드로 돌아가는 링크를 겸한다 */
export function VehicleBreadcrumb({ current }: VehicleBreadcrumbProps) {
  return (
    <nav aria-label="위치">
      <ol className="flex items-center gap-1.5 text-xs text-fg-muted">
        <li>
          <Link to={ROUTES.dashboard} className="hover:text-fg">
            대시보드
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="font-mono break-all text-fg">
          {current}
        </li>
      </ol>
    </nav>
  );
}
