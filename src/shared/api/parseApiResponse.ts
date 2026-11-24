import { z } from 'zod';

// 서버 공통 응답 형식 { isSuccess, code, message, data, error }
const successEnvelopeSchema = z.object({
  isSuccess: z.literal(true),
  code: z.string(),
  data: z.unknown(),
});

/**
 * 공통 응답 형식을 벗기고 `data` 를 스키마로 검증해 돌려준다.
 * @throws 형식이 다르면 Error (cause 에 zod 오류)
 */
export function parseApiResponse<Schema extends z.ZodType>(
  body: unknown,
  dataSchema: Schema,
): z.output<Schema> {
  const envelope = successEnvelopeSchema.safeParse(body);
  if (!envelope.success) {
    throw new Error('서버 응답이 공통 응답 형식과 다릅니다', { cause: envelope.error });
  }
  const data = dataSchema.safeParse(envelope.data.data);
  if (!data.success) {
    throw new Error(`서버 응답 data 형식이 다릅니다 (${envelope.data.code})`, {
      cause: data.error,
    });
  }
  return data.data;
}
