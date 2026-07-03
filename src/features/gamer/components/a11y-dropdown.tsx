'use client';

import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { ALargeSmall, Accessibility, Contrast, Link, MousePointer2, Pause } from 'lucide-react';

import { type A11yKey, useA11y } from '@/features/gamer/contexts/a11y-context';
import { DropdownBase } from '@/shared/components/dropdown-base';
import { useIsMobile } from '@/shared/hooks/use-is-mobile';

import { CornerBrackets } from './corner-brackets';
import { CvButton } from './cv-button';
import { CvSwitch } from './cv-switch';

// ---------------------------------------------------------------------------
// Variant definitions
// ---------------------------------------------------------------------------

const triggerVariant = cva(
  'transition-all bg-[rgba(43,214,255,0.06)] text-cv-cyan text-[12px] tracking-[0.2em] px-3 py-[5px] border',
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
  'a11y-dropdown-outer min-w-[260px] border border-cv-border outline-none',
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
  'text-[9px] tracking-[0.2em] px-2 py-[3px] transition-all duration-150',
  'hover:border-cv-cyan hover:text-cv-cyan focus-visible:outline-none focus-visible:border-cv-cyan focus-visible:text-cv-cyan',
  'font-cv-mono',
);

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const ITEMS: {
  key: A11yKey;
  Icon: React.ElementType;
  label: string;
  hideOnMobile?: boolean;
  hideBelow400?: boolean;
}[] = [
  { key: 'upscale', Icon: ALargeSmall, label: 'Aumentar escala', hideBelow400: true },
  { key: 'cursorLarge', Icon: MousePointer2, label: 'Aumentar cursor' },
  { key: 'greyscale', Icon: Contrast, label: 'Tons de cinza' },
  { key: 'highlightLinks', Icon: Link, label: 'Destacar links' },
  { key: 'reduceMotion', Icon: Pause, label: 'Desabilitar animações' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function A11yDropdown({ floatingTopOverride }: { floatingTopOverride?: string } = {}) {
  const { opts, toggle, reset } = useA11y();
  const isMobile = useIsMobile();
  const isBelow400 = useIsMobile(400);
  const visibleItems = ITEMS.filter((item) => !(isMobile && item.hideOnMobile) && !(isBelow400 && item.hideBelow400));
  const activeCount = Object.values(opts).filter(Boolean).length;

  return (
    <DropdownBase
      placement="top-end"
      offsetPx={8}
      itemCount={visibleItems.length}
      transitionInitial={{ opacity: 0, transform: 'translateY(6px)' }}
      transitionOpen={{ opacity: 1, transform: 'translateY(0px)' }}
      noMotion={opts.reduceMotion}
      drawerLabel="Acessibilidade"
      drawerOverlayClassName="bg-[rgba(3,6,15,0.78)] backdrop-blur-[4px] z-[300] cursor-gamer-pointer"
      drawerContentClassName="z-[300] bg-cv-panel border-t border-cv-border cursor-gamer-default"
      drawerHandleClassName="bg-cv-cyan/30"
      trigger={({ open, ref, triggerProps }) => (
        <CvButton
          ref={ref as unknown as React.Ref<HTMLButtonElement>}
          className={triggerVariant({ open })}
          aria-label="Acessibilidade"
          aria-haspopup="menu"
          aria-expanded={open}
          leftIcon={<Accessibility size={14} aria-hidden="true" />}
          rightIcon={
            <span className="text-[9px] opacity-70" aria-hidden="true">
              {open ? 'ᨈ' : 'ᨆ'}
            </span>
          }
          {...triggerProps}
        >
          A11Y
          {activeCount > 0 && (
            <span className="text-[9px] opacity-70" aria-label={`${activeCount} opções ativas`}>
              [{activeCount}]
            </span>
          )}
        </CvButton>
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

        const makeFooter = (extra = '') => (
          <div
            className={
              FOOTER_CLS +
              ' opacity-90 hover:opacity-100 focus-within:opacity-100 active:opacity-100 transition-opacity' +
              (extra ? ' ' + extra : '')
            }
          >
            <span className="text-cv-text">NAVEGAÇÃO ↑↓</span>
            <CvButton className={RESET_BTN_CLS} onClick={reset}>
              Resetar
            </CvButton>
          </div>
        );

        if (isDrawer) {
          return (
            <div className="px-[12px] pt-[6px] pb-[20px] w-full font-cv-mono a11y-drawer-inner">
              <span className={`${TITLE_CLS} block !pb-4`}>{'// ACESSIBILIDADE'}</span>
              {itemsJsx}
              {makeFooter('!pt-4')}
            </div>
          );
        }

        return (
          <div
            ref={floatingRef}
            style={{
              ...floatingStyles,
              ...transitionStyles,
              ...(floatingTopOverride ? { top: opts.upscale ? '94px' : '80px' } : {}),
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
            className={MENU_CLS}
            {...floatingProps}
          >
            <CornerBrackets size="xs" />
            {/* a11y-dropdown-inner receives zoom when upscale is active, keeping
                Floating UI's root element unscaled so positioning math stays correct */}
            <div className="a11y-dropdown-inner pt-[10px] px-[12px] pb-[12px]">
              <span className={`${TITLE_CLS} block`}>{'// ACESSIBILIDADE'}</span>
              {itemsJsx}
              {makeFooter()}
            </div>
          </div>
        );
      }}
    </DropdownBase>
  );
}
