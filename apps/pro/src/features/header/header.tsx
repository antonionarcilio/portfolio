'use client';
import { useTranslations } from 'next-intl';
import Image, { type StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';

import brandLogo from '@/_assets/brand/black.svg';
import chevronsDownUpIcon from '@/_assets/icons/lucide-chevrons-down-up.svg';
import chevronsUpDownIcon from '@/_assets/icons/lucide-chevrons-up-down.svg';
import houseIcon from '@/_assets/icons/lucide-house.svg';
import caseIcon from '@/_assets/icons/solar-case.svg';
import chatRoundLineIcon from '@/_assets/icons/solar-chat-round-line.svg';
import closeCirlceIcon from '@/_assets/icons/solar-close-circle.svg';
import globalIcon from '@/_assets/icons/solar-global.svg';
import magnifierIcon from '@/_assets/icons/solar-magnifer.svg';
import notebookIcon from '@/_assets/icons/solar-notebook.svg';
import sunFogIcon from '@/_assets/icons/solar-sun-fog.svg';
import sunIcon from '@/_assets/icons/solar-sun.svg';
import userRoundedIcon from '@/_assets/icons/solar-user-rounded.svg';
import { Link, usePathname } from '@/i18n/navigation';
import { useTheme } from '@/shared/contexts/theme-context';
import { type A11yFeatures, A11yDropdown } from './a11y-dropdown';
import { I18nDropdown } from './i18n-dropdown';

type OpenDropdown = 'a11y' | 'i18n' | null;

const NAV_ITEMS: { key: 'home' | 'about' | 'works' | 'blog' | 'contact'; href: string; icon: StaticImageData }[] = [
  { key: 'home', href: '/', icon: houseIcon },
  { key: 'about', href: '/about', icon: userRoundedIcon },
  { key: 'works', href: '/works', icon: caseIcon },
  { key: 'blog', href: '/blog', icon: notebookIcon },
  { key: 'contact', href: '/contact', icon: chatRoundLineIcon },
];

export function Header({ isHeaderHidden }: { isHeaderHidden: boolean }) {
  const t = useTranslations('pro.nav');
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [a11yFeatures, setA11yFeatures] = useState<A11yFeatures>({
    bigCursor: false,
    highlightLinks: false,
    biggerText: false,
    pauseAnimations: false,
  });

  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  const a11yRef = useRef<HTMLDivElement>(null);
  const i18nRef = useRef<HTMLDivElement>(null);

  const activeA11yCount = Object.values(a11yFeatures).filter(Boolean).length;

  useEffect(() => {
    if (!openDropdown) return;
    const handler = (e: MouseEvent) => {
      const ref = openDropdown === 'a11y' ? a11yRef : i18nRef;
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdown]);

  useEffect(() => {
    const activeIndex = NAV_ITEMS.findIndex(({ href }) => {
      if (href === '/') return pathname === '/';
      return pathname === href || pathname.startsWith(href + '/');
    });
    if (activeIndex === -1) {
      setPill(null);
      return;
    }
    const nav = navRef.current;
    const item = itemRefs.current[activeIndex];
    if (!nav || !item) return;
    const navRect = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    setPill({ left: itemRect.left - navRect.left, width: itemRect.width });
  }, [pathname]);

  const toggleA11y = (key: keyof A11yFeatures) => {
    setA11yFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDropdown = (name: 'a11y' | 'i18n') => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const themeIcon = theme === 'day' ? sunIcon : sunFogIcon;
  const a11yChevron = openDropdown === 'a11y' ? chevronsDownUpIcon : chevronsUpDownIcon;

  return (
    <header className="relative flex w-full items-center justify-between py-[22px] h-auto overflow-visible">
      {/* Nav segmented control — single pill slides to the active item */}
      <nav ref={navRef} className="relative flex items-center gap-[2px] bg-alpha-black-5 p-[3px] rounded-[8px]">
        {pill && (
          <div
            aria-hidden
            className="absolute top-[3px] h-[29px] rounded-[6px] bg-alpha-white-100 border border-alpha-white-100 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)] pointer-events-none"
            style={{
              left: pill.left,
              width: pill.width,
              transition: 'left 0.22s cubic-bezier(0.4,0,0.2,1), width 0.22s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        )}
        {NAV_ITEMS.map(({ key, href, icon }, index) => (
          <div
            key={key}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
          >
            <Link
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className="relative z-10 flex items-center gap-1 rounded-[6px] px-[10px] h-[29px] text-sm font-regular font-portfolio text-alpha-black-100 whitespace-nowrap focus-visible:outline-none"
            >
              <Image
                src={icon}
                alt=""
                aria-hidden
                width={12}
                height={12}
                className="max-[1199px]:block min-[1200px]:hidden shrink-0"
              />
              <span className="max-[1199px]:hidden min-[1200px]:block">{t(key)}</span>
            </Link>
          </div>
        ))}
      </nav>

      {/* Brand logo — absolute center. Sem `pointer-events-none`: o tooltip nativo do
          `title` só aparece com hover real; a área da div se limita ao tamanho da logo. */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image src={brandLogo} alt="Antonio Mascarenhas" title="Antônio Mascarenhas" width={39} height={22} priority />
      </div>

      {/* Right tools */}
      <div className="flex items-center gap-4 shrink-0">
        {searchOpen ? (
          /* Search focused state */
          <div className="flex items-center gap-2">
            <span className="text-sm font-regular font-portfolio text-alpha-black-60 whitespace-nowrap">
              {t('searchPlaceholder')}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={t('searchClose')}
                onClick={() => setSearchOpen(false)}
                className="shrink-0 flex items-center justify-center rounded-[99px] opacity-60 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
              >
                <Image src={closeCirlceIcon} alt="" aria-hidden width={18} height={18} />
              </button>
              <span className="h-[10px] w-px bg-alpha-black-30 shrink-0" />
              <button
                type="button"
                aria-label={t('searchLabel')}
                className="shrink-0 flex items-center justify-center rounded-[99px] opacity-60 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
              >
                <Image src={magnifierIcon} alt="" aria-hidden width={18} height={18} />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Search */}
            <button
              type="button"
              aria-label={t('searchLabel')}
              onClick={() => setSearchOpen(true)}
              className="shrink-0 flex items-center justify-center rounded-[99px] opacity-60 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
            >
              <Image src={magnifierIcon} alt="" aria-hidden width={18} height={18} />
            </button>

            {/* Theme toggle */}
            <button
              type="button"
              aria-label={t('themeLabel')}
              onClick={toggleTheme}
              className="shrink-0 flex items-center justify-center rounded-[99px] opacity-60 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
            >
              <Image src={themeIcon} alt="" aria-hidden width={20} height={20} />
            </button>

            {/* i18n */}
            <div className="relative shrink-0" ref={i18nRef}>
              <button
                type="button"
                aria-label={t('languageLabel')}
                onClick={() => toggleDropdown('i18n')}
                className="shrink-0 flex items-center justify-center rounded-[99px] opacity-60 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
              >
                <Image src={globalIcon} alt="" aria-hidden width={18} height={18} />
              </button>
              {openDropdown === 'i18n' && (
                <I18nDropdown isHeaderHidden={isHeaderHidden} onClose={() => setOpenDropdown(null)} />
              )}
            </div>

            {/* A11y */}
            <div className="relative shrink-0" ref={a11yRef}>
              <div className="flex items-center bg-alpha-black-5 p-[3px] rounded-[8px]">
                <button
                  type="button"
                  onClick={() => toggleDropdown('a11y')}
                  className="flex items-center gap-1 bg-alpha-white-100 border border-alpha-white-100 rounded-[6px] px-[10px] h-[29px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)] text-sm font-regular font-portfolio text-alpha-black-100 whitespace-nowrap hover:border-alpha-black-60 focus-visible:border-alpha-black-60 focus-visible:outline-none"
                >
                  {t('accessibility')}
                  <Image src={a11yChevron} alt="" aria-hidden width={12} height={12} />
                </button>
                {activeA11yCount > 0 && (
                  <span className="px-[6px] text-xs font-medium font-portfolio text-grey-500 whitespace-nowrap">
                    {activeA11yCount}
                  </span>
                )}
              </div>
              {openDropdown === 'a11y' && (
                <A11yDropdown features={a11yFeatures} isHeaderHidden={isHeaderHidden} onToggle={toggleA11y} />
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
