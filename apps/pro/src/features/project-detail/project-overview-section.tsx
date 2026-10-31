import type { ProjectEntry } from 'portfolio-content-model';

import { StickyColumn } from '@/shared/components/sticky-column';

import { ProjectCoversColumn } from './project-covers-column';
import { ProjectInfoColumn } from './project-info-column';

type ProjectOverviewSectionProps = {
  project: ProjectEntry;
};

/** Section 1: sticky info column on the left, scrolling covers on the right. */
export function ProjectOverviewSection({ project }: ProjectOverviewSectionProps) {
  return (
    <section className="mx-auto flex w-full max-w-[986px] items-start justify-between pt-[32px]">
      {/* The info column already carries 36px of vertical padding, so it sticks at 0 and the covers
          at 36 to line up with its text. Each column sticks on its own, whichever is taller. */}
      <StickyColumn topOffsetPixels={0}>
        <ProjectInfoColumn project={project} />
      </StickyColumn>
      <StickyColumn topOffsetPixels={36}>
        <ProjectCoversColumn project={project} />
      </StickyColumn>
    </section>
  );
}
