const ID_PATTERN = /^[1-9]\d*$/;

/** URL 의 campaignId·artifactId 를 숫자로 읽는다. 양의 정수가 아니면 null */
export function parseId(value: string | null | undefined): number | null {
  if (value === null || value === undefined || !ID_PATTERN.test(value)) {
    return null;
  }
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}
