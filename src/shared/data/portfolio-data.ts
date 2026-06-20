import type { ExperienceEntry, PortfolioData, ProjectEntry, ServiceEntry } from '@/shared/types/portfolio';
import { calcXpLevel } from '@/shared/utils/calc-level';
import { calcTotalCareerYears } from '@/shared/utils/career-years';

const ESCALLO_URL = 'https://escallo.com.br';

const projects: ProjectEntry[] = [
  {
    company: 'Escallo',
    companyUrl: ESCALLO_URL,
    projectName: 'Portal',
    desc: 'Aplicação desenvolvida para centralizar autenticação, gerenciamento de usuários, permissões e acesso às diferentes soluções do ecossistema da empresa por meio de uma experiência unificada.\n\nAtuei na implementação e evolução das interfaces da aplicação, desenvolvimento de funcionalidades e manutenção contínua do produto, contribuindo com melhorias relacionadas à usabilidade, experiência do usuário e consistência visual da plataforma. Também participei da prototipação de telas e definição de interfaces alinhadas ao Design System da empresa em demandas específicas do projeto.',
    startDate: '2024-03-01',
    endDate: '2026-02-01',
    stacks: [
      'Next.js',
      'TypeScript',
      'TailwindCSS',
      'Material UI',
      'Apollo GraphQL',
      'Zod',
      'Zustand',
      'Docker',
      'Figma',
    ],
  },
  {
    company: 'Escallo',
    companyUrl: ESCALLO_URL,
    projectName: 'GO',
    desc: 'Aplicação desenvolvida para oferecer uma experiência mais moderna, performática e intuitiva, reunindo as principais funcionalidades utilizadas pelos usuários da plataforma principal.\n\nAtuei na implementação e evolução das interfaces da aplicação, desenvolvimento de funcionalidades e manutenção contínua do produto, contribuindo com melhorias relacionadas à usabilidade, experiência do usuário e consistência visual da plataforma. Também participei da prototipação de telas e evolução de interfaces alinhadas ao Design System da empresa.',
    startDate: '2024-03-01',
    endDate: '2026-02-01',
    stacks: [
      'Next.js',
      'TypeScript',
      'TailwindCSS',
      'Material UI',
      'Apollo GraphQL',
      'Zod',
      'Zustand',
      'Docker',
      'Figma',
    ],
  },
  {
    company: 'Escallo',
    companyUrl: ESCALLO_URL,
    projectName: 'UI Kit',
    desc: 'Biblioteca de componentes desenvolvida para padronização de interfaces, redução de inconsistências visuais entre aplicações e diminuição da dependência de bibliotecas externas, garantindo maior escalabilidade, manutenção e alinhamento ao Design System da empresa.\n\nAtuei na implementação, manutenção e evolução da biblioteca, desenvolvendo componentes reutilizáveis e escaláveis, desde elementos básicos, como botões e checkboxes, até componentes mais complexos, como picklists/transfers e inputs com máscaras dinâmicas (CPF, CNPJ, telefone, entre outros).\n\nContribuí para melhorar a consistência visual entre produtos, acelerar o desenvolvimento das aplicações e aumentar a reutilização de código entre diferentes projetos da empresa.',
    startDate: '2025-06-01',
    endDate: '2026-02-01',
    stacks: [
      'React',
      'TypeScript',
      'Storybook',
      'CSS Modules',
      'Rollup',
      'DnD',
      'Zod',
      'Framer Motion',
      'Gitlab Registry',
    ],
  },
  {
    company: 'Escallo',
    companyUrl: ESCALLO_URL,
    projectName: 'BI',
    desc: 'Aplicação desenvolvida para centralizar métricas estratégicas e indicadores operacionais relacionados ao atendimento e experiência do cliente.\n\nAtuei no desenvolvimento de dashboards, gráficos e interfaces analíticas voltadas à visualização e acompanhamento de métricas operacionais, contribuindo para uma apresentação clara e eficiente dos indicadores e dados estratégicos.',
    startDate: '2022-03-01',
    endDate: '2022-12-01',
    stacks: ['React', 'JavaScript', 'Material UI', 'AMCharts', 'ChartJs', 'Redux', 'Apollo GraphQL'],
  },
  {
    company: 'Escallo',
    companyUrl: ESCALLO_URL,
    projectName: 'Site Institucional — Escallo',
    desc: 'Plataformas institucionais desenvolvidas com foco em performance, SEO técnico, acessibilidade, integrações com ferramentas de marketing e suporte multilíngue (PT-BR e EN).\n\nAtuei no desenvolvimento e manutenção do website institucional do Escallo, implementando funcionalidades customizadas e integrações com serviços externos como RD Station. Desenvolvi fluxos de conversão de leads com validação de segurança utilizando Cloudflare Turnstile antes do envio dos dados à API do RD Station, além de integrações personalizadas no Elementor para mapeamento dinâmico de campos customizados cadastrados no RD Station por meio de Dynamic Tags. Também atuei na implementação de rastreamento de eventos (gtag), otimizações de performance, responsividade, Core Web Vitals e melhorias voltadas à experiência de navegação do usuário.',
    startDate: '2022-12-01',
    endDate: '2026-03-01',
    dateNote: 'dez 2022 – maio 2023 | dez 2025 – mar 2026',
    stacks: [
      'WordPress',
      'Elementor PRO',
      'PHP - funções customizadas',
      'ACF',
      'Polylang',
      'RD Station',
      'Google Analytics',
      'Google Tag Manager',
    ],
  },
  {
    company: 'Escallo',
    companyUrl: ESCALLO_URL,
    projectName: 'Site Institucional — Futurotec',
    desc: 'Plataformas institucionais desenvolvidas com foco em performance, SEO técnico, acessibilidade, integrações com ferramentas de marketing e suporte multilíngue (PT-BR, EN e ES).\n\nAtuei no desenvolvimento e manutenção do website institucional da Futurotec, participando desde a estruturação inicial do projeto até sua evolução contínua. Implementei funcionalidades customizadas, eventos de rastreamento e integrações voltadas ao monitoramento de interações estratégicas dos usuários, além de otimizações relacionadas à performance, responsividade, Core Web Vitals e experiência de navegação.',
    startDate: '2022-12-01',
    endDate: '2023-05-01',
    stacks: [
      'WordPress',
      'Elementor PRO',
      'PHP - funções customizadas',
      'ACF',
      'Polylang',
      'RD Station',
      'Google Analytics',
      'Google Tag Manager',
    ],
  },
  {
    company: 'Escallo',
    companyUrl: ESCALLO_URL,
    projectName: 'Blogs Corporativos',
    desc: 'Blogs corporativos desenvolvidos com foco em performance, SEO técnico, acessibilidade e experiência de navegação, utilizando funcionalidades personalizadas para recomendação de conteúdo, integração entre artigos e aumento do engajamento dos usuários.\n\nAtuei no desenvolvimento e manutenção dos blogs institucionais (Escallo e Futurotec), implementando funcionalidades voltadas à curadoria e relacionamento de conteúdo, permitindo que autores selecionassem manualmente artigos relacionados e referenciassem publicações existentes entre diferentes blogs da empresa. Também realizei configurações de rastreamento de eventos e monitoramento de interações estratégicas dos usuários via ferramentas de analytics, além de contribuir com melhorias de performance, acessibilidade, SEO e experiência de navegação.',
    startDate: '2022-12-01',
    endDate: '2026-01-01',
    dateNote: 'dez 2022 – abr 2023 | dez 2025 – jan 2026',
    stacks: [
      'WordPress',
      'Elementor PRO',
      'PHP - funções customizadas',
      'ACF',
      'Polylang',
      'RD Station',
      'Google Analytics',
      'Google Tag Manager',
    ],
  },
  {
    company: 'Escallo',
    companyUrl: ESCALLO_URL,
    projectName: 'Bot Studio',
    desc: 'Aplicação desenvolvida para simplificar a criação e configuração de bots por meio de fluxos visuais em canvas.\n\nAtuei na reformulação da interface e prototipação das telas da aplicação, contribuindo para a modernização visual da plataforma, melhoria da usabilidade e padronização da experiência de navegação em alinhamento com o Design System da empresa.',
    startDate: '2025-08-01',
    endDate: '2025-12-01',
    stacks: ['React', 'TypeScript', 'TailwindCSS', 'Shadcn/ui', 'Apollo GraphQL', 'Zustand', 'Zod', 'Docker', 'Figma'],
  },
];

const services: ServiceEntry[] = [
  {
    title: 'Desenvolvimento Front-end',
    description:
      'Desenvolvimento de aplicações web modernas, responsivas e escaláveis utilizando React, Next.js e TypeScript.',
  },
  {
    title: 'Desenvolvimento WordPress',
    description:
      'Criação e manutenção de sites institucionais, blogs corporativos, landing pages e soluções personalizadas com foco em performance e SEO.',
  },
  {
    title: 'Vibe Coding Fixer',
    description:
      'Refatoração, estabilização e adequação para produção de aplicações desenvolvidas com auxílio de ferramentas de IA.',
  },
  {
    title: 'Performance Web',
    description:
      'Otimização de Core Web Vitals, SEO técnico, acessibilidade e experiência do usuário para aplicações e sites.',
  },
  {
    title: 'Integração de Sistemas',
    description:
      'Integração de aplicações com APIs REST, GraphQL e serviços de terceiros para automatização de processos e centralização de informações.',
  },
  {
    title: 'Plataformas SaaS',
    description:
      'Desenvolvimento e evolução de portais corporativos, dashboards, sistemas internos e produtos digitais.',
  },
  {
    title: 'Analytics e Mensuração',
    description: 'Rastreamento de eventos e mensuração de conversões com Google Analytics e Google Tag Manager.',
  },
];

const experience: ExperienceEntry[] = [
  {
    company: 'Escallo',
    companyUrl: ESCALLO_URL,
    role: 'Desenvolvedor Frontend',
    startDate: '2022-03-03',
    endDate: '2026-05-18',
    details: [
      'Atuei como desenvolvedor frontend participando do desenvolvimento e evolução de aplicações web internas, plataformas institucionais e blogs corporativos.',
      'Fui responsável por transformar protótipos em interfaces funcionais, modernas e responsivas, mantendo alinhamento com o Design System da empresa e foco constante na experiência do usuário.',
      'Durante esse período, trabalhei no desenvolvimento de aplicações utilizando tecnologias como Next.js, React e TypeScript, além da manutenção e evolução de projetos em WordPress.',
      'Também participei da criação de protótipos e definições de interface, contribuindo diretamente na organização de fluxos, usabilidade e padronização visual dos produtos.',
      'Além do desenvolvimento frontend, atuei em integrações com APIs, ferramentas de marketing e monitoramento, implementação de funcionalidades customizadas, correção de bugs e evolução contínua das aplicações conforme novas demandas de negócio surgiam.',
    ],
    stack: [
      'React',
      'Next.js',
      'JavaScript',
      'TypeScript',
      'JQuery',
      'CSS Modules',
      'Tailwindcss',
      'GraphQL',
      'REST APIs',
      'Docker',
      'Storybook',
      'Figma',
      'Git',
      'WordPress',
      'PHP',
      'RD Station',
      'Google Analytics',
      'Elementor Pro',
    ],
  },
];

const skillCategories: PortfolioData['skillCategories'] = [
  {
    name: 'Frontend',

    items: [
      { name: 'JavaScript', score: 7 },
      { name: 'TypeScript', score: 7 },
      { name: 'React', score: 7 },
      { name: 'Next.js', score: 7 },
    ],
  },
  {
    name: 'Design/Motion',

    items: [
      { name: 'Figma', score: 8 },
      { name: 'Lottie', score: 4 },
      { name: 'Storybook', score: 6 },
      { name: 'Framer Motion', score: 3 },
    ],
  },
  {
    name: 'Web & SEO',

    items: [
      { name: 'WordPress', score: 7 },
      { name: 'GTM / GA4', score: 5 },
      { name: 'Core Web Vitals', score: 4 },
    ],
  },
  {
    name: 'Backend',

    items: [
      { name: 'Express.js', score: 2 },
      { name: 'MySQL', score: 1 },
      { name: 'PostgreSQL', score: 1 },
      { name: 'Jest', score: 3 },
    ],
  },
  {
    name: 'DevOps/Infra',

    items: [
      { name: 'Shell Script', score: 7 },
      { name: 'Docker', score: 6 },
      { name: 'Linux CLI', score: 6 },
      { name: 'Git', score: 7 },
    ],
  },
  {
    name: 'AI-Assisted',

    items: [
      { name: 'Claude Code', score: 4 },
      { name: 'Claude Design', score: 4 },
      { name: 'Open Code', score: 4 },
    ],
  },
];

// Lista plana de skills derivada das categorias, sem duplicatas.
const skills: PortfolioData['skills'] = Array.from(
  new Set(skillCategories.flatMap((category) => category.items.map((item) => item.name))),
).map((name) => ({ name }));

const achievements: PortfolioData['achievements'] = [
  {
    badge: '4xp',
    title: '4 anos de experiência',
    year: '2026',

    desc: 'Evolução profissional contínua.',
  },
  {
    badge: 'laptop-gamer',
    title: 'Primeiro notebook gamer',
    year: '2025',

    desc: 'Realização pessoal.',
  },
  {
    badge: '2xp',
    title: '2 anos de experiência',
    year: '2024',

    desc: 'Desenvolvimento de sites e aplicações web.',
  },
  {
    badge: 'airplane',
    title: 'Primeira viagem de avião',
    year: '2022',

    desc: 'Conhecendo Timóteo e Ipatinga.',
  },
  {
    badge: 'first-job',
    title: 'Primeiro emprego na área',
    year: '2022',

    desc: 'Início da carreira em desenvolvimento.',
  },
  {
    badge: 'covid-19',
    title: 'Superando a COVID-19',
    year: '2022',

    desc: 'Um novo começo após tempos difíceis.',
  },
  {
    badge: 'graduation',
    title: 'Conclusão da graduação',
    year: '2021',

    desc: 'Diploma em Análise e Desenvolvimento de Sistemas.',
  },
  {
    badge: 'start-academic-journey',
    title: 'Início da jornada acadêmica',
    year: '2018',

    desc: 'Análise e Desenvolvimento de Sistemas.',
  },
];

export const portfolioData: PortfolioData = {
  name: 'Antônio Mascarenhas',
  email: 'contato@antoniomascarenhas.com.br',
  role: 'Frontend Developer',
  location: 'São Luís, MA — Brasil',
  phone: '5598987697992',
  github: 'antonionarcilio',
  githubUrl: 'https://github.com/antonionarcilio',
  linkedin: 'antonionarcilio',
  linkedinUrl: 'https://linkedin.com/in/antonionarcilio',
  stack: 'React | Next.js + TypeScript',
  level: calcXpLevel(53, 261),
  stats: [
    { value: `${calcTotalCareerYears(experience)}+`, label: 'Anos de exp de mercado' },
    { value: `${skills.length}+`, label: 'Tecnologias' },
    { value: `${projects.length}+`, label: 'Projetos' },
    { value: `${services.length}`, label: 'Serviços' },
  ],
  skills,
  skillCategories,
  projects,
  services,
  experience,
  achievements,
  education: [
    {
      title: 'Análise e Desenvolvimento de Sistemas',
      institution: 'Nome da Instituição',
      description: 'Graduação',
      year: 'Concluído em 2021',
    },
  ],
};
