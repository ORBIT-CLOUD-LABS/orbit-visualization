import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
  it('라벨로 입력 칸을 찾고 값을 입력할 수 있다', async () => {
    const user = userEvent.setup();
    render(<Input label="관리자 토큰" />);

    const input = screen.getByRole('textbox', { name: '관리자 토큰' });
    await user.type(input, 'secret');

    expect(input).toHaveValue('secret');
  });

  it('필수 입력이면 required 로 표시한다', () => {
    render(<Input label="버전" required />);

    expect(screen.getByRole('textbox', { name: '버전' })).toBeRequired();
  });

  it('도움말을 입력 칸 설명으로 연결한다', () => {
    render(<Input label="버전" help="예: 1.2.0" />);

    const input = screen.getByRole('textbox', { name: '버전' });
    expect(input).toHaveAccessibleDescription('예: 1.2.0');
    expect(input).not.toBeInvalid();
  });

  it('오류가 있으면 도움말 대신 오류를 설명으로 보여 주고 invalid 로 표시한다', () => {
    render(<Input label="버전" help="예: 1.2.0" error="버전 형식이 맞지 않습니다" />);

    const input = screen.getByRole('textbox', { name: '버전' });
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription('버전 형식이 맞지 않습니다');
    expect(screen.queryByText('예: 1.2.0')).not.toBeInTheDocument();
  });

  it('밖에서 넘긴 aria-describedby 와 오류 문구를 함께 연결한다', () => {
    render(
      <>
        <p id="token-hint">브라우저에만 저장됩니다</p>
        <Input label="토큰" aria-describedby="token-hint" error="토큰을 입력하세요" />
      </>,
    );

    expect(screen.getByRole('textbox', { name: '토큰' })).toHaveAccessibleDescription(
      '브라우저에만 저장됩니다 토큰을 입력하세요',
    );
  });
});
