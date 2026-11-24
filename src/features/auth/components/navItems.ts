import { ROUTES } from '@/shared/config/routes';
import type { SidebarItem } from '@/shared/ui/Sidebar';

/** 주 메뉴. 차량 상세는 대시보드에서 들어가므로 대시보드를 선택 상태로 둔다 */
export const NAV_ITEMS: readonly SidebarItem[] = [
  { to: ROUTES.dashboard, label: '대시보드', end: true, activeFor: [ROUTES.vehicleDetail] },
  { to: ROUTES.campaigns, label: '캠페인' },
  { to: ROUTES.artifacts, label: '파일' },
  { to: ROUTES.edges, label: 'CDN Edge' },
];
