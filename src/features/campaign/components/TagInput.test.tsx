import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { TagInput } from './TagInput';

function Harness() {
  const [values, setValues] = useState<string[]>([]);
  return (
    <>
      <TagInput label="지역" values={values} onChange={setValues} />
      <p>값 {values.join(',')}</p>
    </>
  );
}

describe('TagInput', () => {
  it('Enter 로 값을 더하고, 같은 값은 한 번만 넣고, 삭제 버튼으로 뺀다', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByRole('textbox', { name: '지역' });

    await user.type(input, ' KR {Enter}US{Enter}KR{Enter}');
    expect(screen.getByText('값 KR,US')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'KR 삭제' }));
    expect(screen.getByText('값 US')).toBeInTheDocument();
  });

  it('칸을 벗어나면 입력 중인 값을 더한다', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.type(screen.getByRole('textbox', { name: '지역' }), 'KR');
    await user.tab();

    expect(screen.getByText('값 KR')).toBeInTheDocument();
  });

  it('한글 조합 중 Enter 는 값을 더하지 않는다', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByRole('textbox', { name: '지역' });
    await user.type(input, '서울');

    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });

    expect(screen.getByText('값')).toBeInTheDocument();
    expect(input).toHaveValue('서울');
  });
});
