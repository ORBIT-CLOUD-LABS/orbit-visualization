import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { artifactFixtures, failure, success } from '@/mocks/artifactHandlers';
import { server } from '@/mocks/server';

import { renderRoute } from '../test/renderRoute';
import { ArtifactListPage } from './ArtifactListPage';

const LIST_PATH = '/api/v1/admin/artifacts';

function renderPage() {
  return renderRoute(<ArtifactListPage />, { path: '/artifacts' });
}

function respondWithArtifacts(artifacts: unknown[]) {
  server.use(http.get(LIST_PATH, () => HttpResponse.json(success({ artifacts }))));
}

describe('ArtifactListPage', () => {
  it('불러오는 동안 로딩 행을 보여 준다', () => {
    renderPage();

    expect(screen.getByText('불러오는 중')).toBeInTheDocument();
  });

  it('파일 목록과 요약을 보여 주고 상세로 이동한다', async () => {
    const user = userEvent.setup();
    renderPage();

    const table = await screen.findByRole('table');
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(artifactFixtures.length + 1);
    expect(rows[1]).toHaveTextContent('MODEL-A');
    expect(rows[1]).toHaveTextContent('20.0 MB');
    expect(rows[1]).toHaveTextContent('a80ed4b4…9c21');
    expect(rows[1]).toHaveTextContent('/firmware/MODEL-A/1.1.0/firmware.bin');
    expect(screen.getByText('등록 파일').nextElementSibling).toHaveTextContent('2');

    await user.click(screen.getByRole('link', { name: 'MODEL-A 1.1.0 상세' }));

    expect(await screen.findByText('이동한 주소 /artifacts/12')).toBeInTheDocument();
  });

  it('차종으로 거르면 1페이지부터 그 차종만 보여 준다', async () => {
    const user = userEvent.setup();
    respondWithArtifacts(
      Array.from({ length: 25 }, (_, index) => ({
        ...artifactFixtures[0],
        artifactId: index + 1,
        model: index < 22 ? 'MODEL-A' : 'MODEL-B',
        version: `1.0.${index}`,
      })),
    );
    renderPage();

    expect(await screen.findByText('25개 중 1–20 · 1 / 2 페이지')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '2 페이지' }));
    expect(screen.getByText('25개 중 21–25 · 2 / 2 페이지')).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: '차종' }), 'MODEL-B');

    expect(screen.getByText('3개 중 1–3 · 1 / 1 페이지')).toBeInTheDocument();
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(4);
  });

  it('파일이 없으면 등록을 안내한다', async () => {
    respondWithArtifacts([]);
    renderPage();

    expect(await screen.findByText('등록된 파일이 없습니다')).toBeInTheDocument();
    expect(screen.getByText('배포할 업데이트 파일을 먼저 등록하세요')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '파일 등록' })).toHaveAttribute(
      'href',
      '/artifacts/new',
    );
  });

  it('불러오지 못하면 다시 시도할 수 있다', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(
        LIST_PATH,
        () => HttpResponse.json(failure('INTERNAL_SERVER_ERROR'), { status: 500 }),
        {
          once: true,
        },
      ),
    );
    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('데이터를 불러오지 못했습니다');
    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByRole('table')).toBeInTheDocument();
  });
});
