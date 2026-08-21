import { cva, type VariantProps } from 'class-variance-authority';

export const toggleVariants = cva('minimalist-toggle', {
  variants: {
    appearance: { light: 'minimalist-toggle--light', dark: 'minimalist-toggle--dark' },
    state: { on: 'minimalist-toggle--on', off: 'minimalist-toggle--off' },
  },
  defaultVariants: { appearance: 'light', state: 'off' },
});

export const paginationVariants = cva('minimalist-pagination', {
  variants: {
    appearance: { light: 'minimalist-pagination--light', dark: 'minimalist-pagination--dark' },
    state: { regular: '', hover: 'minimalist-pagination--hover', focus: 'minimalist-pagination--focus' },
  },
  defaultVariants: { appearance: 'light', state: 'regular' },
});

export const dividerVariants = cva('minimalist-divider', {
  variants: {
    appearance: { light: 'minimalist-divider--light', dark: 'minimalist-divider--dark' },
    variant: { v1: '', v2: 'minimalist-divider--v2' },
  },
  defaultVariants: { appearance: 'light', variant: 'v1' },
});

export const navigationHintVariants = cva('minimalist-navigation-hint', {
  variants: {
    appearance: { light: 'minimalist-navigation-hint--light', dark: 'minimalist-navigation-hint--dark' },
    state: { regular: '', hover: 'minimalist-navigation-hint--hover' },
  },
  defaultVariants: { appearance: 'light', state: 'regular' },
});

export const stepVariants = cva('minimalist-step', {
  variants: {
    appearance: { light: 'minimalist-step--light', dark: 'minimalist-step--dark' },
    state: { regular: '', hover: 'minimalist-step--hover', current: 'minimalist-step--current' },
  },
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

export const sectionSwitchVariants = cva('minimalist-section-switch', {
  variants: {
    appearance: { light: 'minimalist-section-switch--light', dark: 'minimalist-section-switch--dark' },
    active: { true: 'minimalist-section-switch--active', false: 'minimalist-section-switch--inactive' },
  },
  defaultVariants: { appearance: 'light', active: false },
});

export const cardVariants = cva('minimalist-card', {
  variants: {
    appearance: { light: 'minimalist-card--light', dark: 'minimalist-card--dark' },
    state: { regular: '', hover: 'minimalist-card--hover', focus: 'minimalist-card--focus' },
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
