import type { ReactNode } from 'react';

export type MinimalistAppearance = 'light' | 'dark';
export type MinimalistInteractionState = 'regular' | 'hover' | 'focus';
export type MinimalistToggleState = 'on' | 'off';
export type MinimalistStepState = 'regular' | 'hover' | 'current';
export type MinimalistCardState = 'regular' | 'hover' | 'focus';

export type MinimalistCardProps = {
  title: string;
  eyebrow: string;
  children: ReactNode;
  footer: ReactNode;
  href?: string;
  linkLabel?: string;
  collapseLabel?: string;
};
