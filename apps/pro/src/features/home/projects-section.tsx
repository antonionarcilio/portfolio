import { useTranslations } from 'next-intl';

import arrowUpRightIcon from '@/_assets/icons/lucide-arrow-up-right.svg';
import fingerprintPatternIcon from '@/_assets/icons/lucide-fingerprint-pattern.svg';
import { Chip } from '@/shared/components/chip';
import { TriggerWithHelp } from '@/shared/components/trigger-with-help';

import { ScrambleText } from '@/shared/components/scramble-text';
import type { ProjectCardSummary } from '@/shared/utils/project-card-summary';
import { ProjectCard } from './project-card';

type ProjectsSectionProps = {
  projects: ProjectCardSummary[];
  /** Pre-formatted "+N" for the CTA hint; omitted when no project is left out of the cards. */
  remainingHint?: string;
};

export function ProjectsSection({ projects, remainingHint }: ProjectsSectionProps) {
  const t = useTranslations('pro.home');

  return (
    <section className="mx-auto flex w-full max-w-content items-center justify-center">
      <div className="flex w-full max-w-[932px] flex-col items-stretch gap-3xl desktop:flex-row desktop:items-start">
        {/* Left content — sticky while cards scroll past */}
        <div className="flex w-full shrink-0 flex-col desktop:sticky desktop:top-8 desktop:w-column flex-col items-start gap-2xl">
          <div className="flex flex-col items-start gap-lg">
            <Chip label={t('projectsChip')} iconLeading={fingerprintPatternIcon} size="lg" />
            <h2 className="text-display-md font-regular font-portfolio-title text-alpha-black-100">
              <ScrambleText>{t('projectsHeading')}</ScrambleText>
            </h2>
            <p className="text-md font-regular font-portfolio text-alpha-black-100">
              <ScrambleText>{t('projectsBody')}</ScrambleText>
            </p>
          </div>
          <TriggerWithHelp
            label={t('projectsCta')}
            iconSrc={arrowUpRightIcon}
            helpLabel={remainingHint}
            href="/works"
            size="lg"
          />
        </div>

        {/* Right column — project cards */}
        <div className="flex w-full flex-1 flex-col items-stretch gap-3xl max-tablet:gap-lg desktop:items-start">
          {projects.map(({ slug, ...project }) => (
            <ProjectCard key={slug} href={`/works/${slug}`} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
