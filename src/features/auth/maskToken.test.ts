import { describe, expect, it } from 'vitest';

import { maskToken } from './maskToken';

describe('maskToken', () => {
  it('가운데를 가리고 끝 4자리만 보여 준다', () => {
    expect(maskToken('orbit-admin-token-3f9a')).toBe('Bearer ••••••••3f9a');
  });

  it('짧은 토큰은 모두 가린다', () => {
    expect(maskToken('abcdefgh-1234-5')).toBe('Bearer ••••••••');
  });
});
