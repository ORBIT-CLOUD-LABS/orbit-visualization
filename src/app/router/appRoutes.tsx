import { Navigate, type RouteObject } from 'react-router';

import { AuthenticatedLayout } from '@/features/auth/components/AuthenticatedLayout';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { ROUTES } from '@/shared/config/routes';

import { PlaceholderPage } from './PlaceholderPage';
import { RequireAuth } from './RequireAuth';
import { RouteLoadingFallback } from './RouteLoadingFallback';

// 로그인과 화면 틀은 첫 화면에 바로 필요하므로 함께 싣고, 기능 화면은 처음 열 때 받는다(지도 라이브러리 등이 첫 번들에 섞이지 않게).
// lazy 는 함수 형태로 쓴다. 객체 형태는 라우터가 불러온 뒤 그 객체를 비워서, 같은 appRoutes 로 라우터를 다시 만들면(테스트) 화면이 사라진다
export const appRoutes: RouteObject[] = [
  { path: ROUTES.login, element: <LoginPage /> },
  {
    element: (
      <RequireAuth>
        <AuthenticatedLayout />
      </RequireAuth>
    ),
    HydrateFallback: RouteLoadingFallback,
    children: [
      {
        path: ROUTES.dashboard,
        lazy: async () => {
          const { DashboardPage } = await import('@/features/dashboard/components/DashboardPage');
          return { Component: DashboardPage };
        },
      },
      {
        path: ROUTES.vehicleDetail,
        lazy: async () => {
          const { VehicleDetailPage } =
            await import('@/features/vehicle/components/VehicleDetailPage');
          return { Component: VehicleDetailPage };
        },
      },
      { path: ROUTES.edges, element: <PlaceholderPage title="Edge" /> },
      {
        path: ROUTES.campaigns,
        lazy: async () => {
          const { CampaignListPage } =
            await import('@/features/campaign/components/CampaignListPage');
          return { Component: CampaignListPage };
        },
      },
      {
        path: ROUTES.campaignNew,
        lazy: async () => {
          const { CampaignRegisterPage } =
            await import('@/features/campaign/components/CampaignRegisterPage');
          return { Component: CampaignRegisterPage };
        },
      },
      {
        path: ROUTES.campaignDetail,
        lazy: async () => {
          const { CampaignDetailPage } =
            await import('@/features/campaign/components/CampaignDetailPage');
          return { Component: CampaignDetailPage };
        },
      },
      {
        path: ROUTES.artifacts,
        lazy: async () => {
          const { ArtifactListPage } =
            await import('@/features/artifact/components/ArtifactListPage');
          return { Component: ArtifactListPage };
        },
      },
      {
        path: ROUTES.artifactNew,
        lazy: async () => {
          const { ArtifactRegisterPage } =
            await import('@/features/artifact/components/ArtifactRegisterPage');
          return { Component: ArtifactRegisterPage };
        },
      },
      {
        path: ROUTES.artifactDetail,
        lazy: async () => {
          const { ArtifactDetailPage } =
            await import('@/features/artifact/components/ArtifactDetailPage');
          return { Component: ArtifactDetailPage };
        },
      },
    ],
  },
  // 없는 경로는 라우터 기본 오류 화면 대신 대시보드로 보낸다
  { path: '*', element: <Navigate to={ROUTES.dashboard} replace /> },
];
