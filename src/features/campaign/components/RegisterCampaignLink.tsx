import { Link } from 'react-router';

import { ROUTES } from '@/shared/config/routes';
import { buttonClassName } from '@/shared/ui/buttonClassName';

type RegisterCampaignLinkProps = {
  children: string;
};

export function RegisterCampaignLink({ children }: RegisterCampaignLinkProps) {
  return (
    <Link to={ROUTES.campaignNew} className={buttonClassName()}>
      {children}
    </Link>
  );
}
