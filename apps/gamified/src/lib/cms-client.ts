import { createCmsClient } from 'portfolio-cms-client';

import { env } from '@/env';

export const cmsClient = createCmsClient({
  owner: env.CMS_GITHUB_OWNER,
  repo: env.CMS_GITHUB_REPO,
  branch: env.CMS_GITHUB_BRANCH,
});
