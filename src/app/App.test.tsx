import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from './App';

describe('App', () => {
  it('토큰이 없으면 첫 화면 대신 로그인 화면을 보여 준다', async () => {
    render(<App />);

    expect(await screen.findByRole('heading', { name: '로그인' })).toBeInTheDocument();
  });
});
