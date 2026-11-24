import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

type StatCardProps = {
  label: string;
  value: ReactNode;
  /** 값 아래 보조 문구 */
  sub?: ReactNode;
  className?: string;
};

export function StatCard({ label, value, sub, className }: StatCardProps) {
  return (
    <div
      className={cn('flex flex-col gap-2 rounded-xl border border-line bg-surface p-5', className)}
    >
      <p className="text-xs font-medium text-fg-muted">{label}</p>
      <p className="text-3xl font-bold text-fg">{value}</p>
      {sub !== undefined && <p className="text-xs text-fg-muted">{sub}</p>}
    </div>
  );
}
