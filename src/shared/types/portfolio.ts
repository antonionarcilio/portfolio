import type { Enum_Portfolio_Seniority } from '@/gql/graphql';

export interface ProjectEntry {
  company: string;
  companyUrl?: string;
  projectName: string;
  desc: string;
  /** ISO date string — first day of the start month, e.g. "2021-03-01" */
  startDate: string;
  /** ISO date string — first day of the end month. Omit or set to null when ongoing. */
  endDate?: string | null;
  /** Free-text override for the period display (e.g. for non-contiguous date ranges). When present, shown instead of the computed startDate–endDate string. */
  dateNote?: string;
  stacks: string[];
}

export interface ExperienceEntry {
  company: string;
  companyUrl?: string;
  role: string;
  /** ISO date string — first day of the start month, e.g. "2021-03-01" */
  startDate: string;
  /** ISO date string — first day of the end month. Omit or set to null when currently employed. */
  endDate?: string | null;
  details: string[];
  /** Each inner array is one stack group; outer array groups are comma-separated in the UI. */
  stack: string[][];
}

export interface ServiceEntry {
  title: string;
  description: string;
  contactUrl?: string;
}

export interface PortfolioData {
  name: string;
  email: string;
  contacts: Array<{ label: string; url: string; tooltip?: string | null }>;
  role: string;
  seniority: Enum_Portfolio_Seniority | null;
  openToWork: boolean;
  highlightText: string | null;
  careerYears: number;
  location: string;
  phone: string;
  github: string;
  githubUrl: string;
  linkedin: string;
  linkedinUrl: string;
  stack: string;
  level: {
    label: string;
    fill: number;
    sub: string;
  };
  stats: Array<{
    value: string;
    label: string;
  }>;
  skills: Array<{
    name: string;
  }>;
  skillCategories: Array<{
    name: string;
    items: Array<{
      name: string;
      score: number;
    }>;
  }>;
  projects: ProjectEntry[];
  services: ServiceEntry[];
  experience: ExperienceEntry[];
  achievements: Array<{
    badge: string;
    title: string;
    year: string;
    desc: string;
  }>;
  education: Array<{
    title: string;
    institution: string;
    description: string;
    year: string;
  }>;
}
