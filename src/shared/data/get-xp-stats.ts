import 'server-only';

import { PortfolioXpStatsDocument } from '@/gql/graphql';
import { query } from '@/lib/apollo-client';
import { DEFAULT_LOCALE } from '@/shared/i18n/locales';
import type { PortfolioData } from '@/shared/types/portfolio';

export async function getXpStats(locale = DEFAULT_LOCALE): Promise<PortfolioData['level'] | null> {
  const { data } = await query({
    query: PortfolioXpStatsDocument,
    variables: { locale },
  });

  if (!data?.portfolioXpStats) return null;

  const { currentXp, nextLevelXp, fill, label } = data.portfolioXpStats;
  return {
    label,
    fill,
    sub: `${currentXp} / ${nextLevelXp}`,
  };
}
