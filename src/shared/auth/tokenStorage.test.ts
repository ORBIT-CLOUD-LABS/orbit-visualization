import { describe, expect, it, vi } from 'vitest';

import { tokenStorage } from './tokenStorage';

describe('tokenStorage', () => {
  it('저장한 토큰을 돌려준다', () => {
    tokenStorage.set('admin-token-123');

    expect(tokenStorage.get()).toBe('admin-token-123');
  });

  it('저장된 토큰이 없으면 null 을 돌려준다', () => {
    expect(tokenStorage.get()).toBeNull();
  });

  it('지우면 null 을 돌려준다', () => {
    tokenStorage.set('admin-token-123');

    tokenStorage.clear();

    expect(tokenStorage.get()).toBeNull();
  });

  it.each(['', 'has space', 'line\nbreak', '한글토큰'])(
    '저장소 값이 %j 처럼 형식이 다르면 지우고 null 을 돌려준다',
    (value) => {
      sessionStorage.setItem('orbit.adminToken', value);

      expect(tokenStorage.get()).toBeNull();
      expect(sessionStorage.getItem('orbit.adminToken')).toBeNull();
    },
  );

  it('브라우저가 저장소 접근을 막으면 null 을 돌려준다', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });

    expect(tokenStorage.get()).toBeNull();
  });

  it('형식이 다른 토큰은 저장하지 않고 오류를 던진다', () => {
    expect(() => tokenStorage.set('has space')).toThrow('관리자 토큰 형식');
    expect(tokenStorage.get()).toBeNull();
  });
});
