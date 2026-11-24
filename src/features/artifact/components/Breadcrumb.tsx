import { Link } from 'react-router';

import { ROUTES } from '@/shared/config/routes';

type BreadcrumbProps = {
  /** 지금 화면 이름 */
  current: string;
};

export function Breadcrumb({ current }: BreadcrumbProps) {
  return (
    <nav aria-label="위치">
      <ol className="flex items-center gap-1.5 text-xs text-fg-muted">
        <li>
          <Link to={ROUTES.artifacts} className="hover:text-fg">
            파일
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-fg">
          {current}
        </li>
      </ol>
    </nav>
  );
}
