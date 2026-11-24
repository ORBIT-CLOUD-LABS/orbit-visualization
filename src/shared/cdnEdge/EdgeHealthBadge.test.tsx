import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EdgeHealthBadge } from './EdgeHealthBadge';

describe('EdgeHealthBadge', () => {
  it.each([
    [true, '정상'],
    [false, '장애'],
  ])('healthy 가 %s 면 %s 를 보여 준다', (healthy, label) => {
    render(<EdgeHealthBadge healthy={healthy} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
