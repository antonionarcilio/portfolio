import { useTranslations } from 'next-intl';
import type { ProjectEntry } from 'portfolio-content-model';

import { Accordion } from '@/shared/components/accordion';
import { Chip } from '@/shared/components/chip';
import { MarkdownText } from '@/shared/components/markdown-text';

type ProjectAccordionsProps = {
  project: ProjectEntry;
};

type TextSection = 'whereIWorked' | 'challenges' | 'solution' | 'impact';

/** Which CMS field feeds each accordion — a section with no text in the CMS is hidden. */
function readTextSections(project: ProjectEntry): Array<{ section: TextSection; text: string | undefined }> {
  return [
    { section: 'whereIWorked', text: project.whatIBuilt },
    { section: 'challenges', text: project.challenge },
    { section: 'solution', text: project.objective },
    { section: 'impact', text: project.result },
  ];
}

/** Text accordions (from the CMS markdown fields) followed by the stack chips. */
export function ProjectAccordions({ project }: ProjectAccordionsProps) {
  const t = useTranslations('pro.projectDetail.accordionLabels');
  const textSections = readTextSections(project).filter(({ text }) => Boolean(text));

  return (
    <div className="flex w-full flex-col">
      {textSections.map(({ section, text }, index) => (
        <Accordion key={section} label={t(section)} defaultExpanded={index === 0}>
          <MarkdownText className="gap-[24px] font-portfolio text-md font-light text-alpha-black-100 text-pretty">
            {text ?? ''}
          </MarkdownText>
        </Accordion>
      ))}
      {project.stacks.length > 0 && (
        <Accordion label={t('stack')} defaultExpanded>
          <ul className="flex flex-wrap items-start gap-[14px]">
            {project.stacks.map((technology) => (
              <li key={technology}>
                <Chip label={technology} size="lg" />
              </li>
            ))}
          </ul>
        </Accordion>
      )}
    </div>
  );
}
