import { useState } from 'react';

import { Button } from '@/shared/ui/Button';

type CopyState = 'idle' | 'copied' | 'failed';

const COPY_MESSAGE: Record<CopyState, string> = {
  idle: '',
  copied: '복사했습니다',
  failed: '복사하지 못했습니다. 직접 선택해 복사하세요',
};

type CopySha256ButtonProps = {
  sha256: string;
};

export function CopySha256Button({ sha256 }: CopySha256ButtonProps) {
  const [state, setState] = useState<CopyState>('idle');

  // 보안 연결이 아니면 navigator.clipboard 가 없어 여기서도 실패로 처리한다
  async function copy(): Promise<void> {
    // 다시 눌러도 알림이 바뀌도록 지난 문구를 먼저 지운다
    setState('idle');
    try {
      await navigator.clipboard.writeText(sha256);
      setState('copied');
    } catch {
      setState('failed');
    }
  }

  return (
    <>
      <output aria-live="polite" className="text-xs text-fg-muted">
        {COPY_MESSAGE[state]}
      </output>
      <Button variant="secondary" onClick={() => void copy()}>
        SHA-256 복사
      </Button>
    </>
  );
}
