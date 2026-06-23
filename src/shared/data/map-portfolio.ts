import 'server-only';

import { env } from '@/env';
import type { PortfolioQuery } from '@/gql/graphql';
import type { PortfolioData } from '@/shared/types/portfolio';
import { calcXpLevel } from '@/shared/utils/calc-level';
import { calcTotalCareerYears } from '@/shared/utils/career-years';

/** Payload não-nulo de `portfolio` retornado pela query GraphQL gerada. */
type PortfolioPayload = NonNullable<PortfolioQuery['portfolio']>;

/** Remove os `null` que o GraphQL injeta em listas e relações opcionais. */
function compact<T>(items: ReadonlyArray<T | null> | null | undefined): T[] {
  return (items ?? []).filter((item): item is T => item !== null);
}

/** Coage um scalar Date do Strapi (tipado como `unknown`) para string ISO. */
function asDateString(value: unknown): string {
  return typeof value === 'string' ? value : String(value);
}

/** Encontra um contato pelo label (case-insensitive). */
function findContact(contacts: ReadonlyArray<{ label: string; url: string }>, label: string): string {
  return contacts.find((contact) => contact.label.toLowerCase() === label.toLowerCase())?.url ?? '';
}

/** Extrai o último segmento de uma URL (username de GitHub/LinkedIn). */
function extractUsername(url: string): string {
  return url.replace(/\/$/, '').split('/').pop() ?? '';
}

/**
 * `details` no Strapi é um campo texto armazenado como JSON array serializado.
 * Se o parse falhar, faz fallback para split por newline.
 */
function parseDetails(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return raw.split('\n').filter(Boolean);
  }
}

/** Converte uma URL relativa do Strapi em URL absoluta. */
function absoluteUrl(url: string): string {
  return url.startsWith('http') ? url : `${env.STRAPI_API_URL}${url}`;
}

/**
 * Anti-corruption layer: converte a resposta GraphQL do Strapi no `PortfolioData`
 * consumido pela UI. As listas chegam como `Array<T | null> | null` e os scalars
 * Date como `unknown`, então são normalizadas aqui antes do mapeamento.
 *
 * `level` e `stats` são derivados via `calcXpLevel` e `calcTotalCareerYears`.
 */
export function mapPortfolioToData(raw: PortfolioPayload): PortfolioData {
  const contacts = compact(raw.contact);
  const githubUrl = findContact(contacts, 'github');
  const linkedinUrl = findContact(contacts, 'linkedin');

  const skillCategories: PortfolioData['skillCategories'] = compact(raw.skills).map((group) => ({
    name: group.name,
    items: compact(group.technologies).map((technology) => ({ name: technology.name, score: 0 })),
  }));

  const skills: PortfolioData['skills'] = Array.from(
    new Set(skillCategories.flatMap((category) => category.items.map((item) => item.name))),
  ).map((name) => ({ name }));

  const experience: PortfolioData['experience'] = compact(raw.experience).map((entry) => ({
    company: entry.company,
    companyUrl: entry.company_url ?? undefined,
    role: entry.role,
    startDate: asDateString(entry.start_date),
    endDate: entry.end_date == null ? null : asDateString(entry.end_date),
    details: parseDetails(entry.details),
    stack: compact(entry.technologies).map((technology) => technology.name),
  }));

  const projects: PortfolioData['projects'] = compact(raw.projects).map((project) => ({
    company: project.company,
    companyUrl: project.company_url ?? undefined,
    projectName: project.project_name,
    desc: project.desc,
    startDate: asDateString(project.start_date),
    endDate: project.end_date == null ? null : asDateString(project.end_date),
    stacks: compact(project.technologies).map((technology) => technology.name),
  }));

  const services = compact(raw.services).map((service) => ({
    title: service.title,
    description: service.description,
  }));

  return {
    name: [raw.name, raw.last_name].filter(Boolean).join(' '),
    email: findContact(contacts, 'email'),
    role: raw.expertise_area,
    location: raw.location ?? '',
    phone: findContact(contacts, 'phone'),
    github: extractUsername(githubUrl),
    githubUrl,
    linkedin: extractUsername(linkedinUrl),
    linkedinUrl,
    stack: findContact(contacts, 'stack') || raw.expertise_area,
    level: calcXpLevel(raw.experience_months ?? 0, raw.working_days_per_year ?? 0),
    stats: [
      { value: `${calcTotalCareerYears(experience)}+`, label: 'Anos de exp de mercado' },
      { value: `${skills.length}+`, label: 'Tecnologias' },
      { value: `${projects.length}+`, label: 'Projetos' },
      { value: `${services.length}`, label: 'Serviços' },
    ],
    skills,
    skillCategories,
    projects,
    services,
    experience,
    achievements: compact(raw.achievements).map((achievement) => ({
      badge: absoluteUrl(achievement.badge.url),
      title: achievement.title,
      year: achievement.year,
      desc: achievement.desc,
    })),
    education: compact(raw.education).map((entry) => ({
      title: entry.title,
      institution: entry.institution,
      description: entry.description ?? '',
      year: entry.year ?? '',
    })),
  };
}
