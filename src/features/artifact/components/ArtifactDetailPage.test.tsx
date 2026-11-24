import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { artifactFixtures, failure, success } from '@/mocks/artifactHandlers';
import { server } from '@/mocks/server';

import { renderRoute } from '../test/renderRoute';
import { ArtifactDetailPage } from './ArtifactDetailPage';

const CAMPAIGNS_PATH = '/api/v1/admin/campaigns';

function campaign(campaignId: number, targetVersion: string) {
  return {
    campaignId,
    name: `MODEL-A ${targetVersion} 배포`,
    model: 'MODEL-A',
    targetVersion,
    status: 'ACTIVE',
    startAt: '2026-10-28T00:00:00Z',
    endAt: '2026-11-28T00:00:00Z',
    createdAt: '2026-10-27T09:00:00Z',
  };
}

function respondWithCampaigns(campaigns: unknown[]) {
  server.use(http.get(CAMPAIGNS_PATH, () => HttpResponse.json(success({ campaigns }))));
}

function renderPage(artifactId = '12') {
  return renderRoute(<ArtifactDetailPage />, {
    path: '/artifacts/:artifactId',
    url: `/artifacts/${artifactId}`,
  });
}

describe('ArtifactDetailPage', () => {
  it('불러오는 동안 로딩 행을 보여 준다', () => {
    respondWithCampaigns([]);
    renderPage();

    expect(screen.getByText('불러오는 중')).toBeInTheDocument();
  });

  it('파일 정보와 같은 차종·버전을 목표로 하는 캠페인을 보여 준다', async () => {
    respondWithCampaigns([campaign(7, '1.1.0'), campaign(5, '1.0.9')]);
    renderPage();

    expect(await screen.findByRole('heading', { name: 'MODEL-A 1.1.0' })).toBeInTheDocument();
    const info = screen.getByRole('region', { name: '파일 정보' });
    expect(info).toHaveTextContent('서명 키 v1');
    expect(info).toHaveTextContent('20.0 MB (20,971,520 bytes)');
    expect(info).toHaveTextContent(artifactFixtures[0]?.sha256 ?? '');
    expect(info).toHaveTextContent('/firmware/MODEL-A/1.1.0/firmware.bin');
    expect(within(info).getByRole('link', { name: '이 파일로 캠페인 등록' })).toHaveAttribute(
      'href',
      '/campaigns/new?artifactId=12',
    );

    const campaigns = screen.getByRole('region', { name: '이 파일을 쓰는 캠페인' });
    const rows = await within(campaigns).findAllByRole('row');
    expect(rows).toHaveLength(2);
    expect(rows[1]).toHaveTextContent('MODEL-A 1.1.0 배포');
    expect(
      within(campaigns).getByRole('link', { name: 'MODEL-A 1.1.0 배포 상세' }),
    ).toHaveAttribute('href', '/campaigns/7');
  });

  it('캠페인이 없으면 빈 상태를 보여 준다', async () => {
    respondWithCampaigns([campaign(5, '1.0.9')]);
    renderPage();

    expect(await screen.findByText('이 파일을 쓰는 캠페인이 없습니다')).toBeInTheDocument();
  });

  it('캠페인을 불러오지 못하면 그 카드에만 오류를 보여 준다', async () => {
    server.use(
      http.get(CAMPAIGNS_PATH, () =>
        HttpResponse.json(failure('INTERNAL_SERVER_ERROR'), { status: 500 }),
      ),
    );
    renderPage();

    const campaigns = await screen.findByRole('region', { name: '이 파일을 쓰는 캠페인' });
    expect(await within(campaigns).findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'MODEL-A 1.1.0' })).toBeInTheDocument();
  });

  it('없는 파일이면 본문 전체를 빈 상태로 바꾸고 목록으로 돌아가게 한다', async () => {
    renderPage('999');

    expect(await screen.findByText('파일을 찾을 수 없습니다')).toBeInTheDocument();
    expect(screen.getByText('삭제됐거나 잘못된 주소입니다')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '파일 목록으로' })).toHaveAttribute(
      'href',
      '/artifacts',
    );
  });

  it('숫자가 아닌 주소는 요청하지 않고 없는 파일로 본다', () => {
    renderPage('abc');

    expect(screen.getByText('파일을 찾을 수 없습니다')).toBeInTheDocument();
  });

  it('불러오지 못하면 다시 시도할 수 있다', async () => {
    const user = userEvent.setup();
    respondWithCampaigns([]);
    server.use(
      http.get(
        '/api/v1/admin/artifacts/:artifactId',
        () => HttpResponse.json(failure('INTERNAL_SERVER_ERROR'), { status: 500 }),
        { once: true },
      ),
    );
    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('데이터를 불러오지 못했습니다');
    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByRole('heading', { name: 'MODEL-A 1.1.0' })).toBeInTheDocument();
  });

  it('SHA-256 을 클립보드에 복사한다', async () => {
    const user = userEvent.setup();
    respondWithCampaigns([]);
    renderPage();

    await user.click(await screen.findByRole('button', { name: 'SHA-256 복사' }));

    expect(await screen.findByText('복사했습니다')).toBeInTheDocument();
    await expect(navigator.clipboard.readText()).resolves.toBe(artifactFixtures[0]?.sha256);
  });

  it('복사하지 못하면 직접 복사하라고 알려 준다', async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'));
    respondWithCampaigns([]);
    renderPage();

    await user.click(await screen.findByRole('button', { name: 'SHA-256 복사' }));

    expect(
      await screen.findByText('복사하지 못했습니다. 직접 선택해 복사하세요'),
    ).toBeInTheDocument();
  });
});
