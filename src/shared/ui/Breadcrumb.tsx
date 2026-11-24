import { Link } from 'react-router';

import { cn } from '@/shared/lib/cn';

type BreadcrumbParent = {
  label: string;
  /** 돌아갈 화면 경로 */
  to: string;
};

type BreadcrumbProps = {
  parent: BreadcrumbParent;
  /** 지금 화면 이름 */
  current: string;
  /** 지금 화면 이름이 vehicleId 같은 식별자면 true. 고정폭 글꼴로 그리고 길면 줄을 바꾼다 */
  isCurrentMono?: boolean;
};

/** 위 화면으로 돌아가는 링크와 지금 화면 이름 */
export function Breadcrumb({ parent, current, isCurrentMono = false }: BreadcrumbProps) {
  return (
    <nav aria-label="위치">
      <ol className="flex items-center gap-1.5 text-xs text-fg-muted">
        <li>
          <Link to={parent.to} className="hover:text-fg">
            {parent.label}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className={cn('text-fg', isCurrentMono && 'font-mono break-all')}>
          {current}
        </li>
      </ol>
    </nav>
  );
}
