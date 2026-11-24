import { QueryClient } from '@tanstack/react-query';
import type { ReactElement } from 'react';

import { renderRoutes } from '@/test/renderRoutes';

type RenderCampaignRouteOptions = {
  /** 라우터에 등록할 경로 패턴. 예: /campaigns/:campaignId */
  path: string;
  /** 처음 열 주소. 없으면 path */
  url?: string;
};

/**
 * 캠페인 화면 하나를 라우터·Query 와 함께 그린다.
 * 오류 상태를 바로 확인하도록 재시도는 끄고, 다른 경로는 빈 화면으로 둔다. 이동은 router.state.location 으로 확인한다.
 */
export function renderCampaignRoute(
  element: ReactElement,
  { path, url = path }: RenderCampaignRouteOptions,
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return renderRoutes(
    [
      { path, element },
      { path: '*', element: null },
    ],
    url,
    queryClient,
  );
}
