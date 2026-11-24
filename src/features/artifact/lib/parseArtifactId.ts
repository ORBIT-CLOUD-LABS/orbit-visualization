const ID_PATTERN = /^[1-9]\d*$/;

/** URL 의 artifactId 를 숫자로 읽는다. 양의 정수가 아니면 null (없는 파일로 본다) */
export function parseArtifactId(value: string | undefined): number | null {
  if (value === undefined || !ID_PATTERN.test(value)) {
    return null;
  }
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}
