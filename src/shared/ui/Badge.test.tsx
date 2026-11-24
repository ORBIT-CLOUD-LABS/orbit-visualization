import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './Badge';

describe('Badge', () => {
  it('상태를 글자로 보여 준다', () => {
    render(
      <ul>
        <li>
          <Badge tone="failed">FAILED</Badge>
        </li>
        <li>
          <Badge tone="unhealthy">장애</Badge>
        </li>
      </ul>,
    );

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent(/^FAILED$/);
    expect(items[1]).toHaveTextContent(/^장애$/);
  });
});
