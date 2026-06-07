import type { PortfolioData } from '@/features/gamer/types/portfolio';
import type { StrapiGamerPortfolio } from '@/features/gamer/types/strapi-portfolio';
import { calcXpLevel } from '@/features/gamer/utils/calc-level';
import { calcTotalCareerYears } from '@/features/gamer/utils/career-years';

/**
 * Anti-corruption layer: converte a resposta do Strapi no `PortfolioData` da UI.
 *
 * `level` e `stats` não são conteúdo no CMS — são derivados aqui, reusando a
 * mesma lógica de `portfolio-data.ts` (`calcXpLevel` e `calcTotalCareerYears`).
 */
export function mapStrapiToPortfolio(raw: StrapiGamerPortfolio): PortfolioData {
  const experience: PortfolioData['experience'] = raw.experience.map((entry) => ({
    company: entry.company,
    companyUrl: entry.companyUrl ?? undefined,
    role: entry.role,
    startDate: entry.startDate,
    endDate: entry.endDate ?? null,
    details: entry.details,
    stack: entry.stack,
  }));

  const projects: PortfolioData['projects'] = raw.projects.map((project) => ({
    company: project.company,
    companyUrl: project.companyUrl ?? undefined,
    projectName: project.projectName,
    desc: project.desc,
    startDate: project.startDate,
    endDate: project.endDate ?? null,
    dateNote: project.dateNote ?? undefined,
    stacks: project.stacks,
  }));

  const skills = raw.skills.map((skill) => ({ name: skill.name }));
  const services = raw.services.map((service) => ({ title: service.title, description: service.description }));

  return {
    name: raw.name,
    email: raw.email,
    role: raw.role,
    location: raw.location,
    phone: raw.phone,
    github: raw.github,
    githubUrl: raw.githubUrl,
    linkedin: raw.linkedin,
    linkedinUrl: raw.linkedinUrl,
    stack: raw.stack,
    level: calcXpLevel(raw.experienceMonths, raw.workingDaysPerYear),
    stats: [
      { value: `${calcTotalCareerYears(experience)}+`, label: 'Anos de exp de mercado' },
      { value: `${skills.length}+`, label: 'Tecnologias' },
      { value: `${projects.length}+`, label: 'Projetos' },
      { value: `${services.length}`, label: 'Serviços' },
    ],
    skills,
    skillCategories: raw.skillCategories.map((category) => ({
      name: category.name,
      items: category.items.map((item) => ({ name: item.name, score: item.score })),
    })),
    projects,
    services,
    experience,
    achievements: raw.achievements.map((achievement) => ({
      badge: achievement.badge,
      title: achievement.title,
      year: achievement.year,
      desc: achievement.desc,
    })),
    games: raw.games.map((game) => ({
      image: game.image,
      title: game.title,
      sub: game.sub,
      tag: game.tag,
    })),
    education: raw.education.map((edu) => ({
      title: edu.title,
      institution: edu.institution,
      description: edu.description,
      year: edu.year,
    })),
  };
}
