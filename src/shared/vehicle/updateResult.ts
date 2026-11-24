/** 차량의 업데이트 결과. 결과가 없으면 null 로 받는다 (진행 중·대상 아님 값은 없다) */
export const UPDATE_RESULTS = ['SUCCEEDED', 'FAILED'] as const;
export type UpdateResult = (typeof UPDATE_RESULTS)[number];
