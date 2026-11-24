export const campaignKeys = {
  all: ['campaigns'] as const,
  list: () => [...campaignKeys.all, 'list'] as const,
  /** 등록 화면에서 고를 파일 목록. 파일 기능을 가져오지 않으려고 캠페인 기능 안에서 따로 캐시한다 */
  artifactOptions: () => [...campaignKeys.all, 'artifact-options'] as const,
};
