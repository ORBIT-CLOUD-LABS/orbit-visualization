import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

type EmptyStateProps = {
  title: string;
  description?: string;
  /** 다음 행동 버튼·링크 */
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-50 flex-col items-center justify-center gap-2 rounded-lg bg-subtle p-6 text-center',
        className,
      )}
    >
      <span aria-hidden="true" className="size-10 rounded-lg bg-line" />
      <p className="text-base font-medium text-fg">{title}</p>
      {description !== undefined && <p className="text-xs text-fg-muted">{description}</p>}
      {action !== undefined && <div className="mt-2">{action}</div>}
    </div>
  );
}
