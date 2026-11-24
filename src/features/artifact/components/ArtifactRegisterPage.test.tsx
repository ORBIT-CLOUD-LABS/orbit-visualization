import { screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { failure, success } from '@/mocks/artifactHandlers';
import { server } from '@/mocks/server';

import { renderRoute } from '../test/renderRoute';
import { ArtifactRegisterPage } from './ArtifactRegisterPage';

const REGISTER_PATH = '/api/v1/admin/artifacts';

const registration = {
  artifactId: 12,
  fileSize: 20_971_520,
  sha256: 'a80ed4b4f2c91e0d7b6a5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d9c21',
  path: '/firmware/MODEL-A/1.1.0/firmware.bin',
  keyId: 'v1',
};

function renderPage() {
  return renderRoute(<ArtifactRegisterPage />, { path: '/artifacts/new' });
}

async function fillForm(user: UserEvent) {
  await user.upload(screen.getByLabelText('업데이트 파일'), new File(['firmware'], 'firmware.bin'));
  await user.type(screen.getByRole('textbox', { name: '차종' }), 'MODEL-A');
  await user.type(screen.getByRole('textbox', { name: '버전' }), '1.1.0');
  await user.type(screen.getByRole('textbox', { name: '서명' }), 'Kx8f2==');
  await user.type(screen.getByRole('textbox', { name: '키 버전' }), 'v1');
}

describe('ArtifactRegisterPage', () => {
  it('필수값이 비면 요청하지 않고 칸마다 알려 준다', async () => {
    const user = userEvent.setup();
    let requested = false;
    server.use(
      http.post(REGISTER_PATH, () => {
        requested = true;
        return HttpResponse.json(success(registration, 'CREATED'), { status: 201 });
      }),
    );
    renderPage();

    await user.type(screen.getByRole('textbox', { name: '버전' }), 'v1.0');
    await user.click(screen.getByRole('button', { name: '등록' }));

    expect(screen.getByText('업데이트 파일을 선택하세요')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '차종' })).toHaveAccessibleDescription(
      '차종을 입력하세요',
    );
    expect(screen.getByRole('textbox', { name: '버전' })).toHaveAccessibleDescription(
      '숫자와 점으로 입력하세요 (예: 1.0.1)',
    );
    expect(screen.getByText('서명을 입력하세요')).toBeInTheDocument();
    expect(screen.getByText('키 버전을 입력하세요')).toBeInTheDocument();
    expect(requested).toBe(false);
  });

  it('등록하는 동안 입력을 막고, 끝나면 결과와 캠페인 등록 링크를 보여 준다', async () => {
    const user = userEvent.setup();
    let respond: () => void = () => undefined;
    server.use(
      http.post(REGISTER_PATH, async () => {
        await new Promise<void>((resolve) => {
          respond = resolve;
        });
        return HttpResponse.json(success(registration, 'CREATED'), { status: 201 });
      }),
    );
    renderPage();
    await fillForm(user);
    expect(screen.getByText('firmware.bin · 8 bytes')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '등록' }));

    expect(await screen.findByRole('button', { name: '등록 중…' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: '차종' })).toBeDisabled();
    respond();

    const result = await screen.findByRole('region', { name: '등록 완료' });
    expect(result).toHaveTextContent('20.0 MB');
    expect(result).toHaveTextContent('/firmware/MODEL-A/1.1.0/firmware.bin');
    expect(screen.getByRole('link', { name: '이 파일로 캠페인 등록' })).toHaveAttribute(
      'href',
      '/campaigns/new?artifactId=12',
    );
    expect(screen.getByRole('button', { name: '등록' })).toBeEnabled();
    expect(screen.getByRole('textbox', { name: '차종' })).toHaveValue('');
  });

  it('실패한 뒤 입력을 고치면 지난 안내를 지운다', async () => {
    const user = userEvent.setup();
    server.use(
      http.post(REGISTER_PATH, () =>
        HttpResponse.json(failure('SIGNATURE_INVALID'), { status: 422 }),
      ),
    );
    renderPage();
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: '등록' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: '키 버전' }), '2');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each([
    ['ARTIFACT_VERSION_EXISTS', 409, '이미 등록된 버전입니다'],
    ['HASH_MISMATCH', 422, 'SHA-256 이 일치하지 않습니다'],
    ['SIGNATURE_INVALID', 422, '서명 검증에 실패했습니다'],
    ['ORIGIN_UPLOAD_FAILED', 502, '파일 서버에 올리지 못했습니다'],
    ['CONTENT_TOO_LARGE', 413, '파일이 너무 큽니다'],
  ])('%s 이면 안내 문구를 보여 주고 code 는 드러내지 않는다', async (code, status, title) => {
    const user = userEvent.setup();
    server.use(
      http.post(REGISTER_PATH, () => HttpResponse.json(failure(code, '서버 원문'), { status })),
    );
    renderPage();
    await fillForm(user);

    await user.click(screen.getByRole('button', { name: '등록' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(title);
    expect(alert).not.toHaveTextContent(code);
    expect(alert).not.toHaveTextContent('서버 원문');
  });
});
