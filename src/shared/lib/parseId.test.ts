import { describe, expect, it } from 'vitest';

import { parseId } from './parseId';

describe('parseId', () => {
  it('양의 정수 문자열을 숫자로 읽는다', () => {
    expect(parseId('1')).toBe(1);
    expect(parseId('42')).toBe(42);
  });

  it.each([undefined, null, '', '0', '-1', '01', '1.5', 'abc', '9007199254740993'])(
    '%s 는 null 을 돌려준다',
    (value) => {
      expect(parseId(value)).toBeNull();
    },
  );
});
