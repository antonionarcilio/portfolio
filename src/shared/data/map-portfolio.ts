import 'server-only';

import { resolveWikiLinks, type CmsGraph, type CmsNode } from '@/shared/data/get-cms-graph';
import type { PortfolioData, Seniority } from '@/shared/types/portfolio';
import { calcXpLevel } from '@/shared/utils/calc-xp-level';
import { parseEducationLocation } from '@/shared/utils/location';

interface RootFields {
  achievements?: string | string[];
  bio?: string;
  company?: string;
  contacts?: string | string[];
  /** URL Cloudinary do retrato de perfil (mesmo campo `cover` usado por projetos/conquistas) — não um wikilink nem um caminho do repo CMS. */
  cover?: string;
  educations?: string;
  experience_company?: string | string[];
  experience_month?: number;
  expertise_area: string;
  first_name: string;
  highlight_text?: string | string[];
  last_name: string;
  location: string;
  projects?: string | string[];
  seniority?: string;
  skills?: string | string[];
}

interface ContactFields {
  label: string;
  tooltip?: string;
  url: string;
}

interface SkillFields {
  description: string;
  icon: string;
  technologies?: string | string[];
}

interface ExperienceFields {
  description: string;
  excerpt: string;
  employment_type: string;
  end?: string;
  expertise_area: string;
  site?: string;
  stacks?: string | string[];
  start: string;
}

interface ProjectFields {
  company?: string | string[];
  cover?: string;
  description: string;
  excerpt: string;
  end?: string;
  url?: string;
  stack?: string | string[];
  start: string;
}

interface AchievementFields {
  cover?: string;
  description: string;
  year: number;
}

interface EducationFields {
  degree_type: string;
  description: string;
  institution: string;
  location?: string;
  year: number;
}

interface AboutFields {
  description: string;
  excerpt: string;
}

/** Normaliza um campo `multitext` do Obsidian (escalar quando 0-1 valor, lista quando 2+) para array. */
function toArray(value: string | string[] | undefined | null): string[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/** Nome de exibição de um nó do grafo: primeiro item de `aliases`, com fallback pra chave do nó. */
function nodeName(node: CmsNode): string {
  return toArray(node.frontmatter.aliases as string | string[] | undefined)[0] ?? node.key;
}

/** Valida o scheme da URL, retornando undefined para schemes perigosos (e.g. javascript:). */
function safeUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const { protocol } = new URL(url);
    return ['https:', 'http:', 'mailto:', 'tel:'].includes(protocol) ? url : undefined;
  } catch {
    return undefined;
  }
}

/** Extrai o último segmento de uma URL (username de GitHub/LinkedIn). */
function extractUsername(url: string): string {
  return url.replace(/\/$/, '').split('/').pop() ?? '';
}

/**
 * Normaliza os nomes Lucide fornecidos pelo CMS antes de montar a URL estática.
 * O prefixo `lucide-` também aparece em classes CSS e em algumas exportações,
 * mas não faz parte do nome do arquivo publicado pelo `lucide-static`.
 */
function lucideIconUrl(icon: string): string {
  const fileName = icon
    .trim()
    .replace(/^lucide-/i, '')
    .replace(/\.svg$/i, '');
  return `https://unpkg.com/lucide-static/icons/${fileName}.svg`;
}

function mapContacts(graph: CmsGraph, root: RootFields): PortfolioData['contacts'] {
  return resolveWikiLinks(graph, root.contacts).map((node) => {
    const fields = node.frontmatter as unknown as ContactFields;
    return { label: fields.label, url: fields.url, tooltip: fields.tooltip };
  });
}

function mapSeniority(graph: CmsGraph, root: RootFields): Seniority | null {
  const [node] = resolveWikiLinks(graph, root.seniority);
  const segment = node?.key.split('/')[1];
  return segment === 'junior' || segment === 'mid' || segment === 'senior' ? segment : null;
}

function mapSkillCategories(graph: CmsGraph, root: RootFields): PortfolioData['skillCategories'] {
  return resolveWikiLinks(graph, root.skills).map((node) => {
    const fields = node.frontmatter as unknown as SkillFields;
    return {
      id: node.key,
      name: nodeName(node),
      description: fields.description,
      iconUrl: lucideIconUrl(fields.icon),
      items: resolveWikiLinks(graph, fields.technologies).map((tech) => ({ name: nodeName(tech) })),
    };
  });
}

/** Tecnologias únicas entre todas as categorias de skill, deduplicadas por nome. */
function mapTechnologies(graph: CmsGraph, root: RootFields): PortfolioData['skills'] {
  const categories = mapSkillCategories(graph, root);
  return Array.from(new Set(categories.flatMap((category) => category.items.map((item) => item.name)))).map((name) => ({
    name,
  }));
}

function mapProjects(graph: CmsGraph, root: RootFields): PortfolioData['projects'] {
  return resolveWikiLinks(graph, root.projects).map((node) => {
    const fields = node.frontmatter as unknown as ProjectFields;
    const [company] = resolveWikiLinks(graph, fields.company);
    return {
      company: company ? nodeName(company) : '',
      companyUrl: safeUrl((company?.frontmatter as unknown as ExperienceFields | undefined)?.site),
      projectUrl: safeUrl(fields.url),
      projectName: nodeName(node),
      desc: fields.description,
      excerpt: fields.excerpt,
      startDate: fields.start,
      endDate: fields.end ?? null,
      stacks: resolveWikiLinks(graph, fields.stack).map(nodeName),
    };
  });
}

/** Grupos de stack de uma experiência: um grupo por projeto linkado, sem grupos com o mesmo conjunto de tecnologias. */
function mapExperienceStackGroups(graph: CmsGraph, fields: ExperienceFields): string[][] {
  const seenGroups = new Set<string>();
  return resolveWikiLinks(graph, fields.stacks)
    .map((project) => resolveWikiLinks(graph, (project.frontmatter as unknown as ProjectFields).stack).map(nodeName))
    .filter((group) => {
      const key = [...group].sort().join('|');
      if (seenGroups.has(key)) return false;
      seenGroups.add(key);
      return true;
    });
}

function mapExperience(graph: CmsGraph, root: RootFields): PortfolioData['experience'] {
  return resolveWikiLinks(graph, root.experience_company).map((node) => {
    const fields = node.frontmatter as unknown as ExperienceFields;
    return {
      company: nodeName(node),
      companyUrl: safeUrl(fields.site),
      role: fields.expertise_area,
      startDate: fields.start,
      endDate: fields.end ?? null,
      details: fields.description,
      excerpt: fields.excerpt,
      stack: mapExperienceStackGroups(graph, fields),
    };
  });
}

function mapAchievements(graph: CmsGraph, root: RootFields): PortfolioData['achievements'] {
  return resolveWikiLinks(graph, root.achievements).map((node) => {
    const fields = node.frontmatter as unknown as AchievementFields;
    return {
      badge: fields.cover ?? '',
      title: nodeName(node),
      year: String(fields.year),
      desc: fields.description,
    };
  });
}

function mapEducation(graph: CmsGraph, root: RootFields): PortfolioData['education'] {
  return resolveWikiLinks(graph, root.educations).map((node) => {
    const fields = node.frontmatter as unknown as EducationFields;
    const location = parseEducationLocation(fields.location);
    return {
      title: nodeName(node),
      institution: fields.institution,
      description: fields.description,
      year: String(fields.year),
      city: location.city,
      federation: location.federation,
      country: location.country,
    };
  });
}

/** URL do retrato de perfil — já uma URL Cloudinary completa em `root.cover`. */
function mapAvatarUrl(root: RootFields): string | null {
  return root.cover ?? null;
}

/** Bio resolvida do wikilink `root.bio` (`content/about/index`). */
function mapBio(graph: CmsGraph, root: RootFields): { description: string; excerpt: string } | null {
  const [aboutNode] = resolveWikiLinks(graph, root.bio);
  const aboutFields = aboutNode?.frontmatter as unknown as AboutFields | undefined;
  return aboutFields ? { description: aboutFields.description, excerpt: aboutFields.excerpt } : null;
}

/** Campos escalares do próprio nó raiz (perfil da pessoa) — sem os agregados que dependem de outros mappers (`stats`, `skills`, etc). */
function mapProfile(
  graph: CmsGraph,
  root: RootFields,
): Pick<
  PortfolioData,
  | 'name'
  | 'role'
  | 'seniority'
  | 'company'
  | 'highlightText'
  | 'careerYears'
  | 'location'
  | 'github'
  | 'githubUrl'
  | 'linkedin'
  | 'linkedinUrl'
  | 'stack'
  | 'level'
> & { bio: { description: string; excerpt: string } | null } {
  const githubUrl = graph.get('contact/github')?.frontmatter.url as string | undefined;
  const linkedinUrl = graph.get('contact/linkedin')?.frontmatter.url as string | undefined;
  const experienceMonths = root.experience_month ?? 0;

  return {
    name: [root.first_name, root.last_name].filter(Boolean).join(' '),
    role: root.expertise_area,
    seniority: mapSeniority(graph, root),
    company: root.company ?? '',
    highlightText: toArray(root.highlight_text)[0] ?? null,
    careerYears: Math.floor(experienceMonths / 12),
    location: root.location,
    github: githubUrl ? extractUsername(githubUrl) : '',
    githubUrl: githubUrl ?? '',
    linkedin: linkedinUrl ? extractUsername(linkedinUrl) : '',
    linkedinUrl: linkedinUrl ?? '',
    stack: root.expertise_area,
    level: calcXpLevel(experienceMonths),
    bio: mapBio(graph, root),
  };
}

/**
 * Anti-corruption layer: converte o nó raiz do grafo CMS (markdown) no `PortfolioData`
 * consumido pela UI, resolvendo os wikilinks presentes em cada campo.
 */
export function mapPortfolioToData(root: CmsNode, graph: CmsGraph): PortfolioData {
  const rootFields = root.frontmatter as unknown as RootFields;
  const emailUrl = graph.get('contact/email')?.frontmatter.url as string | undefined;

  const profile = mapProfile(graph, rootFields);
  const skills = mapTechnologies(graph, rootFields);
  const skillCategories = mapSkillCategories(graph, rootFields);
  const projects = mapProjects(graph, rootFields);

  return {
    ...profile,
    avatarUrl: mapAvatarUrl(rootFields),
    contacts: mapContacts(graph, rootFields),
    email: emailUrl ?? '',
    phone: '',
    stats: [
      { value: `${profile.careerYears}+`, labelKey: 'yearsExperience' },
      { value: `${skills.length}+`, labelKey: 'technologies' },
      { value: `${projects.length}+`, labelKey: 'projects' },
      { value: profile.company ? 'unavailable' : 'open', labelKey: 'status' },
    ],
    skills,
    skillCategories,
    projects,
    experience: mapExperience(graph, rootFields),
    achievements: mapAchievements(graph, rootFields),
    education: mapEducation(graph, rootFields),
  };
}
