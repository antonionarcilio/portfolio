import 'server-only';

import { env } from '@/env';
import type { PortfolioData } from '@/shared/types/portfolio';
import type { StrapiContact, StrapiPortfolio } from '@/shared/types/strapi-portfolio';
import { calcXpLevel } from '@/shared/utils/calc-level';
import { calcTotalCareerYears } from '@/shared/utils/career-years';

/** Encontra um contato pelo label (case-insensitive). */
function findContact(contacts: StrapiContact[], label: string): string {
  return contacts.find((c) => c.label.toLowerCase() === label.toLowerCase())?.url ?? '';
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
 * Anti-corruption layer: converte a resposta do Strapi no `PortfolioData` da UI.
 *
 * `level` e `stats` são derivados aqui via `calcXpLevel` e `calcTotalCareerYears`.
 */
export function mapStrapiToPortfolio(raw: StrapiPortfolio): PortfolioData {
  const githubUrl = findContact(raw.contact, 'github');
  const linkedinUrl = findContact(raw.contact, 'linkedin');

  const skillCategories: PortfolioData['skillCategories'] = raw.skills.map((group) => ({
    name: group.name,
    items: group.technologies.map((t) => ({ name: t.name, score: 0 })),
  }));

  const skills: PortfolioData['skills'] = Array.from(
    new Set(skillCategories.flatMap((c) => c.items.map((i) => i.name))),
  ).map((name) => ({ name }));

  const experience: PortfolioData['experience'] = raw.experience.map((entry) => ({
    company: entry.company,
    companyUrl: entry.company_url ?? undefined,
    role: entry.role,
    startDate: entry.start_date,
    endDate: entry.end_date ?? null,
    details: parseDetails(entry.details),
    stack: entry.technologies.map((t) => t.name),
  }));

  const projects: PortfolioData['projects'] = raw.projects.map((project) => ({
    company: project.company,
    companyUrl: project.company_url ?? undefined,
    projectName: project.project_name,
    desc: project.desc,
    startDate: project.start_date,
    endDate: project.end_date ?? null,
    stacks: project.technologies.map((t) => t.name),
  }));

  const services = raw.services.map((s) => ({ title: s.title, description: s.description }));

  return {
    name: [raw.name, raw.last_name].filter(Boolean).join(' '),
    email: findContact(raw.contact, 'email'),
    role: raw.expertise_area,
    location: raw.location ?? '',
    phone: findContact(raw.contact, 'phone'),
    github: extractUsername(githubUrl),
    githubUrl,
    linkedin: extractUsername(linkedinUrl),
    linkedinUrl,
    stack: findContact(raw.contact, 'stack') || raw.expertise_area,
    level: calcXpLevel(raw.experience_months, raw.working_days_per_year),
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
    achievements: raw.achievements.map((a) => ({
      badge: absoluteUrl(a.badge.url),
      title: a.title,
      year: a.year,
      desc: a.desc,
    })),
    education: raw.education.map((e) => ({
      title: e.title,
      institution: e.institution,
      description: e.description ?? '',
      year: e.year ?? '',
    })),
  };
}
