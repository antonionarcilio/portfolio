'use server';

import { ProjectsDocument } from '@/gql/graphql';
import { getClient } from '@/lib/apollo-client';
import type { ProjectEntry } from '@/shared/types/portfolio';

// Estende ProjectEntry (mesmo shape consumido pelo ProjectModal) com o `id` do
// componente, usado como chave de item e para identificar o projeto aberto no
// modal — o componente Project do Strapi não tem documentId, só esse id.
export interface SkillProject extends ProjectEntry {
  id: string;
}

function compact<T>(items: ReadonlyArray<T | null> | null | undefined): T[] {
  return (items ?? []).filter((item): item is T => item !== null);
}

/** Coage um scalar Date do Strapi (tipado como `unknown`) para string ISO. */
function asDateString(value: unknown): string {
  return typeof value === 'string' ? value : String(value);
}

export async function getSkillProjects(documentIds: string[], locale: string): Promise<SkillProject[]> {
  if (documentIds.length === 0) return [];

  const { data } = await getClient().query({
    query: ProjectsDocument,
    variables: {
      locale,
      filters: {
        stack: {
          technologies: {
            or: documentIds.map((id) => ({ documentId: { eq: id } })),
          },
        },
      },
    },
  });

  return compact(data?.portfolio?.projects ?? []).map((p) => ({
    id: p.id,
    company: p.company,
    companyUrl: p.company_url ?? undefined,
    projectName: p.project_name,
    desc: p.desc,
    startDate: asDateString(p.start_date),
    endDate: p.end_date == null ? null : asDateString(p.end_date),
    stacks: compact(p.stack?.technologies).map((t) => t.name),
  }));
}
