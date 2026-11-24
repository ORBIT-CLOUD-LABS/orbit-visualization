/// <reference types="node" />
import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { cn, THEME_COLORS, THEME_RADII, THEME_TEXT_SIZES } from './cn';

// Vitest 는 CSS import 를 빈 문자열로 바꾸므로 파일을 직접 읽는다. 경로는 저장소 최상위 기준
const stylesheet = readFileSync('src/app/styles/index.css', 'utf8');

function themeTokens(prefix: string): string[] {
  const pattern = new RegExp(`--${prefix}-([a-z0-9-]+):`, 'g');
  return [...stylesheet.matchAll(pattern)]
    .map((match) => match[1] ?? '')
    .filter((name) => !name.endsWith('-line-height'));
}

describe('cn', () => {
  it('조건부 클래스를 합친다', () => {
    const isActive = false;

    expect(cn('px-4', isActive && 'bg-primary', ['py-2'])).toBe('px-4 py-2');
  });

  it('글자 크기 토큰과 글자 색 토큰을 둘 다 남긴다', () => {
    expect(cn('text-md', 'text-fg')).toBe('text-md text-fg');
    expect(cn('text-2xs', 'text-fg-muted')).toBe('text-2xs text-fg-muted');
    expect(cn('text-base', 'text-nav-active')).toBe('text-base text-nav-active');
  });

  it('같은 종류의 토큰은 뒤의 것만 남긴다', () => {
    expect(cn('text-sm', 'text-md')).toBe('text-md');
    expect(cn('text-fg', 'text-primary')).toBe('text-primary');
    expect(cn('bg-surface', 'bg-danger-soft')).toBe('bg-danger-soft');
    expect(cn('rounded-md', 'rounded-full')).toBe('rounded-full');
  });

  it('index.css 의 토큰 이름과 같은 목록을 쓴다', () => {
    expect(themeTokens('color')).toEqual([...THEME_COLORS]);
    expect(themeTokens('text')).toEqual([...THEME_TEXT_SIZES]);
    expect(themeTokens('radius')).toEqual([...THEME_RADII]);
  });
});
