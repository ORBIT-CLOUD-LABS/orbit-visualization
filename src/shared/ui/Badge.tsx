import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import { TONE_CLASS, type Tone } from './toneClass';

export type BadgeTone =
  'success' | 'failed' | 'pending' | 'info' | 'neutral' | 'healthy' | 'unhealthy';

const BADGE_TONE: Record<BadgeTone, Tone> = {
  success: 'success',
  failed: 'danger',
  pending: 'warning',
  info: 'info',
  neutral: 'neutral',
  healthy: 'success',
  unhealthy: 'danger',
};

type BadgeProps = {
  tone: BadgeTone;
  /** 색만으로 상태를 전하지 않도록 글자는 항상 받는다 */
  children: ReactNode;
  className?: string;
};

export function Badge({ tone, children, className }: BadgeProps) {
  const toneClass = TONE_CLASS[BADGE_TONE[tone]];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        toneClass.surface,
        className,
      )}
    >
      <span aria-hidden="true" className={cn('size-1.5 shrink-0 rounded-full', toneClass.dot)} />
      {children}
    </span>
  );
}
