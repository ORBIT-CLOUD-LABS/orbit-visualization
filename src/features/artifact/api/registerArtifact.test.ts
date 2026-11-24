import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { success } from '@/mocks/apiEnvelope';
import { server } from '@/mocks/server';

import { registerArtifact } from './registerArtifact';

const registration = {
  artifactId: 12,
  fileSize: 4,
  sha256: 'a'.repeat(64),
  path: '/firmware/MODEL-A/1.1.0/firmware.bin',
  keyId: 'v1',
};

type SentRequest = { contentType: string | null; body: string };

// jsdom 의 File 은 Node 의 request.formData() 가 읽지 못해 본문을 글자 그대로 받는다
function captureRequest(): { get: () => SentRequest | undefined } {
  let sent: SentRequest | undefined;
  server.use(
    http.post('/api/v1/admin/artifacts', async ({ request }) => {
      sent = { contentType: request.headers.get('Content-Type'), body: await request.text() };
      return HttpResponse.json(success(registration, 'CREATED'), { status: 201 });
    }),
  );
  return { get: () => sent };
}

function field(name: string, value: string): string {
  return `name="${name}"\r\n\r\n${value}\r\n`;
}

describe('registerArtifact', () => {
  it('파일과 입력값을 multipart 로 보내고 등록 결과를 돌려준다', async () => {
    const request = captureRequest();

    const result = await registerArtifact({
      file: new File(['abcd'], 'firmware.bin'),
      model: 'MODEL-A',
      version: '1.1.0',
      sha256: 'A'.repeat(64),
      signature: 'Kx8f2==',
      keyId: 'v1',
    });

    expect(result).toEqual(registration);
    const sent = request.get();
    expect(sent?.contentType).toMatch(/^multipart\/form-data; boundary=/);
    expect(sent?.body).toContain('name="file"; filename="firmware.bin"');
    expect(sent?.body).toContain(field('model', 'MODEL-A'));
    expect(sent?.body).toContain(field('version', '1.1.0'));
    expect(sent?.body).toContain(field('sha256', 'A'.repeat(64)));
    expect(sent?.body).toContain(field('signature', 'Kx8f2=='));
    expect(sent?.body).toContain(field('keyId', 'v1'));
  });

  it('SHA-256 이 없으면 필드를 보내지 않는다', async () => {
    const request = captureRequest();

    await registerArtifact({
      file: new File(['abcd'], 'firmware.bin'),
      model: 'MODEL-A',
      version: '1.1.0',
      signature: 'Kx8f2==',
      keyId: 'v1',
    });

    expect(request.get()?.body).not.toContain('name="sha256"');
  });
});
