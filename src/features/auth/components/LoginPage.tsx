import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router';

import { tokenStorage } from '@/shared/auth/tokenStorage';
import { ROUTES } from '@/shared/config/routes';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

import { useLoginWithToken } from '../hooks/useLoginWithToken';
import { toLoginErrorAlert } from './toLoginErrorAlert';

function validateToken(token: string): string | undefined {
  if (token === '') {
    return '관리자 토큰을 입력해 주세요.';
  }
  if (!tokenStorage.isValid(token)) {
    return '토큰 형식이 올바르지 않습니다. 공백 없이 입력해 주세요.';
  }
  return undefined;
}

/** 01 토큰 입력. 토큰을 서버에 확인한 뒤 저장하고 대시보드로 보낸다 */
export function LoginPage() {
  const navigate = useNavigate();
  const login = useLoginWithToken();
  const [token, setToken] = useState('');
  const [fieldError, setFieldError] = useState<string>();

  if (tokenStorage.get() !== null) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = token.trim();
    const error = validateToken(trimmed);
    setFieldError(error);
    if (error !== undefined) {
      return;
    }
    login.mutate(trimmed, {
      onSuccess: () => {
        void navigate(ROUTES.dashboard, { replace: true });
      },
    });
  }

  const errorAlert = login.isError ? toLoginErrorAlert(login.error) : undefined;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-4">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="size-10 rounded-full bg-primary" />
        <p className="flex flex-col">
          <span className="text-2xl font-bold text-fg">ORBIT</span>
          <span className="text-xs text-fg-muted">OTA Console</span>
        </p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex w-full max-w-110 flex-col gap-5 rounded-xl border border-line bg-surface p-8"
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-fg">관리자 토큰 입력</h1>
          <p className="text-xs text-fg-muted">
            발급받은 관리자 토큰을 입력해 주세요. 토큰은 이 탭에만 저장되며, 탭을 닫으면 다시
            입력해야 합니다.
          </p>
        </div>

        <Input
          label="관리자 토큰"
          type="password"
          autoComplete="off"
          required
          value={token}
          onChange={(event) => {
            setToken(event.target.value);
          }}
          error={fieldError}
        />

        <Button type="submit" className="w-full" disabled={login.isPending}>
          연결하기
        </Button>

        {errorAlert !== undefined && (
          <Alert type="error" title={errorAlert.title} code={errorAlert.code} />
        )}
      </form>
    </main>
  );
}
