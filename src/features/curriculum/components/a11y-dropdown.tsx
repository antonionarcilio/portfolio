'use client';

import clsx from 'clsx';
import { ALargeSmall, Accessibility, Contrast, Link, MousePointer2 } from 'lucide-react';

import { type A11yKey, useA11y } from '@/contexts/a11y-context';
import { DropdownBase } from '@/shared/dropdown-base';

import { CvSwitch } from './cv-switch';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type A11yVariant = 'gamer';

type VariantConfig = {
  trigger: (open: boolean, activeCount: number) => string;
  menu: string;
  corners: boolean;
  title: string;
  item: (active: boolean, focused: boolean) => string;
  ico: (active: boolean) => string;
  footer: string;
  resetBtn: string;
};

// ---------------------------------------------------------------------------
// Variant definitions — add new layout variants here
// ---------------------------------------------------------------------------

const variants: Record<A11yVariant, VariantConfig> = {
  gamer: {
    trigger: (open) =>
      clsx(
        'inline-flex items-center gap-2 cursor-pointer transition-all',
        'bg-[rgba(43,214,255,0.06)] text-cv-cyan',
        'text-[12px] tracking-[0.2em] px-3 py-[5px]',
        'border',
        open
          ? 'border-cv-cyan shadow-[0_0_14px_rgba(43,214,255,0.25)]'
          : 'border-cv-cyan-dim hover:border-cv-cyan hover:shadow-[0_0_14px_rgba(43,214,255,0.25)]',
      ),
    menu: clsx(
      'min-w-[260px] bg-cv-panel border border-cv-cyan outline-none',
      'pt-[10px] px-[12px] pb-[12px] z-[120]',
      'shadow-[inset_0_0_30px_rgba(43,214,255,0.05),0_8px_24px_rgba(0,0,0,0.5),0_0_18px_rgba(43,214,255,0.18)]',
    ),
    corners: true,
    title: clsx('text-cv-cyan text-[10px] tracking-[0.24em] uppercase', 'mb-2 pb-[6px] border-b border-cv-border'),
    item: (active, focused) =>
      clsx(
        'grid gap-3 w-full bg-transparent border-none text-left outline-none',
        'text-[12px] tracking-[0.06em] px-[6px] py-[7px] cursor-pointer transition-colors duration-150',
        focused && 'bg-[rgba(43,214,255,0.06)]',
        active ? 'text-cv-cyan' : 'text-cv-text',
      ),
    ico: (active) =>
      clsx(
        'w-[18px] h-[18px] border inline-flex items-center justify-center',
        'flex-shrink-0 transition-all duration-150',
        active
          ? 'border-cv-cyan text-cv-cyan shadow-[0_0_8px_rgba(43,214,255,0.4)]'
          : 'border-cv-border text-cv-text-dim',
      ),
    footer: clsx(
      'mt-2 pt-2 border-t border-dashed border-cv-border',
      'flex justify-between items-center',
      'text-[9px] tracking-[0.2em] uppercase text-cv-text-muted',
    ),
    resetBtn: clsx(
      'bg-transparent border border-cv-border text-cv-text-dim',
      'text-[9px] tracking-[0.2em] px-2 py-[3px] cursor-pointer transition-all duration-150',
      'hover:border-cv-cyan hover:text-cv-cyan focus-visible:outline-none focus-visible:border-cv-cyan focus-visible:text-cv-cyan',
    ),
  },
};

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

type Props = {
  variant?: A11yVariant;
};

export function A11yDropdown({ variant = 'gamer' }: Props) {
  const { opts, toggle, reset } = useA11y();
  const v = variants[variant];
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
          className={v.trigger(open, activeCount)}
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
          className={v.menu}
          {...floatingProps}
        >
          {v.corners && (
            <>
              <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan top-[-3px] left-[-3px] border-r-0 border-b-0 pointer-events-none" />
              <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan top-[-3px] right-[-3px] border-l-0 border-b-0 pointer-events-none" />
              <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan bottom-[-3px] left-[-3px] border-r-0 border-t-0 pointer-events-none" />
              <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan bottom-[-3px] right-[-3px] border-l-0 border-t-0 pointer-events-none" />
            </>
          )}

          <div className={v.title}>{'// ACESSIBILIDADE'}</div>

          {ITEMS.map(({ key, Icon, label }, index) => {
            const active = opts[key];
            const focused = activeIndex === index;
            return (
              <button
                key={key}
                ref={(node) => {
                  listRef.current[index] = node;
                }}
                className={v.item(active, focused)}
                style={{ gridTemplateColumns: '1fr auto' }}
                role="menuitemcheckbox"
                aria-checked={active}
                tabIndex={focused ? 0 : -1}
                {...getItemProps({ onClick: () => toggle(key) })}
              >
                <span className="flex items-center gap-[9px] min-w-0">
                  <span className={v.ico(active)} aria-hidden="true">
                    <Icon size={12} />
                  </span>
                  <span>{label}</span>
                </span>
                <CvSwitch checked={active} asDisplay />
              </button>
            );
          })}

          <div className={v.footer}>
            <span>{activeCount}/4 ON</span>
            <button className={v.resetBtn} onClick={reset}>
              Resetar
            </button>
          </div>
        </div>
      )}
    </DropdownBase>
  );
}
