import { useTranslations } from 'next-intl';
import type { ProjectEntry } from 'portfolio-content-model';

import monitorIcon from '@/_assets/icons/solar-monitor.svg';
import { ButtonUnderline } from '@/shared/components/button-underline';
import { Chip } from '@/shared/components/chip';
import { ScrambleText } from '@/shared/components/scramble-text';
import { formatProjectPeriod } from '@/shared/utils/format-project-period';

import { groupTeamByRole } from './group-team-by-role';
import { ProjectAccordions } from './project-accordions';
import { TeamRoleItem } from './team-role-item';

type ProjectInfoColumnProps = {
  project: ProjectEntry;
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

function TeamLine({ team }: { team: ProjectEntry['team'] }) {
  const t = useTranslations('pro.projectDetail');
  const groups = groupTeamByRole(team);

  return (
    <div className="flex w-full gap-[4px] font-portfolio text-md font-regular text-alpha-black-100">
      <span className="font-bold">
        <ScrambleText>{`${t('teamLabel')}:`}</ScrambleText>
      </span>
      <ul className="flex min-w-px flex-1 flex-wrap items-center gap-y-[2px]">
        {groups.map((group, index) => (
          <li key={group.role} className="flex items-center">
            <TeamRoleItem roleLabel={group.role} members={group.members} />
            {index < groups.length - 1 && <span className="whitespace-pre">{', '}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Left column of the project page: chip, title, metadata (year, client, team), visit link and
 * the accordions. Wrapped in a `StickyColumn` by the section.
 */
export function ProjectInfoColumn({ project }: ProjectInfoColumnProps) {
  const t = useTranslations('pro.projectDetail');
  const period = formatProjectPeriod(project.startDate, project.endDate, t('presentLabel'));

  return (
    <div className="flex w-[430px] shrink-0 flex-col gap-[22px] py-[36px]">
      <div className="flex w-full flex-col items-start gap-[14px]">
        <Chip label={project.expertiseArea} iconLeading={monitorIcon} size="lg" />
        <h1 className="w-full font-portfolio-title text-display-md font-regular text-alpha-black-100">
          <ScrambleText>{project.projectName}</ScrambleText>
        </h1>
        <div className="flex w-full flex-col gap-[4px]">
          <MetadataLine label={t('yearLabel')} value={period} />
          {project.company && <MetadataLine label={t('clientLabel')} value={project.company} />}
          {project.team.length > 0 && <TeamLine team={project.team} />}
        </div>
        {project.projectUrl && <ButtonUnderline label={t('visitLabel')} href={project.projectUrl} external size="lg" />}
      </div>
      <ProjectAccordions project={project} />
    </div>
  );
}
