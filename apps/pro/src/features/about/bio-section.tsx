import type { ExperienceEntry } from 'portfolio-content-model';

import { ExperienceRow } from './experience-row';
import { ProfileRow } from './profile-row';
import { sortExperienceByRecency } from './sort-experience-by-recency';

type BioSectionProps = {
  name: string;
  role: string;
  location: string;
  /** Markdown bio from the CMS. */
  bio: string;
  avatarUrl: string | null;
  linkedinUrl: string;
  githubUrl: string;
  email: string;
  experience: ExperienceEntry[];
};

export function BioSection({ experience, ...profile }: BioSectionProps) {
  return (
    // Desde 1020px: o grid externo define as 3 colunas e cada linha usa subgrid, então todas dividem as mesmas
    // larguras. Cada linha é o containing block do sticky, que se solta quando ela termina.
    // Abaixo de 1020px é uma coluna só e cada linha empilha seus blocos.
    <section className="grid grid-cols-1 gap-y-[64px] min-[1020px]:gap-y-[120px] min-[1020px]:[grid-template-columns:fit-content(100%)_fit-content(100%)_minmax(0,1fr)]">
      <ProfileRow {...profile} />
      {sortExperienceByRecency(experience).map((entry) => (
        <ExperienceRow key={`${entry.company}-${entry.startDate}`} experience={entry} />
      ))}
    </section>
  );
}
