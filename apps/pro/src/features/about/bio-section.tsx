import { useTranslations } from 'next-intl';
import Image from 'next/image';

import type { ExperienceEntry } from 'portfolio-content-model';

import profilePhoto from '@/_assets/me/antonio-pixel-art-250x250.jpeg';
import { ButtonUnderline } from '@/shared/components/button-underline';
import { GrayscaleReveal } from '@/shared/components/grayscale-reveal';

type BioSectionProps = {
  name: string;
  role: string;
  location: string;
  /** Plain-text bio — paragraphs separated by double newlines. */
  bio: string;
  linkedinUrl: string;
  githubUrl: string;
  email: string;
  experience: ExperienceEntry[];
};

function formatYear(iso: string): string {
  return new Date(iso).getUTCFullYear().toString();
}

/** Strips bold/italic markdown markers so plain-text fields don't leak syntax. */
function stripInlineMarkdown(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1');
}

function Paragraphs({ text, className }: { text: string; className: string }) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} className={className}>
          {stripInlineMarkdown(para.trim())}
        </p>
      ))}
    </>
  );
}

export function BioSection({ name, role, location, bio, linkedinUrl, githubUrl, email, experience }: BioSectionProps) {
  const t = useTranslations('pro.about');
  const firstExp = experience[0] ?? null;

  const dateRange = firstExp
    ? `${formatYear(firstExp.startDate)} – ${firstExp.endDate ? formatYear(firstExp.endDate) : t('present')}`
    : null;

  const companyDisplay = firstExp ? [...new Set([firstExp.company, ...firstExp.companyAliases])].join(' | ') : null;

  return (
    // Outer grid defines the 3-column track; inner wrappers use subgrid so
    // both rows share the same track widths. Each wrapper is the sticky
    // containing block, so sticky elements in row 1 release when row 1 ends.
    <section
      className="grid gap-y-[120px]"
      style={{ gridTemplateColumns: 'fit-content(100%) fit-content(100%) minmax(0, 1fr)' }}
    >
      {/* Row 1 — profile */}
      <div className="col-span-3 grid gap-x-[32px]" style={{ gridTemplateColumns: 'subgrid' }}>
        {/* Col 1 — Profile photo */}
        <GrayscaleReveal className="sticky top-[var(--header-height)] self-start size-[208px] rounded-[8px] overflow-hidden">
          <Image
            src={profilePhoto}
            alt={name}
            width={208}
            height={208}
            className="block size-full object-cover"
            draggable={false}
          />
        </GrayscaleReveal>

        {/* Col 2 — Identity card */}
        <div className="sticky top-[var(--header-height)] self-start flex flex-col gap-4 items-start">
          <div className="flex flex-col gap-1">
            <p className="font-portfolio-title font-regular text-display-xs text-alpha-black-100">{name}</p>
            <p className="font-portfolio font-regular text-md text-alpha-black-60">{role}</p>
            <p className="font-portfolio font-regular text-md text-alpha-black-60">{location}</p>
          </div>
          <div className="flex gap-4 items-center flex-wrap">
            <ButtonUnderline label="LinkedIn" href={linkedinUrl} external />
            <ButtonUnderline label="Email" href={`mailto:${email}`} />
            <ButtonUnderline label="Github" href={githubUrl} external />
          </div>
        </div>

        {/* Col 3 — Bio text */}
        <div className="flex flex-col gap-4">
          {bio && <Paragraphs text={bio} className="font-portfolio font-regular text-md text-alpha-black-100" />}
        </div>
      </div>

      {/* Row 2 — first experience entry */}
      {firstExp && (
        <div className="col-span-3 grid gap-x-[32px]" style={{ gridTemplateColumns: 'subgrid' }}>
          {/* Col 1 — Date range */}
          <p className="sticky top-[var(--header-height)] self-start font-portfolio font-light text-md text-alpha-black-60 whitespace-nowrap">
            {dateRange}
          </p>

          {/* Col 2 — Role @ Company */}
          <div className="sticky top-[var(--header-height)] self-start flex flex-col">
            <p className="font-portfolio font-regular text-md text-alpha-black-60">{firstExp.role}</p>
            <p className="font-portfolio font-regular text-md text-alpha-black-60">@ {companyDisplay}</p>
          </div>

          {/* Col 3 — Experience description */}
          <div className="flex flex-col gap-4">
            {firstExp.description && (
              <Paragraphs
                text={firstExp.description}
                className="font-portfolio font-regular text-md text-alpha-black-100"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
