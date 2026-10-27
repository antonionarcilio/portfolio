import type { StaticImageData } from 'next/image';

import biDashboardCover from '@/_assets/projects/bi-01.png';
import biTableCover from '@/_assets/projects/bi-02.png';
import futurotecBlogCover from '@/_assets/projects/blog-ftec-01.png';
import type { WorksProjectRoleKey } from '@/features/works/projects';
import type { TeamMemberId } from '@/shared/data/team-members';

export type ProjectTeamRoleKey = 'productManager' | 'productDesigner' | 'developer';

export type ProjectMessageKey = 'corporateBlogEscallo';

export type ProjectTeamEntry = {
  roleKey: ProjectTeamRoleKey;
  /** More than one member renders as an overlapping avatar group. */
  memberIds: TeamMemberId[];
};

export type ProjectDetail = {
  slug: string;
  /** Key under `pro.projectDetail.projects` holding the translated title and texts. */
  messageKey: ProjectMessageKey;
  roleKey: WorksProjectRoleKey;
  /** Company names are the same in every locale, so they are not translated. */
  client: string;
  /** TODO: set the live URL; the "Visit" link is hidden while this is undefined. */
  visitUrl?: string;
  team: ProjectTeamEntry[];
  stack: string[];
  covers: StaticImageData[];
};

/**
 * Static project details (intentionally not read from the CMS). One entry per `/works/<slug>` page.
 */
const ESCALLO_BLOG_DETAIL: ProjectDetail = {
  slug: 'corporate-blog-escallo',
  messageKey: 'corporateBlogEscallo',
  roleKey: 'frontend',
  client: 'Escallo | Futurotec',
  team: [
    { roleKey: 'productManager', memberIds: ['elisSouza'] },
    { roleKey: 'productDesigner', memberIds: ['kenMatsumoto'] },
    // TODO: second developer added only to exercise the avatar group; remove when the real team is known.
    { roleKey: 'developer', memberIds: ['antonioMascarenhas', 'thallesNeves'] },
  ],
  stack: ['Wordpress', 'Elementor Pro', 'JQuery', 'PHP', 'Google Analytics', 'RD Station'],
  // TODO: placeholders — replace with the Escallo blog screenshots once exported in color.
  covers: [futurotecBlogCover, biDashboardCover, biTableCover, futurotecBlogCover],
};

/**
 * TODO: placeholders — the other works cards reuse the Escallo blog content under their own slug
 * so every card can be tested; replace each with its real project data.
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  ESCALLO_BLOG_DETAIL,
  { ...ESCALLO_BLOG_DETAIL, slug: 'bot-studio' },
  { ...ESCALLO_BLOG_DETAIL, slug: 'bi' },
  { ...ESCALLO_BLOG_DETAIL, slug: 'corporate-blog-futurotec' },
];

export function findProjectDetail(slug: string): ProjectDetail | undefined {
  return PROJECT_DETAILS.find((project) => project.slug === slug);
}
