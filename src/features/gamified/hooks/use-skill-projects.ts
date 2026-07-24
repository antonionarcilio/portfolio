'use client';

import { useMemo } from 'react';

import type { ProjectEntry } from '@/shared/types/portfolio';

/** Filtra `projects` pelos que usam ao menos uma das tecnologias em `technologyNames` (por nome, já disponível via props — sem fetch). */
export function useSkillProjects(projects: ProjectEntry[], technologyNames: string[]): ProjectEntry[] {
  const namesKey = technologyNames.filter(Boolean).sort().join(',');

  return useMemo(() => {
    if (!namesKey) return [];
    const names = new Set(namesKey.split(','));
    return projects.filter((project) => project.stacks.some((stack) => names.has(stack)));
  }, [projects, namesKey]);
}
