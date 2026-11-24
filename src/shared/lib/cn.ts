import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// src/app/styles/index.css 의 @theme 토큰 이름. 토큰을 바꾸면 여기도 같이 바꾼다 (cn.test.ts 가 검사한다)
export const THEME_COLORS = [
  'canvas',
  'surface',
  'subtle',
  'muted',
  'map',
  'inverse',
  'sidebar',
  'nav-active',
  'note',
  'fg',
  'fg-muted',
  'fg-inverse',
  'nav',
  'nav-muted',
  'code',
  'line',
  'line-note',
  'line-danger',
  'primary',
  'primary-soft',
  'accent',
  'accent-soft',
  'success',
  'success-soft',
  'danger',
  'danger-soft',
  'warning',
  'warning-soft',
  'info',
  'info-soft',
  'neutral',
] as const;

export const THEME_TEXT_SIZES = [
  '2xs',
  'xs',
  'sm',
  'base',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
] as const;

export const THEME_RADII = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] as const;

// @theme 과 상관없이 Tailwind 가 늘 제공하는 색 키워드
const BUILTIN_COLORS = ['transparent', 'current', 'inherit'] as const;

// 기본 설정은 글자 크기·색 이름을 모양으로 추측한다. 토큰 이름을 직접 알려 `text-md` 와 `text-fg` 를 따로 다룬다
const twMerge = extendTailwindMerge({
  override: {
    theme: {
      color: [...THEME_COLORS, ...BUILTIN_COLORS],
      text: [...THEME_TEXT_SIZES],
      radius: [...THEME_RADII],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
