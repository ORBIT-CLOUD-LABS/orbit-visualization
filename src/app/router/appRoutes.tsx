import type { RouteObject } from 'react-router';

import { ROUTES } from '@/shared/config/routes';

import { PlaceholderPage } from './PlaceholderPage';
import { RequireAuth } from './RequireAuth';

export const appRoutes: RouteObject[] = [
  { path: ROUTES.login, element: <PlaceholderPage title="로그인" /> },
  {
    element: <RequireAuth />,
    children: [
      { path: ROUTES.dashboard, element: <PlaceholderPage title="대시보드" /> },
      { path: ROUTES.vehicleDetail, element: <PlaceholderPage title="차량 상세" /> },
      { path: ROUTES.edges, element: <PlaceholderPage title="Edge" /> },
      { path: ROUTES.campaigns, element: <PlaceholderPage title="캠페인" /> },
      { path: ROUTES.campaignNew, element: <PlaceholderPage title="캠페인 만들기" /> },
      { path: ROUTES.campaignDetail, element: <PlaceholderPage title="캠페인 상세" /> },
      { path: ROUTES.artifacts, element: <PlaceholderPage title="아티팩트" /> },
      { path: ROUTES.artifactNew, element: <PlaceholderPage title="아티팩트 등록" /> },
      { path: ROUTES.artifactDetail, element: <PlaceholderPage title="아티팩트 상세" /> },
    ],
  },
];
