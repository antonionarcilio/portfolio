'use server';

import { ProjectsDocument } from '@/gql/graphql';
import { getClient } from '@/lib/apollo-client';

export interface SkillProject {
  id: string;
  name: string;
  company: string;
  companyUrl?: string;
}

function compact<T>(items: ReadonlyArray<T | null> | null | undefined): T[] {
  return (items ?? []).filter((item): item is T => item !== null);
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
    name: p.project_name,
    company: p.company,
    companyUrl: p.company_url ?? undefined,
  }));
}
