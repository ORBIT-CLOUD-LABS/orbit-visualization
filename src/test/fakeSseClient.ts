import { act } from '@testing-library/react';
import { vi, type Mock } from 'vitest';

import {
  sseClient,
  type SseConnectionStatus,
  type SseConnectOptions,
} from '@/shared/api/sseClient';

export type FakeSseClient = {
  /** 마지막으로 연 연결의 옵션. 아직 열지 않았으면 null */
  lastOptions: () => SseConnectOptions | null;
  /** 서버가 이벤트를 보낸 것처럼 onMessage 를 부른다. data 는 JSON 으로 바꿔 넘긴다 */
  emit: (event: string, data: unknown) => void;
  /** 연결 상태가 바뀐 것처럼 onStatusChange 를 부른다 */
  setStatus: (status: SseConnectionStatus) => void;
  reconnect: Mock<() => void>;
  close: Mock<() => void>;
};

/**
 * sseClient.connect 를 가짜로 바꾼다. 실제 스트림 없이 이벤트와 연결 상태를 테스트에서 직접 만든다.
 * vitest 의 restoreMocks 설정으로 테스트가 끝나면 원래대로 돌아간다.
 */
export function fakeSseClient(): FakeSseClient {
  let options: SseConnectOptions | null = null;
  const reconnect = vi.fn<() => void>();
  const close = vi.fn<() => void>();

  vi.spyOn(sseClient, 'connect').mockImplementation((next) => {
    options = next;
    next.onStatusChange?.('connecting');
    return { reconnect, close };
  });

  function requireOptions(): SseConnectOptions {
    if (options === null) {
      throw new Error('SSE 가 아직 연결되지 않았습니다');
    }
    return options;
  }

  return {
    lastOptions: () => options,
    emit: (event, data) => {
      const { onMessage } = requireOptions();
      act(() => {
        onMessage({ event, id: '', data: JSON.stringify(data) });
      });
    },
    setStatus: (status) => {
      const { onStatusChange } = requireOptions();
      act(() => {
        onStatusChange?.(status);
      });
    },
    reconnect,
    close,
  };
}
