export interface CurriculumData {
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
    priority: number;
    minutes: number[];
    color: string;
    years: number;
  }>;
  stackPills: Array<{
    label: string;
    cls: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    date: string;
    description: string;
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
