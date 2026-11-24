import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { getPageItems } from '@/shared/lib/getPageItems';

import { Button } from './Button';

type PaginationProps = {
  /** 1부터 센다 */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** 왼쪽 요약 문구. 예: "128대 중 1–20 · 1 / 7 페이지" */
  summary?: ReactNode;
  className?: string;
};

export function Pagination({ page, pageCount, onPageChange, summary, className }: PaginationProps) {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3', className)}>
      <p className="text-xs text-fg-muted">{summary}</p>
      <nav aria-label="페이지">
        <ul className="flex items-center gap-1">
          <li>
            <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
              이전
            </Button>
          </li>
          {getPageItems(page, pageCount).map((item) =>
            item.type === 'ellipsis' ? (
              <li
                key={`ellipsis-${item.key}`}
                aria-hidden="true"
                className="flex h-10 w-7 items-center justify-center text-base font-medium text-fg"
              >
                …
              </li>
            ) : (
              <li key={item.page}>
                <Button
                  size="icon"
                  variant={item.page === page ? 'primary' : 'ghost'}
                  aria-label={`${item.page} 페이지`}
                  aria-current={item.page === page ? 'page' : undefined}
                  onClick={() => onPageChange(item.page)}
                >
                  {item.page}
                </Button>
              </li>
            ),
          )}
          <li>
            <Button
              variant="secondary"
              disabled={page >= pageCount}
              onClick={() => onPageChange(page + 1)}
            >
              다음
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
