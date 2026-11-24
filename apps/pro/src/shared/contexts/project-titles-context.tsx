'use client';
import { createContext, useContext } from 'react';

/** Título de cada projeto indexado pelo slug, no locale atual. */
export type ProjectTitlesBySlug = Readonly<Record<string, string>>;

const ProjectTitlesContext = createContext<ProjectTitlesBySlug>({});

type ProjectTitlesProviderProps = { titlesBySlug: ProjectTitlesBySlug; children: React.ReactNode };

/**
 * Disponibiliza para Client Components (ex.: header) os títulos dos projetos vindos do CMS, que só o
 * servidor consegue buscar. Montado no layout do locale.
 * @example <ProjectTitlesProvider titlesBySlug={{ portal: 'Portal' }}>{children}</ProjectTitlesProvider>
 */
export function ProjectTitlesProvider({ titlesBySlug, children }: ProjectTitlesProviderProps) {
  return <ProjectTitlesContext.Provider value={titlesBySlug}>{children}</ProjectTitlesContext.Provider>;
}

/**
 * Título do projeto do `slug`, ou `undefined` se o slug não existir no CMS.
 * @example const title = useProjectTitle('portal'); // 'Portal'
 */
export function useProjectTitle(slug: string | undefined): string | undefined {
  const titlesBySlug = useContext(ProjectTitlesContext);
  return slug ? titlesBySlug[slug] : undefined;
}
