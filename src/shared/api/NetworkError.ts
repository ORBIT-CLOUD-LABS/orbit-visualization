/** 서버 응답을 받지 못했다 (연결 실패, 시간 초과). 서버가 실패로 응답한 경우는 ApiError */
export class NetworkError extends Error {
  override readonly name = 'NetworkError';
}
