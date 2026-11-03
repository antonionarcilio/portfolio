import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { PortfolioData } from 'portfolio-content-model';

import academicCapIcon from '@/_assets/icons/solar-square-academic-cap.svg';
import scientistIllustration from '@/_assets/illustrations/scientist.svg';
import { Chip } from '@/shared/components/chip';
import { ScrambleText } from '@/shared/components/scramble-text';

type EducationEntry = PortfolioData['education'][number];

type EducationSectionProps = {
  education: EducationEntry[];
};

/** "2018 - 2021", or just the end year when the CMS has no start year. */
function formatEducationPeriod(entry: EducationEntry): string {
  return entry.startYear ? `${entry.startYear} - ${entry.endYear}` : entry.endYear;
}

export function EducationSection({ education }: EducationSectionProps) {
  const t = useTranslations('pro.about');

  return (
    <section className="flex items-center justify-center gap-[22px]">
      {/* Left — text content */}
      <div className="flex shrink-0 flex-col items-start gap-[32px]">
        <div className="flex w-[430px] flex-col items-start gap-[14px]">
          <Chip label={t('educationChip')} iconLeading={academicCapIcon} size="lg" />
          <h2 className="font-portfolio-title font-regular text-display-md text-alpha-black-100">
            <ScrambleText>{t('educationHeading')}</ScrambleText>
          </h2>
          <p className="font-portfolio font-regular text-md text-alpha-black-100 text-pretty">
            <ScrambleText>{t('educationBody')}</ScrambleText>
          </p>
        </div>

        <div
          className="grid w-[430px] gap-x-[16px] gap-y-[16px]"
          style={{ gridTemplateColumns: 'fit-content(100%) minmax(0, 1fr)' }}
        >
          {education.map((entry) => (
            <EntryRow key={entry.title} entry={entry} />
          ))}
        </div>
      </div>

      {/* Right — illustration */}
      <div className="flex w-[390px] shrink-0 items-start justify-end overflow-hidden p-[10px]">
        <div className="relative aspect-square min-w-px flex-[1_0_0] overflow-hidden">
          <Image src={scientistIllustration} alt="" aria-hidden fill draggable={false} />
        </div>
      </div>
    </section>
  );
}

function EntryRow({ entry }: { entry: EducationEntry }) {
  return (
    <>
      <p className="self-start font-portfolio font-light text-md text-alpha-black-60 whitespace-nowrap">
        {formatEducationPeriod(entry)}
      </p>
      <div className="flex flex-col self-start">
        <p className="w-max font-portfolio font-semibold text-md text-alpha-black-90">
          <ScrambleText>{entry.title}</ScrambleText>
        </p>
        <p className="font-portfolio font-regular text-md text-alpha-black-80">{`@ ${entry.institution}`}</p>
      </div>
    </>
  );
}
