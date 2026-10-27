'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { Ref } from 'react';

import { Link, usePathname } from '@/i18n/navigation';
import { ScrambleText } from '@/shared/components/scramble-text';
import { buttonWhiteVariants } from '@/shared/variants/button-white-variants';
import { ISLAND_NAV_ITEMS, isActiveRoute, type NavItem } from './nav-items';
import { SlidingPill } from './sliding-pill';
import { usePillGeometry } from './use-pill-geometry';

type NavLinkItemProps = { item: NavItem; isActive: boolean; itemRef: Ref<HTMLDivElement> };

/**
 * Tablet (<1200px): só o item ativo mostra ícone + rótulo; os demais ficam só com ícone.
 * Desktop (≥1200px): todos mostram apenas o rótulo, sem ícone.
 */
function NavLinkItem({ item, isActive, itemRef }: NavLinkItemProps) {
  const t = useTranslations('pro.nav');
  const labelVisibility = isActive ? 'block' : 'max-[1199px]:hidden min-[1200px]:block';

  return (
    <div ref={itemRef}>
      <Link
        href={item.href}
        aria-label={t(item.key)}
        aria-current={isActive ? 'page' : undefined}
        className={buttonWhiteVariants({ state: isActive ? 'slidingCurrent' : 'sliding', size: 'lg' })}
      >
        <Image src={item.icon} alt="" aria-hidden width={14} height={14} className="shrink-0 min-[1200px]:hidden" />
        <span className={labelVisibility}>
          <ScrambleText>{t(item.key)}</ScrambleText>
        </span>
      </Link>
    </div>
  );
}

/** Divisor entre dois ícones inativos no tablet (protótipo: 0,5px × 10px, opacidade 30%). */
function IconDivider() {
  return <span aria-hidden className="h-[10px] w-[0.5px] shrink-0 bg-alpha-black-30 min-[1200px]:hidden" />;
}

/**
 * Botões do menu padrão da ilha, com uma pílula única que desliza até o item ativo. O container
 * (fundo, padding e largura animada) é de `IslandSurface`.
 * @example <IslandNav />
 */
export function IslandNav() {
  const pathname = usePathname();
  const activeIndex = ISLAND_NAV_ITEMS.findIndex(({ href }) => isActiveRoute(pathname, href));
  const { itemRefs, pill } = usePillGeometry(activeIndex);

  return (
    <nav className="relative flex items-center gap-[2px]">
      {pill && <SlidingPill geometry={pill} />}
      {ISLAND_NAV_ITEMS.map((item, index) => (
        <div key={item.key} className="flex items-center gap-[2px]">
          {index > 0 && index !== activeIndex && index - 1 !== activeIndex && <IconDivider />}
          <NavLinkItem
            item={item}
            isActive={index === activeIndex}
            itemRef={(element) => {
              itemRefs.current[index] = element;
            }}
          />
        </div>
      ))}
    </nav>
  );
}
