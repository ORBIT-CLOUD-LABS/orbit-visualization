import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { SseConnectionStatus } from '@/shared/api/sseClient';

import { LiveConnectionStatus } from './LiveConnectionStatus';

describe('LiveConnectionStatus', () => {
  it.each<[SseConnectionStatus, string]>([
    ['connecting', '연결 중'],
    ['connected', '실시간 연결됨'],
    ['reconnecting', '재연결 중'],
    ['disconnected', '실시간 연결 끊김'],
  ])('%s 상태면 "%s" 를 보여 준다', (status, label) => {
    render(<LiveConnectionStatus status={status} lastUpdatedAt={null} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('마지막 갱신 시각을 HH:mm:ss 로 보여 준다', () => {
    const lastUpdatedAt = new Date(2026, 10, 24, 10, 0, 31).getTime();

    render(<LiveConnectionStatus status="connected" lastUpdatedAt={lastUpdatedAt} />);

    expect(screen.getByText('10:00:31')).toBeInTheDocument();
  });

  it('아직 받은 데이터가 없으면 마지막 갱신을 — 로 보여 준다', () => {
    render(<LiveConnectionStatus status="connecting" lastUpdatedAt={null} />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
