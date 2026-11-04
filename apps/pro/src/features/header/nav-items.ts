import type { StaticImageData } from 'next/image';

import houseIcon from '@/_assets/icons/lucide-house.svg';
import caseIcon from '@/_assets/icons/solar-case.svg';
import chatRoundLineIcon from '@/_assets/icons/solar-chat-round-line.svg';
// TEMP: blog oculto
// import notebookIcon from '@/_assets/icons/solar-notebook.svg';
import userIcon from '@/_assets/icons/solar-user.svg';

export type NavItemKey = 'home' | 'about' | 'works' | 'blog' | 'contact';

export type NavItem = { key: NavItemKey; href: string; icon: StaticImageData };

/** Ícones do protótipo tablet do header v2 (Linear / Users / User, School / Case, Notes / Notebook…). */
export const ISLAND_NAV_ITEMS: NavItem[] = [
  { key: 'home', href: '/', icon: houseIcon },
  { key: 'about', href: '/about', icon: userIcon },
  { key: 'works', href: '/works', icon: caseIcon },
  // { key: 'blog', href: '/blog', icon: notebookIcon },
  { key: 'contact', href: '/contact', icon: chatRoundLineIcon },
];

/**
 * Só a rota exata é ativa: numa sub-rota (ex.: `/works/x`) nenhum item fica marcado e a pílula
 * some, porque a página de detalhe não é a lista que o item representa.
 */
export function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href;
}
