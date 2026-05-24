export interface PortfolioData {
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
    value: number;
    items: Array<{
      name: string;
      score: number;
    }>;
  }>;
  stackPills: Array<{
    label: string;
    cls: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    date: string;
    details: string[];
    stack: string[];
  }>;
  achievements: Array<{
    badge: string;
    title: string;
    desc: string;
  }>;
  games: Array<{
    image: string;
    title: string;
    sub: string;
    tag: string;
  }>;
  education: Array<{
    title: string;
    institution: string;
    description: string;
    year: string;
  }>;
}
