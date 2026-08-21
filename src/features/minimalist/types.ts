import type { ReactNode } from 'react';

export type MinimalistAppearance = 'light' | 'dark';
export type MinimalistButtonVariant = 'primary' | 'secondary';
export type MinimalistInteractionState = 'regular' | 'hover' | 'focus';
export type MinimalistToggleState = 'on' | 'off';
export type MinimalistStepState = 'regular' | 'hover' | 'current';
export type MinimalistCardState = 'regular' | 'hover' | 'focus';

export type MinimalistCardProps = {
  meta: ReactNode;
  metaExpanded: ReactNode;
  eyebrow: string;
  children: ReactNode;
  footer: ReactNode;
  expandedContent?: ReactNode;
  expanded?: boolean;
  onExpandedChange?: () => void;
  expansionLabel?: string;
  collapseLabel?: string;
  expansionId?: string;
  href?: string;
  linkLabel?: string;
  'data-project-card'?: string;
  active?: boolean;
  dimmed?: boolean;
};
