/**
 * 점으로 나눈 숫자 버전을 자리마다 숫자로 비교한다. 서버 DottedVersion 과 같이 빈 자리는 0 으로 본다.
 * 문자열 비교로는 "1.0.10" < "1.0.9" 가 되므로 이 함수를 쓴다.
 * @returns a 가 작으면 음수, 같으면 0, 크면 양수
 */
export function compareVersions(a: string, b: string): number {
  const left = a.split('.').map(Number);
  const right = b.split('.').map(Number);
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) {
      return difference;
    }
  }
  return 0;
}
