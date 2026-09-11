export type Seniority = 'junior' | 'mid' | 'senior';

export interface ProjectEntry {
  company: string;
  companyUrl?: string;
  projectUrl?: string;
  /** URLs prontas do CMS para o carrossel do painel expandido (campo `carrousel`). Vazio quando nenhuma foi cadastrada. */
  carrouselImages: string[];
  projectName: string;
  expertiseArea: string;
  /** Markdown cru — parágrafos, ênfase e listas são renderizados via `MarkdownText`. */
  desc: string;
  /** Objetivo do projeto (markdown). Ausente quando não cadastrado no CMS. */
  objective?: string;
  /** O que foi construído / minha atuação (markdown). Ausente quando não cadastrado no CMS. */
  whatIBuilt?: string;
  /** Desafios do projeto (markdown). Ausente quando não cadastrado no CMS. */
  challenge?: string;
  /** Resultado do projeto (markdown). Ausente quando não cadastrado no CMS. */
  result?: string;
  /** Resumo curto exibido no card — texto pronto, sem markdown. */
  excerpt: string;
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
  /** Todos os aliases cadastrados para a empresa no CMS, na ordem original — usado no cabeçalho do painel expandido. */
  companyAliases: string[];
  companyUrl?: string;
  role: string;
  /** Descrição da atuação profissional exibida no lado esquerdo da experiência Minimalist. */
  description: string;
  /** Descrição institucional da empresa exibida no lado direito da experiência Minimalist. */
  about: string;
  /** ISO date string — first day of the start month, e.g. "2021-03-01" */
  startDate: string;
  /** ISO date string — first day of the end month. Omit or set to null when currently employed. */
  endDate?: string | null;
  /** Modalidade de trabalho (ex. "Remoto", "Híbrido") — já localizada pelo conteúdo do CMS. */
  employmentType?: string;
  /** Markdown cru — parágrafos, ênfase e listas são renderizados via `MarkdownText`. */
  details: string;
  /** Resumo curto exibido no card — texto pronto, sem markdown. */
  excerpt: string;
  /** Each inner array is one stack group; outer array groups are comma-separated in the UI. */
  stack: string[][];
  /** URL Cloudinary da logomarca da empresa, ou `null` quando o campo não está presente no frontmatter. */
  logoUrl: string | null;
  industry?: string;
  location?: string;
  /** Links de produtos/projetos institucionais da empresa — `url` ausente quando o projeto não tem link público. */
  products: Array<{ label: string; url?: string }>;
}

export interface PortfolioData {
  name: string;
  /** URL do retrato de perfil resolvida do CMS, ou `null` quando o campo não está presente no frontmatter. */
  avatarUrl: string | null;
  email: string;
  /** `label` is the Gamified display text (do not repurpose it — that layout's contact rows depend on it as-is).
   * `aliasLabel` is the CMS node's first `aliases` entry (fallback: node key) — the Minimalist layout's contact
   * links use this instead. */
  contacts: Array<{ label: string; aliasLabel: string; url: string; tooltip?: string | null }>;
  role: string;
  seniority: Seniority | null;
  company: string;
  highlightText: string | null;
  bio: { description: string; excerpt: string } | null;
  careerYears: number;
  /** Meses brutos de experiência (`experience_month` do CMS) — usado para decidir "X anos" vs "+ de X anos" no painel Sobre expandido. */
  careerMonths: number;
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
    labelKey: 'yearsExperience' | 'technologies' | 'projects' | 'status';
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
    /** Todos os aliases cadastrados para a formação no CMS, na ordem original — usado no painel Sobre expandido. */
    aliases: string[];
    institution: string;
    description: string;
    year: string;
    city: string;
    federation: string;
    country: string;
  }>;
}
