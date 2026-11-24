import { describe, expect, it } from 'vitest';

import { formatByteCount, formatFileSize } from './formatFileSize';

describe('formatFileSize', () => {
  it.each([
    [0, '0 B'],
    [1023, '1023 B'],
    [1536, '1.5 KB'],
    [1_048_575, '1.0 MB'],
    [20_971_520, '20.0 MB'],
    [132_644_864, '126.5 MB'],
    [1_073_741_824, '1.0 GB'],
  ])('%d 바이트는 %s', (bytes, expected) => {
    expect(formatFileSize(bytes)).toBe(expected);
  });
});

describe('formatByteCount', () => {
  it('세 자리마다 쉼표를 넣는다', () => {
    expect(formatByteCount(20_971_520)).toBe('20,971,520 bytes');
  });
});
