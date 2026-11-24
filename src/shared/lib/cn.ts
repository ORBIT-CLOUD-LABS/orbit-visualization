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

// 기본 설정은 `text-md`(크기)와 `text-fg`(색)를 구분하지 못해 하나를 지운다. 토큰 이름을 알려 준다
const twMerge = extendTailwindMerge({
  override: {
    theme: {
      color: [...THEME_COLORS],
      text: [...THEME_TEXT_SIZES],
      radius: [...THEME_RADII],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
