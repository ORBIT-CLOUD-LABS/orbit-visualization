import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('누르면 onClick 을 부른다', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>저장</Button>);

    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('form 안에서 type 을 주지 않으면 제출하지 않는다', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <Button>취소</Button>
      </form>,
    );

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('비활성화되면 누를 수 없다', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button variant="danger" disabled onClick={handleClick}>
        비활성화
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: '비활성화' }));

    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: '비활성화' })).toBeDisabled();
  });

  it('아이콘 버튼은 aria-label 을 이름으로 쓴다', () => {
    render(
      <Button size="icon" variant="ghost" aria-label="새로고침">
        <svg aria-hidden="true" />
      </Button>,
    );

    expect(screen.getByRole('button', { name: '새로고침' })).toBeInTheDocument();
  });
});
