import { useTranslations } from 'next-intl';
import type { ExperienceEntry } from 'portfolio-content-model';

import { MarkdownText } from '@/shared/components/markdown-text';
import { ScrambleText } from '@/shared/components/scramble-text';

type ExperienceRowProps = {
  experience: ExperienceEntry;
};

function formatYear(iso: string): string {
  return iso.slice(0, 4);
}

/** One experience on the parent's 3-column subgrid: period, role @ company and the markdown description. */
export function ExperienceRow({ experience }: ExperienceRowProps) {
  const t = useTranslations('pro.about');
  const endLabel = experience.endDate ? formatYear(experience.endDate) : t('present');
  const dateRange = `${formatYear(experience.startDate)} – ${endLabel}`;
  const companyDisplay = [...new Set([experience.company, ...experience.companyAliases])].join(' | ');

  return (
    <div className="flex min-w-0 flex-col gap-[16px] min-[1020px]:col-span-3 min-[1020px]:grid min-[1020px]:gap-x-[32px] min-[1020px]:[grid-template-columns:subgrid]">
      <p className="min-[1020px]:sticky min-[1020px]:top-[var(--header-height)] self-start font-portfolio font-light text-md text-alpha-black-60 whitespace-nowrap">
        <ScrambleText>{dateRange}</ScrambleText>
      </p>

      <div className="min-[1020px]:sticky min-[1020px]:top-[var(--header-height)] self-start flex flex-col">
        <p className="font-portfolio font-regular text-md text-alpha-black-60">
          <ScrambleText>{experience.role}</ScrambleText>
        </p>
        <p className="font-portfolio font-regular text-md text-alpha-black-60">
          <ScrambleText>{`@ ${companyDisplay}`}</ScrambleText>
        </p>
      </div>

      {experience.description && (
        <MarkdownText className="gap-4 font-portfolio font-regular text-md text-alpha-black-100">
          {experience.description}
        </MarkdownText>
      )}
    </div>
  );
}
