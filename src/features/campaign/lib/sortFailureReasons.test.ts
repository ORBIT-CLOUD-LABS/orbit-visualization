import { describe, expect, it } from 'vitest';

import { sortFailureReasons } from './sortFailureReasons';

describe('sortFailureReasons', () => {
  it('건수 내림차순, 같으면 이름 순서로 놓는다', () => {
    expect(
      sortFailureReasons({
        HASH_MISMATCH: 0,
        INSTALL_FAILED: 2,
        SIGNATURE_INVALID: 1,
        DOWNLOAD_FAILED: 2,
      }),
    ).toEqual([
      ['DOWNLOAD_FAILED', 2],
      ['INSTALL_FAILED', 2],
      ['SIGNATURE_INVALID', 1],
      ['HASH_MISMATCH', 0],
    ]);
  });
});
