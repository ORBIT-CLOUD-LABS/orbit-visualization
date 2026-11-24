import { ROUTES } from '@/shared/config/routes';

/** 이 파일을 골라 둔 캠페인 등록 화면 주소. 캠페인 등록 화면이 artifactId 쿼리를 읽는다 */
export function campaignNewPath(artifactId: number): string {
  return `${ROUTES.campaignNew}?${new URLSearchParams({ artifactId: String(artifactId) }).toString()}`;
}
