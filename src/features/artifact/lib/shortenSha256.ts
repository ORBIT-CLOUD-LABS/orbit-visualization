/** 표에 넣을 짧은 해시. 앞 8자와 끝 4자만 남긴다. 예: "a80ed4b4…9c21" */
export function shortenSha256(sha256: string): string {
  if (sha256.length <= 12) {
    return sha256;
  }
  return `${sha256.slice(0, 8)}…${sha256.slice(-4)}`;
}
