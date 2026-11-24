import { screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { failure, success } from '@/mocks/apiEnvelope';
import { server } from '@/mocks/server';

import { renderCampaignRoute } from '../test/renderCampaignRoute';
import { CampaignRegisterPage } from './CampaignRegisterPage';

const REGISTER_PATH = '/api/v1/admin/campaigns';
const ARTIFACTS_PATH = '/api/v1/admin/artifacts';
const FILE_LABEL = /배포할 파일/;
const FILE_12 = '#12 · MODEL-A · 1.1.0 · 서명 키 v1';

function renderPage(url = '/campaigns/new') {
  return renderCampaignRoute(<CampaignRegisterPage />, { path: '/campaigns/new', url });
}

function captureRequest(): { body: () => unknown } {
  let body: unknown;
  server.use(
    http.post(REGISTER_PATH, async ({ request }) => {
      body = await request.json();
      return HttpResponse.json(success({ campaignId: 9 }, 'CREATED'), { status: 201 });
    }),
  );
  return { body: () => body };
}

async function fillForm(user: UserEvent) {
  await user.type(screen.getByRole('textbox', { name: /캠페인 이름/ }), 'MODEL-A 1.1.0 배포');
  await user.selectOptions(await screen.findByRole('combobox', { name: FILE_LABEL }), FILE_12);
  await user.type(screen.getByLabelText(/시작 일시/), '2026-10-28T00:00');
  await user.type(screen.getByLabelText(/종료 일시/), '2026-11-28T00:00');
}

describe('CampaignRegisterPage', () => {
  it('필수값이 비거나 기간이 뒤집히면 요청하지 않고 칸마다 알려 준다', async () => {
    const user = userEvent.setup();
    const request = captureRequest();
    renderPage();
    await screen.findByRole('option', { name: FILE_12 });

    await user.type(screen.getByLabelText(/시작 일시/), '2026-10-28T00:00');
    await user.type(screen.getByLabelText(/종료 일시/), '2026-10-27T00:00');
    await user.click(screen.getByRole('button', { name: '캠페인 등록' }));

    expect(screen.getByRole('textbox', { name: /캠페인 이름/ })).toHaveAccessibleDescription(
      '캠페인 이름을 입력하세요',
    );
    expect(screen.getByRole('combobox', { name: FILE_LABEL })).toHaveAccessibleDescription(
      '배포할 파일을 선택하세요',
    );
    expect(screen.getByText('종료 일시는 시작 일시보다 늦어야 합니다')).toBeInTheDocument();
    expect(request.body()).toBeUndefined();
  });

  it('파일을 고르면 차종·목표 버전을 채우고, 등록하면 상세로 이동한다', async () => {
    const user = userEvent.setup();
    const request = captureRequest();
    const { router } = renderPage();
    await fillForm(user);

    expect(screen.getByRole('textbox', { name: /목표 버전/ })).toHaveValue('1.1.0');
    expect(screen.getByRole('textbox', { name: /차종/ })).toHaveValue('MODEL-A');

    await user.type(screen.getByRole('textbox', { name: 'HW 버전' }), 'HW1{Enter}HW2{Enter}');
    await user.type(screen.getByRole('textbox', { name: '지역' }), 'KR{Enter}');
    await user.click(screen.getByRole('button', { name: 'HW2 삭제' }));
    await user.type(screen.getByRole('textbox', { name: '현재 버전 (최소)' }), '1.0.0');
    await user.click(screen.getByRole('button', { name: '캠페인 등록' }));

    await vi.waitFor(() => {
      expect(router.state.location.pathname).toBe('/campaigns/9');
    });
    expect(request.body()).toEqual({
      name: 'MODEL-A 1.1.0 배포',
      artifactId: 12,
      targetVersion: '1.1.0',
      target: {
        model: 'MODEL-A',
        hwVersions: ['HW1'],
        regions: ['KR'],
        currentVersionMin: '1.0.0',
        currentVersionMax: null,
      },
      startAt: '2026-10-28T00:00:00.000Z',
      endAt: '2026-11-28T00:00:00.000Z',
    });
  });

  it('등록하는 동안 입력과 버튼을 막는다', async () => {
    const user = userEvent.setup();
    server.use(http.post(REGISTER_PATH, () => new Promise<never>(() => undefined)));
    renderPage();
    await fillForm(user);

    await user.click(screen.getByRole('button', { name: '캠페인 등록' }));

    expect(await screen.findByRole('button', { name: '등록 중…' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: /캠페인 이름/ })).toBeDisabled();
  });

  it('주소의 artifactId 로 파일을 골라 둔다', async () => {
    renderPage('/campaigns/new?artifactId=10');

    expect(await screen.findByRole('textbox', { name: /목표 버전/ })).toHaveValue('');
    await screen.findByRole('option', { name: FILE_12 });
    expect(screen.getByRole('combobox', { name: FILE_LABEL })).toHaveDisplayValue(
      '#10 · MODEL-B · 2.0.1 · 서명 키 v1',
    );
    expect(screen.getByRole('textbox', { name: /목표 버전/ })).toHaveValue('2.0.1');
  });

  it.each(['abc', '999'])('주소의 artifactId 가 %s 면 고르지 않는다', async (artifactId) => {
    renderPage(`/campaigns/new?artifactId=${artifactId}`);

    await screen.findByRole('option', { name: FILE_12 });
    expect(screen.getByRole('combobox', { name: FILE_LABEL })).toHaveDisplayValue(
      '파일을 선택하세요',
    );
  });

  it('같은 활성 캠페인이 있으면(409) 안내 문구를 보여 주고 code 는 드러내지 않는다', async () => {
    const user = userEvent.setup();
    server.use(
      http.post(REGISTER_PATH, () =>
        HttpResponse.json(failure('ACTIVE_CAMPAIGN_EXISTS', '서버 원문'), { status: 409 }),
      ),
    );
    renderPage();
    await fillForm(user);

    await user.click(screen.getByRole('button', { name: '캠페인 등록' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('같은 대상 조건과 목표 버전의 활성 캠페인이 이미 있습니다');
    expect(alert).toHaveTextContent(
      '기존 캠페인을 비활성화하거나 대상 조건·목표 버전을 바꿔 주세요',
    );
    expect(document.body).not.toHaveTextContent('ACTIVE_CAMPAIGN_EXISTS');
    expect(alert).not.toHaveTextContent('서버 원문');

    await user.type(screen.getByRole('textbox', { name: /캠페인 이름/ }), '!');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('파일 목록을 불러오지 못하면 다시 시도할 수 있다', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(
        ARTIFACTS_PATH,
        () => HttpResponse.json(failure('INTERNAL_SERVER_ERROR'), { status: 500 }),
        { once: true },
      ),
    );
    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('파일 목록을 불러오지 못했습니다');
    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByRole('option', { name: FILE_12 })).toBeInTheDocument();
  });

  it('등록된 파일이 없으면 파일 등록으로 안내한다', async () => {
    server.use(http.get(ARTIFACTS_PATH, () => HttpResponse.json(success({ artifacts: [] }))));
    renderPage();

    expect(await screen.findByRole('link', { name: '파일 등록' })).toHaveAttribute(
      'href',
      '/artifacts/new',
    );
    expect(screen.getByRole('combobox', { name: FILE_LABEL })).toBeDisabled();
  });
});
