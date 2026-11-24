import { Topbar } from '@/shared/ui/Topbar';

import { useRegisterArtifact } from '../hooks/useRegisterArtifact';
import { ArtifactRegisterForm } from './ArtifactRegisterForm';
import { Breadcrumb } from './Breadcrumb';
import { RegistrationResultCard } from './RegistrationResultCard';
import { SigningGuide } from './SigningGuide';

/** 09 파일 등록. 등록하면 오른쪽에 결과 카드를 보여 준다 */
export function ArtifactRegisterPage() {
  const registration = useRegisterArtifact();

  return (
    <>
      <Topbar title="파일 등록" />
      <div className="flex flex-col gap-6 p-8">
        <Breadcrumb current="새 파일 등록" />
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          <ArtifactRegisterForm
            isSubmitting={registration.isPending}
            error={registration.error}
            onSubmit={(input) => registration.mutate(input)}
          />
          <div className="flex flex-col gap-6 xl:w-90 xl:shrink-0">
            <SigningGuide />
            {registration.data !== undefined && (
              <RegistrationResultCard result={registration.data} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
