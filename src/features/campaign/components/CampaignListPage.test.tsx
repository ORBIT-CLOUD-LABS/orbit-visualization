import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { failure, success } from '@/mocks/apiEnvelope';
import { campaignFixtures } from '@/mocks/campaignHandlers';
import { server } from '@/mocks/server';

import { renderCampaignRoute } from '../test/renderCampaignRoute';
import { CampaignListPage } from './CampaignListPage';

const LIST_PATH = '/api/v1/admin/campaigns';

function renderPage() {
  return renderCampaignRoute(<CampaignListPage />, { path: '/campaigns' });
}

function respondWithCampaigns(campaigns: unknown[]) {
  server.use(http.get(LIST_PATH, () => HttpResponse.json(success({ campaigns }))));
}

describe('CampaignListPage', () => {
  it('불러오는 동안 로딩 행을 보여 준다', () => {
    renderPage();

    expect(screen.getByText('불러오는 중')).toBeInTheDocument();
  });

  it('캠페인 목록과 요약을 보여 주고 상세로 이동한다', async () => {
    const user = userEvent.setup();
    const { router } = renderPage();

    const table = await screen.findByRole('table');
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(campaignFixtures.length + 1);
    expect(rows[1]).toHaveTextContent('MODEL-A 1.1.0 배포');
    expect(rows[1]).toHaveTextContent('ACTIVE');
    expect(rows[1]).toHaveTextContent('2026-10-28 ~ 2026-11-28');
    expect(rows[1]).toHaveTextContent('2026-10-27');
    expect(screen.getByText('전체 캠페인').nextElementSibling).toHaveTextContent('2');
    expect(screen.getByText('INACTIVE', { selector: 'p' }).nextElementSibling).toHaveTextContent(
      '1',
    );
    expect(screen.getByRole('link', { name: '+ 캠페인 등록' })).toHaveAttribute(
      'href',
      '/campaigns/new',
    );

    await user.click(screen.getByRole('link', { name: 'MODEL-A 1.1.0 배포 상세' }));

    expect(router.state.location.pathname).toBe('/campaigns/7');
  });

  it('20개씩 나누고 필터를 바꾸면 1페이지부터 그 조건만 보여 준다', async () => {
    const user = userEvent.setup();
    respondWithCampaigns(
      Array.from({ length: 25 }, (_, index) => ({
        ...campaignFixtures[0],
        campaignId: index + 1,
        name: `캠페인 ${index + 1}`,
        status: index < 22 ? 'ACTIVE' : 'INACTIVE',
      })),
    );
    renderPage();

    expect(await screen.findByText('25개 중 1–20 · 1 / 2 페이지')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '2 페이지' }));
    expect(screen.getByText('25개 중 21–25 · 2 / 2 페이지')).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: '상태' }), 'INACTIVE');

    expect(screen.getByText('3개 중 1–3 · 1 / 1 페이지')).toBeInTheDocument();
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(4);
  });

  it('필터 조건에 맞는 캠페인이 없으면 알려 준다', async () => {
    const user = userEvent.setup();
    respondWithCampaigns([campaignFixtures[0]]);
    renderPage();

    await user.selectOptions(await screen.findByRole('combobox', { name: '상태' }), 'INACTIVE');

    expect(screen.getByText('조건에 맞는 캠페인이 없습니다')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('캠페인이 없으면 등록을 안내한다', async () => {
    respondWithCampaigns([]);
    renderPage();

    expect(await screen.findByText('등록된 캠페인이 없습니다')).toBeInTheDocument();
    expect(
      screen.getByText('파일을 등록한 뒤 캠페인을 만들어 배포를 시작하세요'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '캠페인 등록' })).toHaveAttribute(
      'href',
      '/campaigns/new',
    );
  });

  it('불러오지 못하면 다시 시도할 수 있다', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(
        LIST_PATH,
        () => HttpResponse.json(failure('INTERNAL_SERVER_ERROR'), { status: 500 }),
        { once: true },
      ),
    );
    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('데이터를 불러오지 못했습니다');
    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByRole('table')).toBeInTheDocument();
  });
});
