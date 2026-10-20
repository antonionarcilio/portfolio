import { useTranslations } from 'next-intl';

import { Chip } from '@/shared/components/chip';
import { TriggerWithHelp } from '@/shared/components/trigger-with-help';

import { ProjectCard } from './project-card';

const PROJECTS = [
  {
    imageSrc: '/projects/bi.png',
    imageAlt: 'BI Dashboard',
    title: 'BI Dashboard',
    year: '2022',
    role: 'Frontend',
    techStack: 'React, JavaScript +3',
  },
  {
    imageSrc: '/projects/bi-02.png',
    imageAlt: 'BI Analytics',
    title: 'BI Analytics',
    year: '2022',
    role: 'Frontend',
    techStack: 'React, JavaScript +2',
  },
  {
    imageSrc: '/projects/blog-ftec-01.png',
    imageAlt: 'Blog FTEC',
    title: 'Blog FTEC',
    year: '2023',
    role: 'Frontend',
    techStack: 'React, WordPress +2',
  },
] as const;

export function ProjectsSection() {
  const t = useTranslations('pro.home');

  return (
    <section className="mx-auto flex w-[986px] items-center justify-center">
      <div className="flex w-[932px] items-start gap-[32px]">
        {/* Left content — sticky while cards scroll past */}
        <div className="sticky top-8 flex w-[450px] shrink-0 flex-col items-start gap-[22px]">
          <div className="flex flex-col items-start gap-3">
            <Chip label={t('projectsChip')} iconLeading="/icons/lucide-fingerprint-pattern.svg" size="md" />
            <h2 className="text-display-md font-regular font-portfolio-title text-alpha-black-100">
              {t('projectsHeading')}
            </h2>
            <p className="text-md font-regular font-portfolio text-alpha-black-100">{t('projectsBody')}</p>
          </div>
          <TriggerWithHelp
            label={t('projectsCta')}
            iconSrc="/icons/lucide-arrow-up-right.svg"
            helpLabel="+10"
            href="/works"
          />
        </div>

        {/* Right column — project cards */}
        <div className="flex flex-1 flex-col items-start gap-[32px]">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.imageSrc} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
