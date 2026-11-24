import { Link } from 'react-router';

import { ROUTES } from '@/shared/config/routes';
import { buttonClassName } from '@/shared/ui/buttonClassName';

type RegisterArtifactLinkProps = {
  children: string;
};

export function RegisterArtifactLink({ children }: RegisterArtifactLinkProps) {
  return (
    <Link to={ROUTES.artifactNew} className={buttonClassName()}>
      {children}
    </Link>
  );
}
