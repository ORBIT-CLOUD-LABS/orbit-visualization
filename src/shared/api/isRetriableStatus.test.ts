import { describe, expect, it } from 'vitest';

import { isRetriableStatus } from './isRetriableStatus';

describe('isRetriableStatus', () => {
  it.each([408, 429, 500, 502, 503])('%i 은 다시 시도한다', (status) => {
    expect(isRetriableStatus(status)).toBe(true);
  });

  it.each([204, 400, 401, 403, 404, 409])('%i 은 다시 시도하지 않는다', (status) => {
    expect(isRetriableStatus(status)).toBe(false);
  });
});
