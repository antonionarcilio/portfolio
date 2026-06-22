/**
 * Shape da resposta REST do Strapi v5 para o single type `portfolio`.
 *
 * No v5 a resposta é achatada (sem `data.attributes`); componentes repetíveis
 * vêm como arrays de objetos e relações como arrays de entidades. Estes tipos
 * modelam apenas os campos consumidos pelo mapper — o `mapStrapiToPortfolio`
 * os converte para o `PortfolioData` da UI.
 */

interface StrapiMedia {
  url: string;
}

interface StrapiTechnology {
  id: number;
  name: string;
}

export interface StrapiContact {
  id: number;
  label: string;
  url: string;
}

export interface StrapiSkill {
  id: number;
  name: string;
  technologies: StrapiTechnology[];
}

export interface StrapiProject {
  id: number;
  company: string;
  company_url?: string | null;
  project_name: string;
  desc: string;
  start_date: string;
  end_date?: string | null;
  technologies: StrapiTechnology[];
}

export interface StrapiService {
  id: number;
  title: string;
  description: string;
}

export interface StrapiExperience {
  id: number;
  company: string;
  company_url?: string | null;
  role: string;
  start_date: string;
  end_date?: string | null;
  /** JSON-encoded string array of responsibilities. */
  details?: string | null;
  technologies: StrapiTechnology[];
}

export interface StrapiAchievement {
  id: number;
  badge: StrapiMedia;
  title: string;
  year: string;
  desc: string;
}

export interface StrapiEducation {
  id: number;
  title: string;
  institution: string;
  description?: string | null;
  year?: string | null;
}

export interface StrapiPortfolio {
  name: string;
  last_name?: string | null;
  expertise_area: string;
  location: string;
  experience_months: number;
  working_days_per_year: number;
  contact: StrapiContact[];
  skills: StrapiSkill[];
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
