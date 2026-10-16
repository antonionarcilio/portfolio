import { z } from 'zod';

import type { PortfolioData } from './types/portfolio';

const contactSchema = z.object({
  label: z.string(),
  aliasLabel: z.string(),
  url: z.string(),
  tooltip: z.string().nullable().optional(),
});

const statSchema = z.object({
  value: z.string(),
  labelKey: z.enum(['yearsExperience', 'technologies', 'projects', 'status']),
});

const skillSchema = z.object({ name: z.string() });

const skillCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  iconUrl: z.string(),
  items: z.array(skillSchema),
});

const projectEntrySchema = z.object({
  company: z.string(),
  companyUrl: z.string().optional(),
  projectUrl: z.string().optional(),
  carrouselImages: z.array(z.string()),
  projectName: z.string(),
  expertiseArea: z.string(),
  desc: z.string(),
  objective: z.string().optional(),
  whatIBuilt: z.string().optional(),
  challenge: z.string().optional(),
  result: z.string().optional(),
  excerpt: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  dateNote: z.string().optional(),
  stacks: z.array(z.string()),
});

const experienceEntrySchema = z.object({
  company: z.string(),
  companyAliases: z.array(z.string()),
  companyUrl: z.string().optional(),
  role: z.string(),
  description: z.string(),
  about: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  employmentType: z.string().optional(),
  details: z.string(),
  excerpt: z.string(),
  stack: z.array(z.array(z.string())),
  logoUrl: z.string().nullable(),
  industry: z.string().optional(),
  location: z.string().optional(),
  products: z.array(z.object({ label: z.string(), url: z.string().optional() })),
});

const achievementSchema = z.object({
  badge: z.string(),
  title: z.string(),
  year: z.string(),
  desc: z.string(),
});

const educationSchema = z.object({
  title: z.string(),
  aliases: z.array(z.string()),
  institution: z.string(),
  description: z.string(),
  year: z.string(),
  city: z.string(),
  federation: z.string(),
  country: z.string(),
});

const bioSchema = z
  .object({
    description: z.string(),
    excerpt: z.string(),
    questionOne: z.string().optional(),
    responseOne: z.string().optional(),
    questionTwo: z.string().optional(),
    responseTwo: z.string().optional(),
  })
  .nullable();

/** Espelha `PortfolioData` (`types/portfolio.ts`) campo a campo — mantenha os dois sincronizados. */
export const portfolioDataSchema: z.ZodType<PortfolioData> = z.object({
  name: z.string(),
  avatarUrl: z.string().nullable(),
  email: z.string(),
  contacts: z.array(contactSchema),
  role: z.string(),
  seniority: z.enum(['junior', 'mid', 'senior']).nullable(),
  company: z.string(),
  highlightText: z.string().nullable(),
  bio: bioSchema,
  careerYears: z.number(),
  careerMonths: z.number(),
  location: z.string(),
  phone: z.string(),
  github: z.string(),
  githubUrl: z.string(),
  linkedin: z.string(),
  linkedinUrl: z.string(),
  stack: z.string(),
  level: z.object({ level: z.number(), fill: z.number(), sub: z.string() }),
  stats: z.array(statSchema),
  skills: z.array(skillSchema),
  skillCategories: z.array(skillCategorySchema),
  projects: z.array(projectEntrySchema),
  experience: z.array(experienceEntrySchema),
  achievements: z.array(achievementSchema),
  education: z.array(educationSchema),
});

/**
 * Valida um valor desconhecido contra o contrato de dados do portfólio.
 * @example parsePortfolioData(await response.json())
 */
export function parsePortfolioData(data: unknown): PortfolioData {
  const result = portfolioDataSchema.safeParse(data);
  if (!result.success) {
    const [firstIssue] = result.error.issues;
    const fieldPath = firstIssue.path.join('.') || '(raiz)';
    throw new Error(
      `parsePortfolioData: campo "${fieldPath}" inválido — recebido ${JSON.stringify(
        (data as Record<string, unknown> | undefined)?.[firstIssue.path[0] as string],
      )}, esperado conforme portfolioDataSchema (${firstIssue.message})`,
    );
  }
  return result.data;
}
