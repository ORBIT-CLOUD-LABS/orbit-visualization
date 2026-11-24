import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SkeletonRow } from './SkeletonRow';

describe('SkeletonRow', () => {
  it('화면 읽기 도구에는 숨긴다', () => {
    const { container } = render(<SkeletonRow />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});
