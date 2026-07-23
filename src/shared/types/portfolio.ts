export type Seniority = 'junior' | 'mid' | 'senior';

export interface ProjectEntry {
  company: string;
  companyUrl?: string;
  projectName: string;
  /** Markdown cru — parágrafos, ênfase e listas são renderizados via `MarkdownText`. */
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
  /** Markdown cru — parágrafos, ênfase e listas são renderizados via `MarkdownText`. */
  details: string;
  /** Each inner array is one stack group; outer array groups are comma-separated in the UI. */
  stack: string[][];
}

export interface PortfolioData {
  name: string;
  email: string;
  contacts: Array<{ label: string; url: string; tooltip?: string | null }>;
  role: string;
  seniority: Seniority | null;
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
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    items: Array<{
      name: string;
    }>;
  }>;
  projects: ProjectEntry[];
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
