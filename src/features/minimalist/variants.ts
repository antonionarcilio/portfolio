import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

import type { MinimalistAppearance } from './types';

/**
 * Shared "label + value" leaf text pair used by every expanded-detail field
 * (about bio panel, experience detail, project detail): semibold heading in
 * the full foreground shade, light-weight value one shade dimmer.
 *
 * @example
 * <h3 className={fieldHeadingClass(appearance)}>{label}</h3>
 * <p className={fieldValueClass(appearance)}>{value}</p>
 */
export function fieldHeadingClass(appearance: MinimalistAppearance) {
  return clsx(
    'm-0 text-minimalist-md font-minimalist-semibold',
    appearance === 'light' ? 'text-minimalist-alpha-black-100' : 'text-minimalist-alpha-white-100',
  );
}
export function fieldValueClass(appearance: MinimalistAppearance) {
  return clsx(
    'm-0 text-minimalist-md font-minimalist-light [&_strong]:font-minimalist-semibold',
    appearance === 'light' ? 'text-minimalist-alpha-black-80' : 'text-minimalist-alpha-white-80',
  );
}

// `.minimalist-toggle` has no live consumer anywhere in the app (component was never built out) —
// kept as a no-op so the export doesn't dangle, but it renders no styling of its own.
export const toggleVariants = cva('', {
  variants: {
    appearance: { light: '', dark: '' },
    state: { on: '', off: '' },
  },
  defaultVariants: { appearance: 'light', state: 'off' },
});

export const paginationVariants = cva('hover:text-minimalist-muted', {
  variants: {
    // Neither varies the look — `PaginationButton` (navigation-menu.tsx) is never called with a
    // non-default `appearance`/`state` combination that changes color today; kept for API shape.
    appearance: { light: '', dark: '' },
    state: { regular: '', hover: '', focus: '' },
  },
  defaultVariants: { appearance: 'light', state: 'regular' },
});

export const dividerVariants = cva('minimalist-divider w-fit', {
  // `minimalist-divider` in the base string is a required CSS hook, not dead weight: styles.css
  // still targets it contextually (`.minimalist__about-copy h1 > .minimalist-divider`) to give the
  // vertical divider inside that one heading its 8px margin — every other usage relies on a
  // `gap` from its own flex container instead, so the margin can't just live here unconditionally.
  variants: {
    // No live rule ever keyed off `--light`/`--dark` — border/text color already come from
    // theme-reactive custom properties (`--minimalist-border`, `--minimalist-divider`).
    appearance: { light: '', dark: '' },
    variant: { v1: '', v2: '' },
    orientation: {
      horizontal: 'border-0 border-t border-minimalist-border',
      vertical: 'border-0 text-minimalist-divider text-minimalist-md leading-none',
    },
  },
  compoundVariants: [
    { orientation: 'horizontal', variant: 'v2', class: 'border-dashed' },
    { orientation: 'vertical', variant: 'v2', class: 'text-minimalist-border' },
  ],
  defaultVariants: { appearance: 'light', variant: 'v1', orientation: 'horizontal' },
});

export const navigationHintVariants = cva('hover:text-minimalist-foreground', {
  variants: {
    appearance: { light: '', dark: '' },
    // Exactly one `text-*` utility per state — never both `text-minimalist-muted` and
    // `text-minimalist-foreground` at once, since two plain utilities of equal specificity
    // don't reliably cascade by className string order.
    state: { regular: 'text-minimalist-muted', hover: 'text-minimalist-foreground' },
  },
  defaultVariants: { appearance: 'light', state: 'regular' },
});

export const stepVariants = cva('rounded-full border border-minimalist-foreground hover:opacity-70', {
  variants: {
    appearance: { light: '', dark: '' },
    state: { regular: '', hover: 'opacity-70', current: '' },
  },
  compoundVariants: [
    // Background is split by exact (appearance, state) pair — never two conflicting `bg-*`
    // utilities at once — because plain Tailwind utilities of equal specificity don't reliably
    // cascade by className string order (unlike `hover:`/`dark:` variants, which Tailwind layers
    // deterministically after base utilities).
    { appearance: 'light', state: ['regular', 'hover'], class: 'bg-minimalist-primary' },
    { appearance: 'dark', state: ['regular', 'hover'], class: 'bg-minimalist-alpha-black-100' },
    { appearance: 'light', state: 'current', class: 'bg-minimalist-foreground' },
    { appearance: 'dark', state: 'current', class: 'bg-minimalist-foreground' },
  ],
  defaultVariants: { appearance: 'light', state: 'regular' },
});

export const timelineVariants = cva(
  'minimalist-timeline flex w-fit flex-col items-center justify-center gap-4 text-minimalist-foreground',
  {
    variants: {
      appearance: { light: 'minimalist-timeline--light', dark: 'minimalist-timeline--dark' },
    },
    defaultVariants: { appearance: 'light' },
  },
);

export const timelineStepVariants = cva(
  'minimalist-timeline__step box-border block size-[14px] shrink-0 rounded-full border border-minimalist-foreground',
  {
    variants: {
      appearance: { light: 'minimalist-timeline__step--light', dark: 'minimalist-timeline__step--dark' },
      state: {
        active: 'minimalist-timeline__step--active bg-minimalist-foreground',
        inactive: 'minimalist-timeline__step--inactive bg-transparent',
      },
    },
    defaultVariants: { appearance: 'light', state: 'inactive' },
  },
);

export const sectionSwitchVariants = cva('', {
  variants: {
    appearance: { light: '', dark: '' },
    active: {
      true: 'text-minimalist-foreground font-minimalist-regular',
      false: 'text-minimalist-muted',
    },
  },
  defaultVariants: { appearance: 'light', active: false },
});

export const cardVariants = cva('relative bg-transparent p-[22px]', {
  variants: {
    // Neither varies the look — `MinimalistCard` is never called with a non-default
    // `appearance`/`state` combination that changes color today; kept for API shape.
    appearance: { light: '', dark: '' },
    state: { regular: '', hover: '', focus: '' },
  },
  defaultVariants: { appearance: 'light', state: 'regular' },
});

export type ToggleVariantProps = VariantProps<typeof toggleVariants>;
export type PaginationVariantProps = VariantProps<typeof paginationVariants>;
export type DividerVariantProps = VariantProps<typeof dividerVariants>;
export type NavigationHintVariantProps = VariantProps<typeof navigationHintVariants>;
export type StepVariantProps = VariantProps<typeof stepVariants>;
export type TimelineVariantProps = VariantProps<typeof timelineVariants>;
export type TimelineStepVariantProps = VariantProps<typeof timelineStepVariants>;
export type SectionSwitchVariantProps = VariantProps<typeof sectionSwitchVariants>;
export type CardVariantProps = VariantProps<typeof cardVariants>;
