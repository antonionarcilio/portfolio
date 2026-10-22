import Image from 'next/image';

import academicCapIcon from '@/_assets/icons/solar-square-academic-cap.svg';
import scientistIllustration from '@/_assets/illustrations/scientist.svg';
import { Chip } from '@/shared/components/chip';

const EDUCATION_ENTRIES = [
  { year: '2026 - 2027', title: 'Engenharia de Software', institution: 'PUC Minas' },
  { year: '2018 - 2021', title: 'Análise e Desenvolvimento de Sistemas', institution: 'Wyden' },
] as const;

export function EducationSection() {
  return (
    <section className="flex items-center justify-center gap-[22px]">
      {/* Left — text content */}
      <div className="flex shrink-0 flex-col items-start gap-[32px]">
        <div className="flex w-[430px] flex-col items-start gap-[12px]">
          <Chip label="Formações" iconLeading={academicCapIcon} size="md" />
          <h2 className="font-portfolio-title font-regular text-display-md text-alpha-black-100">
            Estudar. Aplicar. Evoluir.
          </h2>
          <p className="font-portfolio font-regular text-md text-alpha-black-100 text-pretty">
            Minha trajetória acadêmica e os conhecimentos que venho desenvolvendo para evoluir como profissional de
            tecnologia.
          </p>
        </div>

        <div
          className="grid w-[430px] gap-x-[16px] gap-y-[16px]"
          style={{ gridTemplateColumns: 'fit-content(100%) minmax(0, 1fr)' }}
        >
          {EDUCATION_ENTRIES.map((entry) => (
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

function EntryRow({ entry }: { entry: (typeof EDUCATION_ENTRIES)[number] }) {
  return (
    <>
      <p className="self-start font-portfolio font-light text-md text-alpha-black-60 whitespace-nowrap">{entry.year}</p>
      <div className="flex flex-col self-start">
        <p className="w-max font-portfolio font-semibold text-md text-alpha-black-90">{entry.title}</p>
        <p className="font-portfolio font-regular text-md text-alpha-black-80">@ {entry.institution}</p>
      </div>
    </>
  );
}
