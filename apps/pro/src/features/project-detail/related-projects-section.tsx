import { useTranslations } from 'next-intl';

import arrowLeftIcon from '@/_assets/icons/lucide-arrow-left.svg';
import { Link } from '@/i18n/navigation';
import { Chip } from '@/shared/components/chip';
import { ScrambleText } from '@/shared/components/scramble-text';
import type { ProjectCardSummary } from '@/shared/utils/project-card-summary';

import { RelatedProjectsGrid } from './related-projects-grid';

type RelatedProjectsSectionProps = {
  /** Every project except the current one; the grid draws which ones to show. */
  candidates: ProjectCardSummary[];
};

/**
 * Section 2: "see also" heading, a chip back to the works list and two random works cards.
 * @example <RelatedProjectsSection candidates={selectRelatedCandidates(data.projects, 'portal')} />
 */
export function RelatedProjectsSection({ candidates }: RelatedProjectsSectionProps) {
  const t = useTranslations('pro.projectDetail');

  return (
    <section className="mx-auto flex w-full max-w-[986px] flex-col gap-[32px]">
      <div className="flex w-full flex-wrap items-center justify-between gap-[16px]">
        <h2 className="font-portfolio-title text-display-md font-regular text-alpha-black-100 min-[1020px]:whitespace-nowrap">
          <ScrambleText>{t('relatedHeading')}</ScrambleText>
        </h2>
        <Link href="/works" className="rounded-[50px] focus-visible:outline-none">
          <Chip label={t('relatedViewAll')} iconLeading={arrowLeftIcon} size="lg" />
        </Link>
      </div>
      <RelatedProjectsGrid candidates={candidates} />
    </section>
  );
}
