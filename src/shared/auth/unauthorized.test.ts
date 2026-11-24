import { afterEach, describe, expect, it, vi } from 'vitest';

import { tokenStorage } from './tokenStorage';
import { onUnauthorized, reportUnauthorized } from './unauthorized';

describe('reportUnauthorized', () => {
  let unsubscribe: (() => void) | undefined;

  afterEach(() => {
    unsubscribe?.();
  });

  it('토큰을 지우고 등록된 함수에 알린다', () => {
    tokenStorage.set('admin-token');
    const listener = vi.fn();
    unsubscribe = onUnauthorized(listener);

    reportUnauthorized();

    expect(tokenStorage.get()).toBeNull();
    expect(listener).toHaveBeenCalledOnce();
  });

  it('동시에 여러 번 불려도 한 번만 알린다', () => {
    tokenStorage.set('admin-token');
    const listener = vi.fn();
    unsubscribe = onUnauthorized(listener);

    reportUnauthorized();
    reportUnauthorized();

    expect(listener).toHaveBeenCalledOnce();
  });

  it('등록을 풀면 알리지 않는다', () => {
    tokenStorage.set('admin-token');
    const listener = vi.fn();
    onUnauthorized(listener)();

    reportUnauthorized();

    expect(listener).not.toHaveBeenCalled();
  });
});
