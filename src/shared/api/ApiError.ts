/** 서버가 실패로 응답했다. 분기는 `code`(서버 오류 코드)와 `status` 로 한다 */
export class ApiError extends Error {
  override readonly name = 'ApiError';
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string, options?: ErrorOptions) {
    super(message, options);
    this.status = status;
    this.code = code;
  }
}
