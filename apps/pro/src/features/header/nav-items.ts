import type { StaticImageData } from 'next/image';

import houseIcon from '@/_assets/icons/lucide-house.svg';
import caseIcon from '@/_assets/icons/solar-case.svg';
import chatRoundLineIcon from '@/_assets/icons/solar-chat-round-line.svg';
import notebookIcon from '@/_assets/icons/solar-notebook.svg';
import userIcon from '@/_assets/icons/solar-user.svg';

export type NavItemKey = 'home' | 'about' | 'works' | 'blog' | 'contact';

export type NavItem = { key: NavItemKey; href: string; icon: StaticImageData };

/** Ícones do protótipo tablet do header v2 (Linear / Users / User, School / Case, Notes / Notebook…). */
export const ISLAND_NAV_ITEMS: NavItem[] = [
  { key: 'home', href: '/', icon: houseIcon },
  { key: 'about', href: '/about', icon: userIcon },
  { key: 'works', href: '/works', icon: caseIcon },
  { key: 'blog', href: '/blog', icon: notebookIcon },
  { key: 'contact', href: '/contact', icon: chatRoundLineIcon },
];

/** `/` só é ativo na raiz; as demais rotas também valem para sub-rotas (`/works/x`). */
export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
