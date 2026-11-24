import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';

import { config } from '@/config';
import { authorizationHeader } from '@/shared/auth/authorizationHeader';
import { reportUnauthorized } from '@/shared/auth/unauthorized';

import { isRetriableStatus } from './isRetriableStatus';

/** connecting: 첫 연결 중, reconnecting: 끊겨서 다시 연결 중, disconnected: 재연결을 멈춤 */
export type SseConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected';

/** 받은 이벤트. data 는 문자열 그대로라 받는 쪽이 파싱·검증한다 */
export type SseMessage = {
  event: string;
  id: string;
  data: string;
};

export type SseConnectOptions = {
  /** API 기준 주소 뒤에 붙는 경로 (예: `/dashboard/vehicles/stream`) */
  path: string;
  onMessage: (message: SseMessage) => void;
  onStatusChange?: (status: SseConnectionStatus) => void;
  /** 첫 재연결 대기 시간. 다음 재연결부터 두 배씩 늘린다 */
  retryDelayMs?: number;
};

export type SseConnection = {
  /** 연결을 새로 연다. 끊긴(disconnected) 뒤 사용자가 다시 시도할 때 쓴다 */
  reconnect: () => void;
  /** 연결을 닫는다. 구독하는 쪽이 언마운트될 때 부른다 */
  close: () => void;
};

const MAX_RECONNECT_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY_MS = 1000;
// fetch-event-source 가 재시도 때 넣는 헤더 키와 같아야 값이 두 번 들어가지 않는다
const LAST_EVENT_ID_HEADER = 'last-event-id';
const UNAUTHORIZED = 401;
// 응답 헤더가 이 시간 안에 오지 않으면 그 시도를 끊고 재연결한다. 연결된 뒤 조용한 스트림은 끊지 않는다
const CONNECT_TIMEOUT_MS = 10_000;

// onerror 에서 다시 던지면 fetch-event-source 가 재시도를 멈춘다
class StopRetryingError extends Error {
  override readonly name = 'StopRetryingError';
}

// 응답 헤더를 받을 때까지만 시간을 잰다. fetch-event-source 의 signal 과 따로 끊어야 onerror 로 재시도한다
async function fetchWithConnectTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
): Promise<Response> {
  const attempt = new AbortController();
  const timer = window.setTimeout(() => {
    attempt.abort(new Error(`SSE 연결 응답이 ${CONNECT_TIMEOUT_MS}ms 안에 오지 않았습니다`));
  }, CONNECT_TIMEOUT_MS);
  // AbortSignal.any 는 Safari 17.4·Chrome 116 부터라 바깥 signal 의 abort 를 직접 넘긴다.
  // 연결된 뒤에도 바깥 signal 로 스트림을 닫아야 하므로 리스너는 지우지 않는다
  const { signal: outer } = init;
  if (outer) {
    if (outer.aborted) {
      attempt.abort(outer.reason);
    } else {
      outer.addEventListener('abort', () => attempt.abort(outer.reason), { once: true });
    }
  }
  try {
    return await window.fetch(input, { ...init, signal: attempt.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

function connect(options: SseConnectOptions): SseConnection {
  const retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;
  let controller: AbortController | null = null;
  let lastEventId: string | null = null;
  let status: SseConnectionStatus | null = null;

  function setStatus(next: SseConnectionStatus): void {
    if (status !== next) {
      status = next;
      options.onStatusChange?.(next);
    }
  }

  function open(): void {
    controller?.abort();
    const current = new AbortController();
    controller = current;
    let failures = 0;
    setStatus('connecting');

    fetchEventSource(new URL(`${config.apiBaseUrl}${options.path}`, window.location.href).href, {
      signal: current.signal,
      headers: lastEventId === null ? {} : { [LAST_EVENT_ID_HEADER]: lastEventId },
      // 재시도마다 토큰을 새로 읽는다. 401 로 지워졌거나 바뀐 토큰을 그대로 보내지 않는다
      fetch: (input, init) => {
        const authorization = authorizationHeader();
        if (authorization === null) {
          return Promise.reject(
            new StopRetryingError('관리자 토큰이 없어 SSE 를 연결하지 않습니다'),
          );
        }
        const headers = new Headers(init?.headers);
        headers.set('Authorization', authorization);
        return fetchWithConnectTimeout(input, { ...init, headers });
      },
      // 숨은 탭에서도 연결을 유지해 상태 표시와 실제 연결이 어긋나지 않게 한다
      openWhenHidden: true,
      onopen: async (response) => {
        const contentType = response.headers.get('content-type') ?? '';
        if (response.ok && contentType.startsWith(EventStreamContentType)) {
          failures = 0;
          setStatus('connected');
          return;
        }
        await response.body?.cancel();
        if (response.status === UNAUTHORIZED) {
          reportUnauthorized();
        }
        if (!isRetriableStatus(response.status)) {
          throw new StopRetryingError(`SSE 연결이 ${response.status} 로 거절되었습니다`);
        }
        throw new Error(`SSE 연결에 실패했습니다 (${response.status})`);
      },
      onmessage: (message) => {
        if (message.id !== '') {
          lastEventId = message.id;
        }
        // keep-alive 주석 뒤 빈 줄도 빈 메시지로 온다. EventSource 처럼 data 가 없으면 넘기지 않는다
        if (message.data === '') {
          return;
        }
        // 받는 쪽의 파싱 오류가 연결 오류로 번져 재연결되지 않도록 여기서 끊고 전역 오류로 알린다
        try {
          options.onMessage({ event: message.event, id: message.id, data: message.data });
        } catch (error) {
          reportError(error);
        }
      },
      // 서버가 스트림을 닫아도 다시 연결한다
      onclose: () => {
        throw new Error('서버가 SSE 연결을 닫았습니다');
      },
      onerror: (error: unknown) => {
        if (error instanceof StopRetryingError) {
          throw error;
        }
        failures += 1;
        if (failures > MAX_RECONNECT_ATTEMPTS) {
          throw new StopRetryingError('SSE 재연결에 연속으로 실패했습니다', { cause: error });
        }
        setStatus('reconnecting');
        return retryDelayMs * 2 ** (failures - 1);
      },
    }).catch(() => {
      // 재시도를 멈춘 경우만 여기로 온다. 닫거나 새로 연 경우(abort)는 정상 종료다
      if (controller === current) {
        setStatus('disconnected');
      }
    });
  }

  open();

  return {
    reconnect: open,
    close: () => {
      controller?.abort();
      controller = null;
    },
  };
}

/** 관리자 토큰을 Authorization 헤더로 붙이는 SSE 클라이언트. 이벤트 종류와 data 형식은 모른다 */
export const sseClient = { connect };
