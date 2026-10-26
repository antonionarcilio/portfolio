import { useTranslations } from 'next-intl';
import Image from 'next/image';

import academicCapIcon from '@/_assets/icons/solar-square-academic-cap.svg';
import scientistIllustration from '@/_assets/illustrations/scientist.svg';
import { Chip } from '@/shared/components/chip';
import { ScrambleText } from '@/shared/components/scramble-text';

const EDUCATION_ENTRIES = [
  { year: '2026 - 2027', titleKey: 'educationSoftwareEngineering', institution: 'PUC Minas' },
  { year: '2018 - 2021', titleKey: 'educationSystemsAnalysis', institution: 'Wyden' },
] as const;

export function EducationSection() {
  const t = useTranslations('pro.about');

  return (
    <section className="flex items-center justify-center gap-[22px]">
      {/* Left — text content */}
      <div className="flex shrink-0 flex-col items-start gap-[32px]">
        <div className="flex w-[430px] flex-col items-start gap-[12px]">
          <Chip label={t('educationChip')} iconLeading={academicCapIcon} size="md" />
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
          {EDUCATION_ENTRIES.map((entry) => (
            <EntryRow key={entry.titleKey} entry={entry} title={t(entry.titleKey)} />
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

function EntryRow({ entry, title }: { entry: (typeof EDUCATION_ENTRIES)[number]; title: string }) {
  return (
    <>
      <p className="self-start font-portfolio font-light text-md text-alpha-black-60 whitespace-nowrap">{entry.year}</p>
      <div className="flex flex-col self-start">
        <p className="w-max font-portfolio font-semibold text-md text-alpha-black-90">
          <ScrambleText>{title}</ScrambleText>
        </p>
        <p className="font-portfolio font-regular text-md text-alpha-black-80">@ {entry.institution}</p>
      </div>
    </>
  );
}
