import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { failure, success } from '@/mocks/apiEnvelope';
import { campaignDetailFixture, campaignStatsFixture } from '@/mocks/campaignHandlers';
import { server } from '@/mocks/server';

import { renderCampaignRoute } from '../test/renderCampaignRoute';
import { CampaignDetailPage } from './CampaignDetailPage';

const DETAIL_PATH = '/api/v1/admin/campaigns/:campaignId';
const STATS_PATH = '/api/v1/admin/campaigns/:campaignId/stats';

function renderPage(campaignId = '7') {
  return renderCampaignRoute(<CampaignDetailPage />, {
    path: '/campaigns/:campaignId',
    url: `/campaigns/${campaignId}`,
  });
}

function serverError() {
  return HttpResponse.json(failure('INTERNAL_SERVER_ERROR'), { status: 500 });
}

describe('CampaignDetailPage', () => {
  it('불러오는 동안 로딩 행을 보여 준다', () => {
    renderPage();

    expect(screen.getByText('불러오는 중')).toBeInTheDocument();
  });

  it('기본 정보와 대상 조건을 보여 준다', async () => {
    renderPage();

    expect(await screen.findByRole('heading', { name: 'MODEL-A 1.1.0 배포' })).toBeInTheDocument();
    const info = screen.getByRole('region', { name: '캠페인 정보' });
    expect(info).toHaveTextContent('ACTIVE');
    expect(info).toHaveTextContent('#12 · MODEL-A 1.1.0');
    expect(info).toHaveTextContent('HW1, HW2');
    expect(info).toHaveTextContent('1.0.0 ~ 1.0.9');
    expect(info).toHaveTextContent('2026-10-28 00:00 ~ 2026-11-28 00:00 (UTC)');
    expect(info).toHaveTextContent('2026-10-27 09:00');
    expect(within(info).getByRole('link', { name: '파일 #12 보기' })).toHaveAttribute(
      'href',
      '/artifacts/12',
    );
  });

  it('비어 있는 대상 조건은 전체·제한 없음으로 쓴다', async () => {
    server.use(
      http.get(DETAIL_PATH, () =>
        HttpResponse.json(
          success({
            ...campaignDetailFixture,
            target: {
              ...campaignDetailFixture.target,
              hwVersions: [],
              currentVersionMin: null,
              currentVersionMax: null,
            },
          }),
        ),
      ),
    );
    renderPage();

    await screen.findByRole('heading', { name: 'MODEL-A 1.1.0 배포' });
    const info = screen.getByRole('region', { name: '캠페인 정보' });
    expect(within(info).getByText('HW 버전').nextElementSibling).toHaveTextContent('전체');
    expect(within(info).getByText('현재 버전 범위').nextElementSibling).toHaveTextContent(
      '제한 없음',
    );
  });

  it('진행 현황 비율과 실패 사유를 건수 순서로 보여 준다', async () => {
    renderPage();

    const progress = await screen.findByRole('region', { name: '진행 현황' });
    expect(await within(progress).findByText('대기·미보고')).toBeInTheDocument();
    expect(within(progress).getByText('대상 차량').nextElementSibling).toHaveTextContent('100');
    expect(within(progress).getByText('대기·미보고').nextElementSibling).toHaveTextContent('15');
    const ratios = within(progress).getByRole('list', { name: '결과 비율' });
    expect(ratios).toHaveTextContent('성공 80%');
    expect(ratios).toHaveTextContent('실패 5%');
    expect(ratios).toHaveTextContent('대기·미보고 15%');

    const reasons = screen.getByRole('region', { name: '실패 사유별 건수' });
    const rows = within(reasons).getAllByRole('row').slice(1);
    expect(rows.map((row) => row.textContent)).toEqual([
      'DOWNLOAD_FAILED2',
      'INSTALL_FAILED2',
      'SIGNATURE_INVALID1',
      'DOWNGRADE_REJECTED0',
      'HASH_MISMATCH0',
    ]);
  });

  it('새로고침하면 진행 현황을 다시 불러온다', async () => {
    const user = userEvent.setup();
    let requestCount = 0;
    server.use(
      http.get(STATS_PATH, () => {
        requestCount += 1;
        return HttpResponse.json(
          success(
            requestCount === 1
              ? campaignStatsFixture
              : { ...campaignStatsFixture, succeeded: 90, inProgress: 5 },
          ),
        );
      }),
    );
    renderPage();
    const progress = await screen.findByRole('region', { name: '진행 현황' });
    expect(await within(progress).findByText('성공 80%')).toBeInTheDocument();

    await user.click(within(progress).getByRole('button', { name: '새로고침' }));

    expect(await within(progress).findByText('성공 90%')).toBeInTheDocument();
    expect(requestCount).toBe(2);
  });

  it('새로고침에 실패하면 이전 값을 두고 알려 준다', async () => {
    const user = userEvent.setup();
    renderPage();
    const progress = await screen.findByRole('region', { name: '진행 현황' });
    await within(progress).findByText('성공 80%');
    server.use(http.get(STATS_PATH, serverError));

    await user.click(within(progress).getByRole('button', { name: '새로고침' }));

    expect(await within(progress).findByRole('alert')).toHaveTextContent('새로고침하지 못했습니다');
    expect(within(progress).getByText('성공 80%')).toBeInTheDocument();
  });

  it('진행 현황을 불러오지 못하면 그 카드에서 다시 시도할 수 있다', async () => {
    const user = userEvent.setup();
    server.use(http.get(STATS_PATH, serverError, { once: true }));
    renderPage();

    const progress = await screen.findByRole('region', { name: '진행 현황' });
    expect(await within(progress).findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'MODEL-A 1.1.0 배포' })).toBeInTheDocument();
    await user.click(within(progress).getByRole('button', { name: '다시 시도' }));

    expect(await within(progress).findByText('성공 80%')).toBeInTheDocument();
  });

  it('확인하면 비활성화하고 상태를 INACTIVE 로 바꾼다', async () => {
    const user = userEvent.setup();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    let body: unknown;
    server.use(
      http.patch(DETAIL_PATH, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(success({ ...campaignDetailFixture, status: 'INACTIVE' }));
      }),
    );
    renderPage();

    await user.click(await screen.findByRole('button', { name: '비활성화' }));

    const info = screen.getByRole('region', { name: '캠페인 정보' });
    expect(await within(info).findByText('INACTIVE')).toBeInTheDocument();
    expect(confirm).toHaveBeenCalledOnce();
    expect(body).toEqual({ status: 'INACTIVE' });
    expect(within(info).queryByRole('button', { name: '비활성화' })).not.toBeInTheDocument();
  });

  it('확인을 취소하면 비활성화하지 않는다', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    let requested = false;
    server.use(
      http.patch(DETAIL_PATH, () => {
        requested = true;
        return HttpResponse.json(success(campaignDetailFixture));
      }),
    );
    renderPage();

    await user.click(await screen.findByRole('button', { name: '비활성화' }));

    expect(requested).toBe(false);
    expect(screen.getByRole('button', { name: '비활성화' })).toBeEnabled();
  });

  it('비활성화에 실패하면 알려 준다', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    server.use(http.patch(DETAIL_PATH, serverError));
    renderPage();

    await user.click(await screen.findByRole('button', { name: '비활성화' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('비활성화하지 못했습니다');
  });

  it('비활성 캠페인에는 비활성화 버튼이 없다', async () => {
    server.use(
      http.get(DETAIL_PATH, () =>
        HttpResponse.json(success({ ...campaignDetailFixture, status: 'INACTIVE' })),
      ),
    );
    renderPage();

    await screen.findByRole('heading', { name: 'MODEL-A 1.1.0 배포' });
    expect(screen.queryByRole('button', { name: '비활성화' })).not.toBeInTheDocument();
  });

  it('없는 캠페인이면 본문 전체를 빈 상태로 바꾸고 목록으로 돌아가게 한다', async () => {
    renderPage('999');

    expect(await screen.findByText('캠페인을 찾을 수 없습니다')).toBeInTheDocument();
    expect(screen.getByText('삭제됐거나 잘못된 주소입니다')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '캠페인 목록으로' })).toHaveAttribute(
      'href',
      '/campaigns',
    );
  });

  it('숫자가 아닌 주소는 요청하지 않고 없는 캠페인으로 본다', () => {
    renderPage('abc');

    expect(screen.getByText('캠페인을 찾을 수 없습니다')).toBeInTheDocument();
  });

  it('불러오지 못하면 다시 시도할 수 있다', async () => {
    const user = userEvent.setup();
    server.use(http.get(DETAIL_PATH, serverError, { once: true }));
    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('데이터를 불러오지 못했습니다');
    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByRole('heading', { name: 'MODEL-A 1.1.0 배포' })).toBeInTheDocument();
  });
});
