'use client';

import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { ALargeSmall, Accessibility, Contrast, Link, MousePointer2 } from 'lucide-react';

import { type A11yKey, useA11y } from '@/contexts/a11y-context';
import { DropdownBase } from '@/shared/dropdown-base';

import { CvSwitch } from './cv-switch';

// ---------------------------------------------------------------------------
// Variant definitions
// ---------------------------------------------------------------------------

const triggerVariant = cva(
  'inline-flex items-center gap-2 cursor-pointer transition-all bg-[rgba(43,214,255,0.06)] text-cv-cyan text-[12px] tracking-[0.2em] px-3 py-[5px] border',
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
  'grid gap-3 w-full bg-transparent border-none text-left outline-none text-[12px] tracking-[0.06em] px-[6px] py-[7px] cursor-pointer transition-colors duration-150',
  {
    variants: {
      active: {
        true: 'text-cv-cyan',
        false: 'text-cv-text',
      },
      focused: {
        true: 'bg-[rgba(43,214,255,0.06)]',
        false: '',
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
  'min-w-[260px] bg-cv-panel border border-cv-cyan outline-none',
  'pt-[10px] px-[12px] pb-[12px] z-[120]',
  'shadow-[inset_0_0_30px_rgba(43,214,255,0.05),0_8px_24px_rgba(0,0,0,0.5),0_0_18px_rgba(43,214,255,0.18)]',
);

const TITLE_CLS = clsx(
  'text-cv-cyan text-[10px] tracking-[0.24em] uppercase',
  'mb-2 pb-[6px] border-b border-cv-border',
);

const FOOTER_CLS = clsx(
  'mt-2 pt-2 border-t border-dashed border-cv-border',
  'flex justify-between items-center',
  'text-[9px] tracking-[0.2em] uppercase text-cv-text-muted',
);

const RESET_BTN_CLS = clsx(
  'bg-transparent border border-cv-border text-cv-text-dim',
  'text-[9px] tracking-[0.2em] px-2 py-[3px] cursor-pointer transition-all duration-150',
  'hover:border-cv-cyan hover:text-cv-cyan focus-visible:outline-none focus-visible:border-cv-cyan focus-visible:text-cv-cyan',
);

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const ITEMS: { key: A11yKey; Icon: React.ElementType; label: string }[] = [
  { key: 'textLarge', Icon: ALargeSmall, label: 'Aumentar texto' },
  { key: 'cursorLarge', Icon: MousePointer2, label: 'Aumentar cursor' },
  { key: 'greyscale', Icon: Contrast, label: 'Tons de cinza' },
  { key: 'highlightLinks', Icon: Link, label: 'Destacar links' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function A11yDropdown() {
  const { opts, toggle, reset } = useA11y();
  const activeCount = Object.values(opts).filter(Boolean).length;

  return (
    <DropdownBase
      placement="top-end"
      offsetPx={8}
      itemCount={ITEMS.length}
      transitionInitial={{ opacity: 0, transform: 'translateY(6px)' }}
      transitionOpen={{ opacity: 1, transform: 'translateY(0px)' }}
      trigger={({ open, ref, triggerProps }) => (
        <button
          ref={ref as unknown as React.Ref<HTMLButtonElement>}
          className={triggerVariant({ open })}
          aria-label="Acessibilidade"
          {...triggerProps}
        >
          <Accessibility size={14} aria-hidden="true" />
          <span>A11Y</span>
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
      {({ floatingRef, floatingStyles, transitionStyles, floatingProps, getItemProps, activeIndex, listRef }) => (
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

          <div className={TITLE_CLS}>{'// ACESSIBILIDADE'}</div>

          {ITEMS.map(({ key, Icon, label }, index) => {
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
                {...getItemProps({ onClick: () => toggle(key) })}
              >
                <span className="flex items-center gap-[9px] min-w-0">
                  <span className={icoVariant({ active })} aria-hidden="true">
                    <Icon size={12} />
                  </span>
                  <span>{label}</span>
                </span>
                <CvSwitch checked={active} asDisplay />
              </button>
            );
          })}

          <div className={FOOTER_CLS}>
            <span>{activeCount}/4 ON</span>
            <button className={RESET_BTN_CLS} onClick={reset}>
              Resetar
            </button>
          </div>
        </div>
      )}
    </DropdownBase>
  );
}
