'use client';

import {
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export type TooltipTriggerProps = {
  ref: React.RefCallback<Element>;
  /** Retorna as props de interação mescladas com as do trigger — handlers coincidentes (e.g. onKeyDown) são compostos pelo floating-ui, não sobrescritos. */
  getTriggerProps: (userProps?: React.HTMLAttributes<HTMLElement>) => React.HTMLAttributes<HTMLElement>;
};

export type TooltipPanelProps = {
  floatingRef: (node: HTMLElement | null) => void;
  floatingStyles: React.CSSProperties;
  transitionStyles: React.CSSProperties;
  isMounted: boolean;
  floatingProps: React.HTMLAttributes<HTMLElement>;
  arrowRef: React.RefObject<HTMLDivElement>;
  arrowX: number | undefined;
  arrowY: number | undefined;
  side: TooltipSide;
};

type TooltipBaseProps = {
  /** Render the trigger element; receives ref and interaction props to spread */
  trigger: (props: TooltipTriggerProps) => React.ReactNode;
  /** Render the floating panel; receives positioning, transition, and arrow props */
  children: (props: TooltipPanelProps) => React.ReactNode;
  placement?: TooltipSide;
  offsetPx?: number;
  /** Animation duration in ms */
  transitionDuration?: number;
  transitionInitial?: React.CSSProperties;
  transitionOpen?: React.CSSProperties;
};

// ---------------------------------------------------------------------------
// Base component — handles open/close, positioning, arrow, collision, transitions
// ---------------------------------------------------------------------------

export function TooltipBase({
  trigger,
  children,
  placement = 'top',
  offsetPx = 10,
  transitionDuration = 150,
  transitionInitial = { opacity: 0, transform: 'scale(0.92)' },
  transitionOpen = { opacity: 1, transform: 'scale(1)' },
}: TooltipBaseProps) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles, context, middlewareData, update } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    strategy: 'fixed',
    transform: false,
    middleware: [offset(offsetPx), flip(), shift({ padding: 6 }), arrow({ element: arrowRef })],
  });

  // Drive autoUpdate manually so both refs exist before calling
  useEffect(() => {
    if (!open) return;
    const reference = refs.reference.current;
    const floating = refs.floating.current;
    if (!reference || !floating) return;
    return autoUpdate(reference, floating, update, { animationFrame: true });
  }, [open, refs.reference, refs.floating, update]);

  const hoverInteraction = useHover(context, { move: false });
  const focusInteraction = useFocus(context);
  const dismissInteraction = useDismiss(context);
  const roleInteraction = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hoverInteraction,
    focusInteraction,
    dismissInteraction,
    roleInteraction,
  ]);

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: transitionDuration,
    initial: transitionInitial,
    open: transitionOpen,
  });

  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;
  const side = context.placement.split('-')[0] as TooltipSide;

  return (
    <>
      {trigger({
        ref: refs.setReference as unknown as React.RefCallback<Element>,
        getTriggerProps: (userProps) => getReferenceProps(userProps) as React.HTMLAttributes<HTMLElement>,
      })}

      <FloatingPortal>
        {children({
          floatingRef: refs.setFloating as (node: HTMLElement | null) => void,
          floatingStyles,
          transitionStyles,
          isMounted,
          floatingProps: getFloatingProps() as React.HTMLAttributes<HTMLElement>,
          arrowRef: arrowRef as React.RefObject<HTMLDivElement>,
          arrowX,
          arrowY,
          side,
        })}
      </FloatingPortal>
    </>
  );
}
