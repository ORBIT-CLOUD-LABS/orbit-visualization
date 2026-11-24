import { describe, expect, it } from 'vitest';

import { edgeHealthLabel } from './edgeHealthLabel';

describe('edgeHealthLabel', () => {
  it('정상 여부를 정상·장애로 쓴다', () => {
    expect(edgeHealthLabel(true)).toBe('정상');
    expect(edgeHealthLabel(false)).toBe('장애');
  });
});
