export type Tone = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

/** 상태색 배경·글자(surface)와 점(dot) 클래스. Badge·Alert 가 함께 쓴다 */
export const TONE_CLASS: Record<Tone, { surface: string; dot: string }> = {
  success: { surface: 'bg-success-soft text-success', dot: 'bg-success' },
  danger: { surface: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  warning: { surface: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  info: { surface: 'bg-info-soft text-info', dot: 'bg-info' },
  neutral: { surface: 'bg-muted text-neutral', dot: 'bg-neutral' },
};
