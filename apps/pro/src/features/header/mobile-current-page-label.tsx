'use client';
import { useTranslations } from 'next-intl';

import { usePathname } from '@/i18n/navigation';
import { useProjectTitle } from '@/shared/contexts/project-titles-context';
import { findCurrentNavItem } from './nav-items';

const PROJECT_PATH_PREFIX = '/works/';

/**
 * Slug do projeto quando a rota é o detalhe de um trabalho (`/works/<slug>`), senão `undefined`.
 * @example extractProjectSlug('/works/portal') // 'portal'
 */
function extractProjectSlug(pathname: string): string | undefined {
  if (!pathname.startsWith(PROJECT_PATH_PREFIX)) return undefined;
  return pathname.slice(PROJECT_PATH_PREFIX.length).split('/')[0] || undefined;
}

/**
 * Indica a página atual ao lado do botão do menu mobile (drawer fechado): legenda curta na
 * primeira linha e o nome da página em destaque na segunda — no detalhe de um trabalho, seguido do
 * nome do projeto ("Trabalhos: Portal"). Em rotas fora da navegação (ex.: 404) não renderiza nada.
 * @example <MobileCurrentPageLabel />
 */
export function MobileCurrentPageLabel() {
  const islandLabels = useTranslations('pro.island');
  const navigationLabels = useTranslations('pro.nav');
  const pathname = usePathname();
  const currentNavItem = findCurrentNavItem(pathname);
  const projectTitle = useProjectTitle(extractProjectSlug(pathname));
  if (!currentNavItem) return null;

  const pageName = navigationLabels(currentNavItem.key);
  const currentLabel = projectTitle
    ? islandLabels('currentProjectLabel', { page: pageName, project: projectTitle })
    : pageName;

  return (
    // `min-w-0` + `truncate`: títulos longos de projeto não empurram o botão do menu para fora da tela.
    <div className="flex min-w-0 flex-col items-end font-portfolio text-alpha-black-100">
      {/* `font-light` (300) é o peso mais leve dos tokens — não há token para 100. */}
      <span className="text-xs font-light text-alpha-black-60">{islandLabels('currentPageLabel')}</span>
      <span className="max-w-full truncate text-xs font-bold leading-[14px]">{currentLabel}</span>
    </div>
  );
}
