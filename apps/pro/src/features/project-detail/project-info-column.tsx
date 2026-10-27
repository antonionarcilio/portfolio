import { useTranslations } from 'next-intl';

import monitorIcon from '@/_assets/icons/solar-monitor.svg';
import { Accordion } from '@/shared/components/accordion';
import { ButtonUnderline } from '@/shared/components/button-underline';
import { Chip } from '@/shared/components/chip';
import { ScrambleText } from '@/shared/components/scramble-text';

import type { ProjectDetail } from './project-details';
import { TeamRoleItem } from './team-role-item';

type ProjectInfoColumnProps = {
  project: ProjectDetail;
};

type MetadataLineProps = {
  label: string;
  value: string;
};

function MetadataLine({ label, value }: MetadataLineProps) {
  return (
    <p className="flex font-portfolio text-md font-regular text-alpha-black-100">
      <span className="font-bold">
        <ScrambleText>{label}</ScrambleText>
      </span>
      <span className="whitespace-pre">
        <ScrambleText>{`: ${value}`}</ScrambleText>
      </span>
    </p>
  );
}

/** Texts stored as one string with blank lines between paragraphs, like the CMS bio. */
function splitParagraphs(text: string): string[] {
  return text.split('\n\n');
}

/**
 * Left column of the project page: chip, title, metadata (year, client, team), visit link and
 * the accordions. Wrapped in a `StickyColumn` by the section.
 */
export function ProjectInfoColumn({ project }: ProjectInfoColumnProps) {
  const t = useTranslations('pro.projectDetail');
  const tWorks = useTranslations('pro.works');
  const projectKey = `projects.${project.messageKey}` as const;

  return (
    <div className="flex w-[430px] shrink-0 flex-col gap-[22px] py-[36px]">
      <div className="flex w-full flex-col items-start gap-[14px]">
        <Chip label={tWorks(`projectRoles.${project.roleKey}`)} iconLeading={monitorIcon} size="lg" />
        <h1 className="w-full font-portfolio-title text-display-md font-regular text-alpha-black-100">
          <ScrambleText>{t(`${projectKey}.title`)}</ScrambleText>
        </h1>
        <div className="flex w-full flex-col gap-[4px]">
          <MetadataLine label={t('yearLabel')} value={t(`${projectKey}.period`)} />
          <MetadataLine label={t('clientLabel')} value={project.client} />
          <div className="flex w-full gap-[4px] font-portfolio text-md font-regular text-alpha-black-100">
            <span className="font-bold">
              <ScrambleText>{`${t('teamLabel')}:`}</ScrambleText>
            </span>
            <ul className="flex min-w-px flex-1 flex-wrap items-center gap-y-[2px]">
              {project.team.map((entry, index) => (
                <li key={entry.roleKey} className="flex items-center">
                  <TeamRoleItem roleLabel={t(`roles.${entry.roleKey}`)} memberIds={entry.memberIds} />
                  {index < project.team.length - 1 && <span className="whitespace-pre">{', '}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {project.visitUrl && <ButtonUnderline label={t('visitLabel')} href={project.visitUrl} external size="lg" />}
      </div>

      <div className="flex w-full flex-col">
        <Accordion label={t('accordionLabels.whereIWorked')} defaultExpanded>
          <div className="flex flex-col gap-[24px] font-portfolio text-md font-light text-alpha-black-100 text-pretty">
            {splitParagraphs(t(`${projectKey}.whereIWorked`)).map((paragraph) => (
              <p key={paragraph}>
                <ScrambleText>{paragraph}</ScrambleText>
              </p>
            ))}
          </div>
        </Accordion>
        {(['challenges', 'solution', 'impact'] as const).map((section) => (
          <Accordion key={section} label={t(`accordionLabels.${section}`)}>
            <p className="font-portfolio text-md font-light text-alpha-black-100 text-pretty">
              <ScrambleText>{t(`${projectKey}.${section}`)}</ScrambleText>
            </p>
          </Accordion>
        ))}
        <Accordion label={t('accordionLabels.stack')} defaultExpanded>
          <ul className="flex flex-wrap items-start gap-[14px]">
            {project.stack.map((technology) => (
              <li key={technology}>
                <Chip label={technology} size="lg" />
              </li>
            ))}
          </ul>
        </Accordion>
      </div>
    </div>
  );
}
