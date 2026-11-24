/** HW 버전·지역 목록. 비어 있으면 모든 차량이 대상이다. 예: "HW1, HW2" */
export function formatTargetList(values: readonly string[]): string {
  return values.length === 0 ? '전체' : values.join(', ');
}

/** 대상 차량의 현재 버전 범위. 양 끝을 포함하고, 없는 쪽은 제한이 없다. 예: "1.0.0 ~ 1.0.9" */
export function formatVersionRange(min: string | null, max: string | null): string {
  if (min === null && max === null) {
    return '제한 없음';
  }
  if (max === null) {
    return `${min} 이상`;
  }
  if (min === null) {
    return `${max} 이하`;
  }
  return `${min} ~ ${max}`;
}
