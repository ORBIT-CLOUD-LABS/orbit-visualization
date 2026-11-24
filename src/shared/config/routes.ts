// 화면 경로. 기능끼리 서로 가져올 수 없으므로 다른 화면으로 가는 링크는 여기서 경로를 만든다

/** 라우터에 등록하는 경로 패턴 */
export const ROUTES = {
  login: '/login',
  dashboard: '/',
  vehicleDetail: '/vehicles/:vehicleId',
  edges: '/edges',
  campaigns: '/campaigns',
  campaignNew: '/campaigns/new',
  campaignDetail: '/campaigns/:campaignId',
  artifacts: '/artifacts',
  artifactNew: '/artifacts/new',
  artifactDetail: '/artifacts/:artifactId',
} as const;

/** 파라미터가 있는 화면의 실제 경로를 만든다. 값은 encodeURIComponent 로 감싼다 */
export const routePaths = {
  vehicleDetail: (vehicleId: string): string => `/vehicles/${encodeURIComponent(vehicleId)}`,
  campaignDetail: (campaignId: number): string => `/campaigns/${campaignId}`,
  artifactDetail: (artifactId: number): string => `/artifacts/${artifactId}`,
} as const;
