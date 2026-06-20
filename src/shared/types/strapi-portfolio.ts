/**
 * Shape da resposta REST do Strapi v5 para o single type `gamer-portfolio`.
 *
 * No v5 a resposta é achatada (sem o aninhamento `data.attributes` do v4);
 * componentes repetíveis vêm como arrays de objetos. Estes tipos modelam apenas
 * os campos consumidos pelo mapper — o `mapStrapiToPortfolio` os converte para
 * o `PortfolioData` da UI, isolando o shape do CMS do restante da aplicação.
 */

interface StrapiSkill {
  name: string;
}

interface StrapiSkillItem {
  name: string;
  score: number;
}

interface StrapiSkillCategory {
  name: string;
  items: StrapiSkillItem[];
}

interface StrapiProject {
  company: string;
  companyUrl?: string | null;
  projectName: string;
  desc: string;
  startDate: string;
  endDate?: string | null;
  dateNote?: string | null;
  stacks: string[];
}

interface StrapiService {
  title: string;
  description: string;
}

interface StrapiExperience {
  company: string;
  companyUrl?: string | null;
  role: string;
  startDate: string;
  endDate?: string | null;
  details: string[];
  stack: string[];
}

interface StrapiAchievement {
  badge: string;
  title: string;
  year: string;
  desc: string;
}

interface StrapiEducation {
  title: string;
  institution: string;
  description: string;
  year: string;
}

export interface StrapiGamerPortfolio {
  name: string;
  email: string;
  role: string;
  location: string;
  phone: string;
  github: string;
  githubUrl: string;
  linkedin: string;
  linkedinUrl: string;
  stack: string;
  /** Meses de experiência usados em `calcXpLevel` (hoje 53). */
  experienceMonths: number;
  /** Dias úteis por nível usados em `calcXpLevel` (hoje 261). */
  workingDaysPerYear: number;
  skills: StrapiSkill[];
  skillCategories: StrapiSkillCategory[];
  projects: StrapiProject[];
  services: StrapiService[];
  experience: StrapiExperience[];
  achievements: StrapiAchievement[];
  education: StrapiEducation[];
}

/** Envelope REST do Strapi para single types. */
export interface StrapiSingleResponse<T> {
  data: T;
}
