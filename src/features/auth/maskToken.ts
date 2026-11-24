const MASK = '••••••••';
const VISIBLE_SUFFIX_LENGTH = 4;
// 짧은 토큰은 끝 4자리만으로도 상당 부분이 드러나므로 모두 가린다
const MIN_LENGTH_TO_SHOW_SUFFIX = 9;

/** 화면에 보여 줄 가린 토큰. 예: "Bearer ••••••••3f9a" */
export function maskToken(token: string): string {
  const suffix =
    token.length >= MIN_LENGTH_TO_SHOW_SUFFIX ? token.slice(-VISIBLE_SUFFIX_LENGTH) : '';
  return `Bearer ${MASK}${suffix}`;
}
