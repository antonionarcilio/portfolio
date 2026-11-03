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
    // Outer grid defines the 3-column track; each row uses subgrid so every row shares the same
    // track widths. Each row is the sticky containing block, so its sticky columns release when it ends.
    <section
      className="grid gap-y-[120px]"
      style={{ gridTemplateColumns: 'fit-content(100%) fit-content(100%) minmax(0, 1fr)' }}
    >
      <ProfileRow {...profile} />
      {sortExperienceByRecency(experience).map((entry) => (
        <ExperienceRow key={`${entry.company}-${entry.startDate}`} experience={entry} />
      ))}
    </section>
  );
}
