import type { StaticImageData } from 'next/image';

import biDashboardCover from '@/_assets/projects/bi-01.png';
import biTableCover from '@/_assets/projects/bi-02.png';
import futurotecBlogCover from '@/_assets/projects/blog-ftec-01.png';

export type WorksProjectTitleKey = 'botStudio' | 'bi' | 'corporateBlog';
export type WorksProjectRoleKey = 'prototyping' | 'frontend';

export type WorksProject = {
  id: string;
  titleKey: WorksProjectTitleKey;
  roleKey: WorksProjectRoleKey;
  /** Not translated: a year and technology names are the same in every locale. */
  year: string;
  techStack: string;
  cover: StaticImageData;
};

/**
 * Static project list for the works page (intentionally not read from the CMS).
 * Order follows the Figma grid: left-to-right, top-to-bottom.
 */
export const WORKS_PROJECTS: WorksProject[] = [
  {
    id: 'bot-studio',
    titleKey: 'botStudio',
    roleKey: 'prototyping',
    year: '2026',
    techStack: 'Figma',
    // TODO: placeholder — replace with the Bot Studio cover once exported in color.
    cover: biTableCover,
  },
  {
    id: 'bi',
    titleKey: 'bi',
    roleKey: 'frontend',
    year: '2023',
    techStack: 'React, JavaScript +5',
    cover: biDashboardCover,
  },
  {
    id: 'corporate-blog-escallo',
    titleKey: 'corporateBlog',
    roleKey: 'frontend',
    year: '2026',
    techStack: 'Wordpress, Elementor Pro +3',
    // TODO: placeholder — replace with the Escallo blog cover once exported in color.
    cover: futurotecBlogCover,
  },
  {
    id: 'corporate-blog-futurotec',
    titleKey: 'corporateBlog',
    roleKey: 'frontend',
    year: '2023',
    techStack: 'Wordpress, Elementor Pro +3',
    cover: futurotecBlogCover,
  },
];
