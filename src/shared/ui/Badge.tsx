import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export type BadgeTone =
  'success' | 'failed' | 'pending' | 'info' | 'neutral' | 'healthy' | 'unhealthy';

const TONE_CLASS: Record<BadgeTone, { badge: string; dot: string }> = {
  success: { badge: 'bg-success-soft text-success', dot: 'bg-success' },
  failed: { badge: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  pending: { badge: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  info: { badge: 'bg-info-soft text-info', dot: 'bg-info' },
  neutral: { badge: 'bg-muted text-neutral', dot: 'bg-neutral' },
  healthy: { badge: 'bg-success-soft text-success', dot: 'bg-success' },
  unhealthy: { badge: 'bg-danger-soft text-danger', dot: 'bg-danger' },
};

type BadgeProps = {
  tone: BadgeTone;
  /** 색만으로 상태를 전하지 않도록 글자는 항상 받는다 */
  children: ReactNode;
  className?: string;
};

export function Badge({ tone, children, className }: BadgeProps) {
  const toneClass = TONE_CLASS[tone];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        toneClass.badge,
        className,
      )}
    >
      <span aria-hidden="true" className={cn('size-1.5 shrink-0 rounded-full', toneClass.dot)} />
      {children}
    </span>
  );
}
