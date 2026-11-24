import { cn } from '@/shared/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

/** md: 글자 버튼, icon: 아이콘만 있거나 페이지 번호처럼 정사각형인 버튼 */
export type ButtonSize = 'md' | 'icon';

// enabled: 는 <a> 에 맞지 않아서 not-disabled: 로 비활성 버튼의 hover 만 뺀다
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-fg-inverse not-disabled:hover:bg-nav-active',
  secondary: 'border border-line bg-surface text-fg not-disabled:hover:bg-subtle',
  danger: 'bg-danger text-fg-inverse not-disabled:hover:bg-danger/90',
  ghost: 'text-primary not-disabled:hover:bg-primary-soft',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  md: 'h-10 px-4',
  icon: 'size-10',
};

type ButtonClassNameOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/** 링크를 버튼 모양으로 그릴 때도 같은 클래스를 쓰도록 따로 둔다 */
export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonClassNameOptions = {}): string {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    className,
  );
}
