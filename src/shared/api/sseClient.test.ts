import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/mocks/server';
import { tokenStorage } from '@/shared/auth/tokenStorage';
import { onUnauthorized } from '@/shared/auth/unauthorized';

import {
  sseClient,
  type SseConnection,
  type SseConnectionStatus,
  type SseMessage,
} from './sseClient';

const STREAM_URL = '/api/v1/test/stream';

// 서버처럼 keep-alive 주석부터 보낸 뒤 이벤트를 보내고, keepOpen 이 아니면 스트림을 닫는다.
// 본문이 비어 있으면 MSW 가 응답을 넘기지 않아 첫 조각이 필요하다
function sseResponse(chunks: string[], { keepOpen = false } = {}) {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      [': keep-alive\n\n', ...chunks].forEach((chunk) => {
        controller.enqueue(encoder.encode(chunk));
      });
      if (!keepOpen) {
        controller.close();
      }
    },
  });
  return new HttpResponse(body, { headers: { 'Content-Type': 'text/event-stream' } });
}

describe('sseClient', () => {
  let connection: SseConnection | undefined;
  let unsubscribe: (() => void) | undefined;

  beforeEach(() => {
    tokenStorage.set('admin-token');
  });

  afterEach(() => {
    connection?.close();
    unsubscribe?.();
  });

  function connect(onMessage?: (message: SseMessage) => void) {
    const statuses: SseConnectionStatus[] = [];
    const messages: SseMessage[] = [];
    connection = sseClient.connect({
      path: '/test/stream',
      retryDelayMs: 0,
      onMessage: onMessage ?? ((message) => messages.push(message)),
      onStatusChange: (status) => statuses.push(status),
    });
    return { statuses, messages };
  }

  it('토큰을 Authorization 헤더로 보내고 받은 이벤트를 넘긴다', async () => {
    let authorization: string | null = null;
    server.use(
      http.get(STREAM_URL, ({ request }) => {
        authorization = request.headers.get('Authorization');
        return sseResponse(
          ['event: vehicles\nid: 2026-11-24T00:00:00Z\ndata: [{"vehicleId":"v1"}]\n\n'],
          {
            keepOpen: true,
          },
        );
      }),
    );

    const { statuses, messages } = connect();

    await vi.waitFor(() => {
      expect(messages).toEqual([
        { event: 'vehicles', id: '2026-11-24T00:00:00Z', data: '[{"vehicleId":"v1"}]' },
      ]);
    });
    expect(authorization).toBe('Bearer admin-token');
    expect(statuses).toEqual(['connecting', 'connected']);
  });

  it('서버가 연결을 닫으면 마지막 이벤트 id 를 Last-Event-ID 로 보내 다시 연결한다', async () => {
    const lastEventIds: (string | null)[] = [];
    server.use(
      http.get(STREAM_URL, ({ request }) => {
        lastEventIds.push(request.headers.get('Last-Event-ID'));
        if (lastEventIds.length === 1) {
          return sseResponse(['event: vehicles\nid: t1\ndata: []\n\n']);
        }
        return sseResponse([], { keepOpen: true });
      }),
    );

    const { statuses } = connect();

    await vi.waitFor(() => {
      expect(statuses).toEqual(['connecting', 'connected', 'reconnecting', 'connected']);
    });
    expect(lastEventIds).toEqual([null, 't1']);
  });

  it('재연결이 3회 연속 실패하면 끊김으로 바꾸고 더 시도하지 않는다', async () => {
    let requestCount = 0;
    server.use(
      http.get(STREAM_URL, () => {
        requestCount += 1;
        return new HttpResponse(null, { status: 503 });
      }),
    );

    const { statuses } = connect();

    await vi.waitFor(() => {
      expect(statuses).toEqual(['connecting', 'reconnecting', 'disconnected']);
    });
    expect(requestCount).toBe(4);
  });

  it('끊긴 뒤 reconnect 하면 다시 연결한다', async () => {
    let isServerUp = false;
    server.use(
      http.get(STREAM_URL, () =>
        isServerUp ? sseResponse([], { keepOpen: true }) : HttpResponse.error(),
      ),
    );
    const { statuses } = connect();
    await vi.waitFor(() => {
      expect(statuses.at(-1)).toBe('disconnected');
    });

    isServerUp = true;
    connection?.reconnect();

    await vi.waitFor(() => {
      expect(statuses.slice(-2)).toEqual(['connecting', 'connected']);
    });
  });

  it('401 이면 토큰을 지우고 알린 뒤 재연결하지 않는다', async () => {
    tokenStorage.set('expired-token');
    const listener = vi.fn();
    unsubscribe = onUnauthorized(listener);
    let requestCount = 0;
    server.use(
      http.get(STREAM_URL, () => {
        requestCount += 1;
        return HttpResponse.json(
          {
            isSuccess: false,
            code: 'AUTHENTICATION_REQUIRED',
            message: '',
            data: null,
            error: null,
          },
          { status: 401 },
        );
      }),
    );

    const { statuses } = connect();

    await vi.waitFor(() => {
      expect(statuses).toEqual(['connecting', 'disconnected']);
    });
    expect(listener).toHaveBeenCalledOnce();
    expect(tokenStorage.get()).toBeNull();
    expect(requestCount).toBe(1);
  });

  it('재연결할 때 그 사이 바뀐 토큰을 보낸다', async () => {
    const authorizations: (string | null)[] = [];
    server.use(
      http.get(STREAM_URL, ({ request }) => {
        authorizations.push(request.headers.get('Authorization'));
        if (authorizations.length === 1) {
          tokenStorage.set('new-token');
          return new HttpResponse(null, { status: 503 });
        }
        return sseResponse([], { keepOpen: true });
      }),
    );

    const { statuses } = connect();

    await vi.waitFor(() => {
      expect(statuses.at(-1)).toBe('connected');
    });
    expect(authorizations).toEqual(['Bearer admin-token', 'Bearer new-token']);
  });

  describe('연결 응답 시간 제한', () => {
    const CONNECT_TIMEOUT_MS = 10_000;

    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    // 응답 헤더를 보내지 않고 멈춘 서버처럼, 요청이 끊길 때까지 응답하지 않는다
    function stubHangingFetch() {
      return vi.spyOn(window, 'fetch').mockImplementation(
        (_input, init) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              reject(init.signal?.reason);
            });
          }),
      );
    }

    // 끊긴 요청이 onerror 를 거쳐 재시도 타이머를 걸기까지 마이크로태스크를 여러 번 거친다.
    // 그래서 시간을 넘긴 뒤 재시도 타이머가 걸릴 때까지 0ms 씩 더 넘기며 기다린다
    async function waitForRetry(fetchSpy: ReturnType<typeof stubHangingFetch>, calls: number) {
      await vi.waitFor(async () => {
        await vi.advanceTimersByTimeAsync(0);
        expect(fetchSpy).toHaveBeenCalledTimes(calls);
      });
    }

    it('응답이 오지 않으면 제한 시간 뒤 요청을 끊고 재연결한다', async () => {
      const fetchSpy = stubHangingFetch();
      const { statuses } = connect();

      await vi.advanceTimersByTimeAsync(CONNECT_TIMEOUT_MS - 1);
      expect(statuses).toEqual(['connecting']);

      await vi.advanceTimersByTimeAsync(1);
      await waitForRetry(fetchSpy, 2);
      expect(statuses).toEqual(['connecting', 'reconnecting']);
    });

    it('재연결도 응답이 없으면 3회 뒤 끊김으로 바꾼다', async () => {
      const fetchSpy = stubHangingFetch();
      const { statuses } = connect();

      for (const calls of [2, 3, 4]) {
        await vi.advanceTimersByTimeAsync(CONNECT_TIMEOUT_MS);
        await waitForRetry(fetchSpy, calls);
      }
      await vi.advanceTimersByTimeAsync(CONNECT_TIMEOUT_MS);

      await vi.waitFor(() => {
        expect(statuses).toEqual(['connecting', 'reconnecting', 'disconnected']);
      });
      expect(fetchSpy).toHaveBeenCalledTimes(4);
    });

    it('연결된 뒤에는 이벤트가 없어도 끊지 않는다', async () => {
      let requestCount = 0;
      server.use(
        http.get(STREAM_URL, () => {
          requestCount += 1;
          return sseResponse([], { keepOpen: true });
        }),
      );
      const { statuses } = connect();
      await vi.waitFor(() => {
        expect(statuses).toEqual(['connecting', 'connected']);
      });

      await vi.advanceTimersByTimeAsync(CONNECT_TIMEOUT_MS * 2);

      expect(statuses).toEqual(['connecting', 'connected']);
      expect(requestCount).toBe(1);
    });
  });

  it('받는 쪽이 이벤트 처리 중 오류를 내도 연결을 유지한다', async () => {
    const reportedErrors: unknown[] = [];
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      reportedErrors.push(event.error);
    };
    window.addEventListener('error', handleError);
    server.use(
      http.get(STREAM_URL, () =>
        sseResponse(['event: vehicles\ndata: {broken\n\n'], { keepOpen: true }),
      ),
    );

    const { statuses } = connect(() => {
      throw new Error('파싱 실패');
    });

    await vi.waitFor(() => {
      expect(reportedErrors).toHaveLength(1);
    });
    window.removeEventListener('error', handleError);
    expect(statuses).toEqual(['connecting', 'connected']);
  });
});
