export const artifactKeys = {
  all: ['artifacts'] as const,
  list: () => [...artifactKeys.all, 'list'] as const,
  detail: (artifactId: number) => [...artifactKeys.all, 'detail', artifactId] as const,
  /** 이 차종 캠페인 목록. 캠페인 기능을 가져오지 않으려고 파일 기능 안에서 따로 캐시한다 */
  campaigns: (model: string) => [...artifactKeys.all, 'campaigns', model] as const,
};
