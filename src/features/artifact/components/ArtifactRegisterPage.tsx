import { ROUTES } from '@/shared/config/routes';
import { Breadcrumb } from '@/shared/ui/Breadcrumb';
import { Topbar } from '@/shared/ui/Topbar';

import { useRegisterArtifact } from '../hooks/useRegisterArtifact';
import { ArtifactRegisterForm } from './ArtifactRegisterForm';
import { RegistrationResultCard } from './RegistrationResultCard';
import { SigningGuide } from './SigningGuide';

/** 09 파일 등록. 등록하면 입력을 비우고 오른쪽에 결과 카드를 보여 준다 */
export function ArtifactRegisterPage() {
  const registration = useRegisterArtifact();

  // 입력을 고치면 지난 실패 안내는 맞지 않으므로 지운다
  function handleEdit() {
    if (registration.isError) {
      registration.reset();
    }
  }

  return (
    <>
      <Topbar title="파일 등록" />
      <div className="flex flex-col gap-6 p-8">
        <Breadcrumb parent={{ label: '파일', to: ROUTES.artifacts }} current="새 파일 등록" />
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          {/* 등록할 때마다 key 가 바뀌어 입력이 비므로 같은 파일을 다시 올리지 않는다 */}
          <ArtifactRegisterForm
            key={registration.data?.artifactId ?? 'new'}
            isSubmitting={registration.isPending}
            error={registration.error}
            onEdit={handleEdit}
            onSubmit={(input) => registration.mutate(input)}
          />
          <div className="flex flex-col gap-6 xl:w-90 xl:shrink-0">
            <SigningGuide />
            {/* 화면 읽기 도구가 결과를 읽도록 live 영역은 항상 두고 안의 내용만 바꾼다 */}
            <div aria-live="polite">
              {registration.data !== undefined && (
                <RegistrationResultCard result={registration.data} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
