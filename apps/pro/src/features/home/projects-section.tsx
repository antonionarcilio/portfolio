import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Chip } from '@/shared/components/chip';
import { TriggerWithHelp } from '@/shared/components/trigger-with-help';

type ProjectCardProps = {
  screenshotSrc: string;
  screenshotAlt: string;
};

function ProjectCard({ screenshotSrc, screenshotAlt }: ProjectCardProps) {
  return (
    <div className="relative flex items-end justify-center rounded-2xl bg-grey-100 overflow-hidden w-[450px] h-[337px]">
      <div className="relative w-[340px] h-[280px]">
        <Image src={screenshotSrc} alt={screenshotAlt} width={340} height={280} className="object-contain" />
        {/* iPad shadow overlay */}
        <Image
          src="/projects/ipad-shadow.svg"
          alt=""
          width={340}
          height={280}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        />
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const t = useTranslations('pro.home');

  return (
    <section className="mx-auto flex items-start justify-between w-[986px]">
      {/* Left content */}
      <div className="flex flex-col gap-6 pt-8 w-[450px]">
        <Chip label={t('projectsChip')} iconLeading="/icons/lucide-fingerprint-pattern.svg" />
        <h2 className="text-display-md font-bold font-portfolio-title text-grey-700">{t('projectsHeading')}</h2>
        <p className="text-md font-regular font-portfolio text-alpha-black-80">{t('projectsBody')}</p>
        <TriggerWithHelp label={t('projectsCta')} iconSrc="/icons/lucide-arrow-up-right.svg" href="/works" />
      </div>

      {/* Right project cards */}
      <div className="flex flex-col gap-6">
        <ProjectCard screenshotSrc="/projects/blog-ftec.png" screenshotAlt="Blog FTEC" />
        <ProjectCard screenshotSrc="/projects/blog-escallo.png" screenshotAlt="Blog Escallo" />
      </div>
    </section>
  );
}
