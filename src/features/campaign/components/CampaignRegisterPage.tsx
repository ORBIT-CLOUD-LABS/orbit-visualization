import { useNavigate, useSearchParams } from 'react-router';

import { ROUTES, routePaths } from '@/shared/config/routes';
import { Breadcrumb } from '@/shared/ui/Breadcrumb';
import { Topbar } from '@/shared/ui/Topbar';

import { useArtifactOptions } from '../hooks/useArtifactOptions';
import { useRegisterCampaign } from '../hooks/useRegisterCampaign';
import { parseId } from '../lib/parseId';
import { CampaignRegisterForm } from './CampaignRegisterForm';
import { RejectionGuide } from './RejectionGuide';

/** 06 캠페인 등록. 파일 상세에서 오면 ?artifactId= 의 파일을 골라 둔다. 등록하면 상세로 이동한다 */
export function CampaignRegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const artifacts = useArtifactOptions();
  const registration = useRegisterCampaign();

  // 입력을 고치면 지난 실패 안내는 맞지 않으므로 지운다
  function handleEdit() {
    if (registration.isError) {
      registration.reset();
    }
  }

  return (
    <>
      <Topbar title="캠페인 등록" />
      <div className="flex flex-col gap-6 p-8">
        <Breadcrumb parent={{ label: '캠페인', to: ROUTES.campaigns }} current="새 캠페인" />
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          <CampaignRegisterForm
            artifactOptions={artifacts.data}
            isArtifactsLoadFailed={artifacts.isError}
            onRetryArtifacts={() => void artifacts.refetch()}
            initialArtifactId={parseId(searchParams.get('artifactId'))}
            isSubmitting={registration.isPending}
            error={registration.error}
            onEdit={handleEdit}
            onSubmit={(input) =>
              registration.mutate(input, {
                onSuccess: ({ campaignId }) => {
                  void navigate(routePaths.campaignDetail(campaignId));
                },
              })
            }
          />
          <div className="xl:w-90 xl:shrink-0">
            <RejectionGuide />
          </div>
        </div>
      </div>
    </>
  );
}
