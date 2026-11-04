'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Link, usePathname } from '@/i18n/navigation';
import { ScrambleText } from '@/shared/components/scramble-text';
import { ISLAND_NAV_ITEMS, isActiveRoute } from './nav-items';

const PAGE_LINK_ICON_PIXELS = 22;
const PAGE_LINK_CLASS =
  'flex items-center gap-3 font-portfolio text-md font-regular text-alpha-black-100 focus-visible:outline-none';

type MobilePageLinksProps = { onNavigate: () => void };

/**
 * Lista de páginas do menu mobile. O item da rota atual fica em destaque (`aria-current`) e qualquer
 * clique fecha o drawer.
 * @example <MobilePageLinks onNavigate={() => setIsOpen(false)} />
 */
export function MobilePageLinks({ onNavigate }: MobilePageLinksProps) {
  const t = useTranslations('pro.nav');
  const pathname = usePathname();

  return (
    <nav aria-label={t('home')} className="flex flex-col gap-4">
      {ISLAND_NAV_ITEMS.map(({ key, href, icon }) => {
        const isActive = isActiveRoute(pathname, href);
        const content = (
          <>
            <Image src={icon} alt="" aria-hidden width={PAGE_LINK_ICON_PIXELS} height={PAGE_LINK_ICON_PIXELS} />
            <span>
              <ScrambleText>{t(key)}</ScrambleText>
            </span>
          </>
        );
        // A página atual não é um link: já estamos nela, então fica desativada.
        if (isActive) {
          return (
            <span
              key={key}
              aria-current="page"
              aria-disabled="true"
              className={`${PAGE_LINK_CLASS} cursor-not-allowed opacity-50`}
            >
              {content}
            </span>
          );
        }
        return (
          <Link
            key={key}
            href={href}
            onClick={onNavigate}
            className={`${PAGE_LINK_CLASS} focus-visible:text-alpha-black-70`}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
