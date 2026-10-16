export type FlipDemoContent = {
  company: string;
  projectName: string;
  period: string;
  expertiseArea: string;
  excerpt: string;
  description: string;
  stack: string[];
  href: string;
};

/** Fictitious lorem-ipsum data — this demo never touches the real CMS/portfolio data. */
export const flipDemoContent: FlipDemoContent = {
  company: 'Lorem Industries',
  projectName: 'Ipsum Dashboard',
  period: '2023 — 2024',
  expertiseArea: 'Frontend Engineering',
  excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore ' +
    'et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut ' +
    'aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ' +
    'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in ' +
    'culpa qui officia deserunt mollit anim id est laborum.',
  stack: ['Lorem', 'Ipsum', 'Dolor', 'Sit'],
  href: 'https://example.com',
};
