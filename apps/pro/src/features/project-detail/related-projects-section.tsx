import { useTranslations } from 'next-intl';

import arrowLeftIcon from '@/_assets/icons/lucide-arrow-left.svg';
import { WORKS_PROJECTS } from '@/features/works/projects';
import { WorksProjectCard } from '@/features/works/works-project-card';
import { Link } from '@/i18n/navigation';
import { Chip } from '@/shared/components/chip';
import { ScrambleText } from '@/shared/components/scramble-text';

const RELATED_PROJECTS_COUNT = 2;

type RelatedProjectsSectionProps = {
  /** Slug of the project being viewed, left out of the suggestions. */
  currentSlug: string;
};

/**
 * Section 2: "see also" heading, a chip back to the works list and two works cards.
 * @example <RelatedProjectsSection currentSlug="corporate-blog-escallo" />
 */
export function RelatedProjectsSection({ currentSlug }: RelatedProjectsSectionProps) {
  const t = useTranslations('pro.projectDetail');
  const relatedProjects = WORKS_PROJECTS.filter((project) => project.id !== currentSlug).slice(
    0,
    RELATED_PROJECTS_COUNT,
  );

  return (
    <section className="mx-auto flex w-full max-w-[986px] flex-col gap-[32px]">
      <div className="flex w-full items-center justify-between">
        <h2 className="font-portfolio-title text-display-md font-regular whitespace-nowrap text-alpha-black-100">
          <ScrambleText>{t('relatedHeading')}</ScrambleText>
        </h2>
        <Link href="/works" className="rounded-[50px] focus-visible:outline-none">
          <Chip label={t('relatedViewAll')} iconLeading={arrowLeftIcon} size="lg" />
        </Link>
      </div>
      <ul
        aria-label={t('relatedLabel')}
        className="grid w-full grid-cols-[repeat(2,minmax(0,1fr))] gap-x-[32px] gap-y-[32px]"
      >
        {relatedProjects.map((project) => (
          <li key={project.id}>
            <WorksProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
