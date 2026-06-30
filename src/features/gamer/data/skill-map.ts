/**
 * Skill Map — fake data source for the gamer "Habilidades" constellation.
 *
 * This is intentionally a static, typed module so the SkillMap component can be
 * built and iterated on without the API. When the backend is ready, swap this
 * out: keep the `SkillCore` / `FutureProject` shapes (or map the API response to
 * them) and feed the data into <SkillMap /> via a prop instead of importing here.
 *
 * Each core is a decoupled category node. Add a tech by pushing a string to
 * `techs`; the constellation layout + connections regenerate automatically.
 * Ready to grow: add `level`, `projects`, `since`, `links` per core later.
 */

export interface SkillCore {
  /** Stable id — also selects the canvas/panel icon (see SkillIcon). */
  id: string;
  /** Display name (also shown uppercased at the center of the map). */
  name: string;
  /** Decorative glyph kept for future SVG fallbacks; canvas uses vector icons. */
  glyph: string;
  /** Optional multi-line panel title override. */
  label?: string[];
  /** Short description shown in the side panel + center info. */
  desc: string;
  /** Technologies that orbit this core. */
  techs: string[];
}

export const SKILL_MAP_CORES: SkillCore[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    glyph: '</>',
    desc: 'Construção de interfaces reativas, acessíveis e performáticas.',
    techs: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'HTML',
      'CSS',
      'CSS Modules',
      'Styled Components',
      'Tailwind CSS',
      'Material UI',
      'shadcn/ui',
    ],
  },
  {
    id: 'backend',
    name: 'Backend',
    glyph: '{ }',
    desc: 'APIs, modelagem de dados e lógica de servidor.',
    techs: [
      'Node.js',
      'Express.js',
      'Prisma ORM',
      'PostgreSQL',
      'MySQL',
      'PHP',
      'REST API',
      'GraphQL',
      'Apollo GraphQL',
    ],
  },
  {
    id: 'motion',
    name: 'Motion & Design',
    glyph: '◇',
    desc: 'Interface, prototipação e animação de produto.',
    techs: [
      'Figma',
      'Framer Motion',
      'Lottie',
      'Storybook',
      'GSAP',
      'After Effects',
      'Rive',
      'Three.js',
      'CSS Animations',
    ],
  },
  {
    id: 'web',
    name: 'WebOps',
    glyph: '⊕',
    desc: 'Presença, performance e descoberta na web.',
    techs: ['WordPress', 'Strapi', 'DatoCMS', 'Notion', 'Core Web Vitals'],
  },
  {
    id: 'devops',
    name: 'DevOps & Infra',
    glyph: '▲',
    desc: 'Automação, deploy e ambiente de execução.',
    techs: ['Docker', 'Linux CLI', 'Linux System', 'Shell Script', 'Git', 'Vercel', 'Heroku', 'Hetzner'],
  },
  {
    id: 'ai',
    name: 'AI-Assisted',
    glyph: '✦',
    desc: 'Fluxo de desenvolvimento assistido por IA.',
    techs: ['Claude Code', 'v0', 'GitHub Copilot'],
  },
  {
    id: 'testing',
    name: 'Testing & Automation',
    label: ['Testing &', 'Automation'],
    glyph: '⦿',
    desc: 'Qualidade, confiabilidade e automação de fluxos.',
    techs: ['Jest', 'Playwright', 'n8n'],
  },
];

/** Placeholder "projects" list shown in the panel — fake data for now. */
export const FUTURE_PROJECTS: string[] = ['Ecoleta', 'Portal', 'Bot Studio', 'Dashboard', 'CLI Tools'];
