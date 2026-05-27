'use client';

import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { ALargeSmall, Accessibility, Contrast, Link, MousePointer2 } from 'lucide-react';

import { type A11yKey, useA11y } from '@/features/gamer/contexts/a11y-context';
import { DropdownBase } from '@/shared/components/dropdown-base';
import { useIsMobile } from '@/shared/hooks/use-is-mobile';

import { CvSwitch } from './cv-switch';

// ---------------------------------------------------------------------------
// Variant definitions
// ---------------------------------------------------------------------------

const triggerVariant = cva(
  'inline-flex items-center gap-2 cursor-gamer-pointer transition-all bg-[rgba(43,214,255,0.06)] text-cv-cyan text-[12px] tracking-[0.2em] px-3 py-[5px] border',
  {
    variants: {
      open: {
        true: 'border-cv-cyan shadow-[0_0_14px_rgba(43,214,255,0.25)]',
        false: 'border-cv-cyan-dim hover:border-cv-cyan hover:shadow-[0_0_14px_rgba(43,214,255,0.25)]',
      },
    },
  },
);

const itemVariant = cva(
  'grid gap-3 w-full bg-transparent border-none text-left text-[12px] tracking-[0.06em] px-[6px] py-[7px] cursor-gamer-pointer transition-colors duration-150 focus:outline-none font-cv-mono',
  {
    variants: {
      active: {
        true: 'text-cv-cyan',
        false: 'text-cv-text',
      },
      focused: {
        true: 'bg-[rgba(43,214,255,0.10)] outline outline-1 outline-[rgba(43,214,255,0.6)]',
        false: 'outline-none',
      },
    },
  },
);

const icoVariant = cva(
  'w-[18px] h-[18px] border inline-flex items-center justify-center flex-shrink-0 transition-all duration-150',
  {
    variants: {
      active: {
        true: 'border-cv-cyan text-cv-cyan shadow-[0_0_8px_rgba(43,214,255,0.4)]',
        false: 'border-cv-border text-cv-text-dim',
      },
    },
  },
);

const MENU_CLS = clsx(
  'a11y-dropdown-outer min-w-[260px] bg-cv-panel border border-cv-cyan outline-none',
  'z-[120]',
  'shadow-[inset_0_0_30px_rgba(43,214,255,0.05),0_8px_24px_rgba(0,0,0,0.5),0_0_18px_rgba(43,214,255,0.18)]',
  'font-cv-mono relative',
);

const TITLE_CLS = clsx(
  'text-cv-cyan text-[10px] tracking-[0.24em] uppercase font-cv-mono',
  'mb-2 pb-[6px] border-b border-cv-border',
);

const FOOTER_CLS = clsx(
  'mt-2 pt-2 border-t border-dashed border-cv-border',
  'flex justify-between items-center',
  'text-[9px] tracking-[0.2em] uppercase text-cv-text-muted font-cv-mono',
);

const RESET_BTN_CLS = clsx(
  'bg-transparent border border-cv-border text-cv-text-dim',
  'text-[9px] tracking-[0.2em] px-2 py-[3px] cursor-gamer-pointer transition-all duration-150',
  'hover:border-cv-cyan hover:text-cv-cyan focus-visible:outline-none focus-visible:border-cv-cyan focus-visible:text-cv-cyan',
  'font-cv-mono',
);

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const ITEMS: { key: A11yKey; Icon: React.ElementType; label: string; hideOnMobile?: boolean }[] = [
  { key: 'textLarge', Icon: ALargeSmall, label: 'Aumentar escala' },
  { key: 'cursorLarge', Icon: MousePointer2, label: 'Aumentar cursor', hideOnMobile: true },
  { key: 'greyscale', Icon: Contrast, label: 'Tons de cinza' },
  { key: 'highlightLinks', Icon: Link, label: 'Destacar links' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function A11yDropdown() {
  const { opts, toggle, reset } = useA11y();
  const isMobile = useIsMobile();
  const visibleItems = ITEMS.filter((item) => !(isMobile && item.hideOnMobile));
  const activeCount = Object.values(opts).filter(Boolean).length;

  return (
    <DropdownBase
      placement="top-end"
      offsetPx={8}
      itemCount={visibleItems.length}
      transitionInitial={{ opacity: 0, transform: 'translateY(6px)' }}
      transitionOpen={{ opacity: 1, transform: 'translateY(0px)' }}
      drawerLabel="Acessibilidade"
      drawerOverlayClassName="bg-[rgba(3,6,15,0.78)] backdrop-blur-[4px] z-[300] cursor-gamer-pointer"
      drawerContentClassName="z-[300] bg-cv-panel border-t border-cv-cyan cursor-gamer-default"
      drawerHandleClassName="bg-cv-cyan/30"
      trigger={({ open, ref, triggerProps }) => (
        <button
          ref={ref as unknown as React.Ref<HTMLButtonElement>}
          className={triggerVariant({ open })}
          aria-label="Acessibilidade"
          aria-haspopup="menu"
          aria-expanded={open}
          {...triggerProps}
        >
          <Accessibility size={14} aria-hidden="true" />
          A11Y
          {activeCount > 0 && (
            <span className="text-[9px] opacity-70" aria-label={`${activeCount} opções ativas`}>
              [{activeCount}]
            </span>
          )}
          <span className="text-[9px] opacity-70" aria-hidden="true">
            {open ? '▲' : '▼'}
          </span>
        </button>
      )}
    >
      {({
        floatingRef,
        floatingStyles,
        transitionStyles,
        floatingProps,
        getItemProps,
        activeIndex,
        listRef,
        isDrawer,
      }) => {
        const itemsJsx = visibleItems.map(({ key, Icon, label }, index) => {
          const active = opts[key];
          const focused = activeIndex === index;
          return (
            <button
              key={key}
              ref={(node) => {
                listRef.current[index] = node;
              }}
              className={itemVariant({ active, focused })}
              style={{ gridTemplateColumns: '1fr auto' }}
              role="menuitemcheckbox"
              aria-checked={active}
              tabIndex={focused ? 0 : -1}
              {...getItemProps({
                onClick: () => toggle(key),
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    toggle(key);
                  }
                },
              })}
            >
              <span className="flex items-center gap-[9px] min-w-0">
                <span className={icoVariant({ active })} aria-hidden="true">
                  <Icon size={12} />
                </span>
                <span>{label}</span>
              </span>
              <CvSwitch checked={active} focused={focused} asDisplay />
            </button>
          );
        });

        const footerJsx = (
          <div className={FOOTER_CLS + ' group'}>
            <span className="group-hover:text-cv-text max-[520px]:text-cv-text transition-colors">
              {activeCount}/4 ON
            </span>
            <button className={RESET_BTN_CLS} onClick={reset}>
              Resetar
            </button>
          </div>
        );

        if (isDrawer) {
          return (
            <div className="px-[12px] pt-[6px] pb-[20px] w-full font-cv-mono a11y-drawer-inner">
              <span className={`${TITLE_CLS} block`}>{'// ACESSIBILIDADE'}</span>
              {itemsJsx}
              {footerJsx}
            </div>
          );
        }

        return (
          <div
            ref={floatingRef}
            style={{ ...floatingStyles, ...transitionStyles }}
            className={MENU_CLS}
            {...floatingProps}
          >
            <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan top-[-3px] left-[-3px] border-r-0 border-b-0 pointer-events-none" />
            <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan top-[-3px] right-[-3px] border-l-0 border-b-0 pointer-events-none" />
            <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan bottom-[-3px] left-[-3px] border-r-0 border-t-0 pointer-events-none" />
            <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan bottom-[-3px] right-[-3px] border-l-0 border-t-0 pointer-events-none" />
            {/* a11y-dropdown-inner receives zoom when text-large is active, keeping
                Floating UI's root element unscaled so positioning math stays correct */}
            <div className="a11y-dropdown-inner pt-[10px] px-[12px] pb-[12px]">
              <span className={`${TITLE_CLS} block`}>{'// ACESSIBILIDADE'}</span>
              {itemsJsx}
              {footerJsx}
            </div>
          </div>
        );
      }}
    </DropdownBase>
  );
}
