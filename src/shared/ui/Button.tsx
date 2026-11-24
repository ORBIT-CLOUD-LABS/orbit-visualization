import type { ComponentPropsWithRef } from 'react';

import { buttonClassName, type ButtonVariant } from './buttonClassName';

type NativeButtonProps = Omit<ComponentPropsWithRef<'button'>, 'aria-label'>;

/** size="icon" 은 글자가 없을 수 있어 aria-label 을 반드시 받는다 */
export type ButtonProps = NativeButtonProps & {
  variant?: ButtonVariant;
} & ({ size?: 'md'; 'aria-label'?: string } | { size: 'icon'; 'aria-label': string });

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClassName({ variant, size, className })} {...props} />
  );
}
