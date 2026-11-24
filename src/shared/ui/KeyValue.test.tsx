import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EMPTY_VALUE } from './emptyValue';
import { KeyValue } from './KeyValue';

describe('KeyValue', () => {
  it('이름과 값을 정의 목록 한 칸으로 그린다', () => {
    render(
      <dl>
        <KeyValue label="차종">EV6</KeyValue>
      </dl>,
    );

    expect(screen.getByRole('term')).toHaveTextContent('차종');
    expect(screen.getByRole('definition')).toHaveTextContent('EV6');
  });

  it('값이 없으면 빈 값 기호를 보여 준다', () => {
    render(
      <dl>
        <KeyValue label="배정 Edge">{null}</KeyValue>
      </dl>,
    );

    expect(screen.getByRole('definition')).toHaveTextContent(EMPTY_VALUE);
  });
});
