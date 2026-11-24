import { Card } from './Card';

// 서버 FirmwareSignaturePayload 와 같은 다섯 줄(형식·차종·버전·SHA-256·크기)에 서명한다
const SIGNING_COMMAND = `payload=$(printf \\
  'orbit-firmware-v1\\n%s\\n%s\\n%s\\n%s' \\
  "$MODEL" "$VERSION" "$SHA256" "$SIZE")
vault write -field=signature \\
  transit/sign/firmware-signing \\
  input=$(printf %s "$payload" | base64)
# → vault:v1:<base64>  ⇒ keyId=v1`;

export function SigningGuide() {
  return (
    <Card title="서명 만드는 법" description="등록 전에 관리자 Vault 계정으로 서명합니다">
      <pre className="overflow-x-auto rounded-md bg-inverse p-3 font-mono text-2xs text-code">
        {SIGNING_COMMAND}
      </pre>
      <p className="text-xs text-fg-muted">
        서버는 차종·버전·파일 해시·크기로 서명을 다시 검증합니다. 서명이 없거나 키 버전이 맞지
        않으면 등록되지 않습니다.
      </p>
    </Card>
  );
}
