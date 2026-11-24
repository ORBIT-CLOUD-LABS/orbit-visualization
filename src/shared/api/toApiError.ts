import { z } from 'zod';

import { ApiError } from './ApiError';

// 실패 응답 { isSuccess: false, code, message, ... } 에서 분기에 쓸 값만 꺼낸다
const failureEnvelopeSchema = z.object({
  code: z.string().min(1),
  message: z.string(),
});

/** 실패 응답을 ApiError 로 바꾼다. 본문이 공통 형식이 아니면(프록시 오류 등) code 는 `HTTP_<status>` */
export function toApiError(status: number, body: unknown, cause?: unknown): ApiError {
  const failure = failureEnvelopeSchema.safeParse(body);
  if (failure.success) {
    return new ApiError(status, failure.data.code, failure.data.message, { cause });
  }
  return new ApiError(status, `HTTP_${status}`, `서버가 ${status} 로 응답했습니다`, { cause });
}
