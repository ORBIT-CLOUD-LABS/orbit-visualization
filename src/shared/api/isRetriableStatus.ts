const NO_CONTENT = 204;
const REQUEST_TIMEOUT = 408;
const TOO_MANY_REQUESTS = 429;

/**
 * 같은 요청을 다시 보내면 성공할 수 있는 응답 상태인지. REST 재시도와 SSE 재연결이 같이 쓴다.
 * 4xx 는 다시 보내도 같지만 408·429 는 잠시 뒤 성공할 수 있다. 204 는 SSE 명세상 재연결 중단이다.
 */
export function isRetriableStatus(status: number): boolean {
  if (status === NO_CONTENT) {
    return false;
  }
  if (status >= 400 && status < 500) {
    return status === REQUEST_TIMEOUT || status === TOO_MANY_REQUESTS;
  }
  return true;
}
