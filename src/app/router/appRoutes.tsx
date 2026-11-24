import { Navigate, type RouteObject } from 'react-router';

import { ArtifactDetailPage } from '@/features/artifact/components/ArtifactDetailPage';
import { ArtifactListPage } from '@/features/artifact/components/ArtifactListPage';
import { ArtifactRegisterPage } from '@/features/artifact/components/ArtifactRegisterPage';
import { AuthenticatedLayout } from '@/features/auth/components/AuthenticatedLayout';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { ROUTES } from '@/shared/config/routes';

import { PlaceholderPage } from './PlaceholderPage';
import { RequireAuth } from './RequireAuth';

export const appRoutes: RouteObject[] = [
  { path: ROUTES.login, element: <LoginPage /> },
  {
    element: (
      <RequireAuth>
        <AuthenticatedLayout />
      </RequireAuth>
    ),
    children: [
      { path: ROUTES.dashboard, element: <PlaceholderPage title="대시보드" /> },
      { path: ROUTES.vehicleDetail, element: <PlaceholderPage title="차량 상세" /> },
      { path: ROUTES.edges, element: <PlaceholderPage title="Edge" /> },
      { path: ROUTES.campaigns, element: <PlaceholderPage title="캠페인" /> },
      { path: ROUTES.campaignNew, element: <PlaceholderPage title="캠페인 만들기" /> },
      { path: ROUTES.campaignDetail, element: <PlaceholderPage title="캠페인 상세" /> },
      { path: ROUTES.artifacts, element: <ArtifactListPage /> },
      { path: ROUTES.artifactNew, element: <ArtifactRegisterPage /> },
      { path: ROUTES.artifactDetail, element: <ArtifactDetailPage /> },
    ],
  },
  // 없는 경로는 라우터 기본 오류 화면 대신 대시보드로 보낸다
  { path: '*', element: <Navigate to={ROUTES.dashboard} replace /> },
];
