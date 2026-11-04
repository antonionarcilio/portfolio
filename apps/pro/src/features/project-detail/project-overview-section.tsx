import type { ProjectEntry } from 'portfolio-content-model';

import { StickyColumn } from '@/shared/components/sticky-column';

import { ProjectCoversColumn } from './project-covers-column';
import { ProjectInfoColumn } from './project-info-column';

/** Abaixo de 1020px as colunas empilham: deixam de ser sticky e ocupam a largura toda. */
const STACKED_COLUMN_CLASS = 'max-[1019px]:static max-[1019px]:w-full';

type ProjectOverviewSectionProps = {
  project: ProjectEntry;
};

/** Section 1: sticky info column on the left, scrolling covers on the right. */
export function ProjectOverviewSection({ project }: ProjectOverviewSectionProps) {
  return (
    <section className="mx-auto flex w-full max-w-[986px] flex-col items-stretch gap-[24px] pt-[16px] min-[1020px]:flex-row min-[1020px]:items-start min-[1020px]:justify-between min-[1020px]:pt-[32px]">
      {/* The info column already carries 36px of vertical padding, so it sticks at 0 and the covers
          at 36 to line up with its text. Each column sticks on its own, whichever is taller. */}
      <StickyColumn topOffsetPixels={0} className={STACKED_COLUMN_CLASS}>
        <ProjectInfoColumn project={project} />
      </StickyColumn>
      <StickyColumn topOffsetPixels={36} className={STACKED_COLUMN_CLASS}>
        <ProjectCoversColumn project={project} />
      </StickyColumn>
    </section>
  );
}
