'use client';

import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import { useRef, useState } from 'react';

import type { Placement } from '@floating-ui/react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DropdownTriggerProps = {
  open: boolean;
  ref: React.RefCallback<Element>;
  triggerProps: React.HTMLAttributes<HTMLElement>;
};

export type DropdownPanelProps = {
  floatingRef: (node: HTMLElement | null) => void;
  floatingStyles: React.CSSProperties;
  transitionStyles: React.CSSProperties;
  floatingProps: React.HTMLAttributes<HTMLElement>;
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
  activeIndex: number | null;
  listRef: React.MutableRefObject<Array<HTMLElement | null>>;
};

type DropdownBaseProps = {
  /** Item count — required for keyboard list navigation */
  itemCount: number;
  /** Render the trigger button; receives open state, ref, and props to spread */
  trigger: (props: DropdownTriggerProps) => React.ReactNode;
  /** Render the floating panel; receives positioning, transition, and interaction props */
  children: (props: DropdownPanelProps) => React.ReactNode;
  placement?: Placement;
  offsetPx?: number;
  role?: 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  /** Animation duration in ms */
  transitionDuration?: number;
  transitionInitial?: React.CSSProperties;
  transitionOpen?: React.CSSProperties;
};

// ---------------------------------------------------------------------------
// Base component — handles open/close, positioning, collision, keyboard nav
// ---------------------------------------------------------------------------

export function DropdownBase({
  itemCount,
  trigger,
  children,
  placement = 'bottom-start',
  offsetPx = 8,
  role = 'menu',
  transitionDuration = 180,
  transitionInitial = { opacity: 0, transform: 'translateY(6px)' },
  transitionOpen = { opacity: 1, transform: 'translateY(0px)' },
}: DropdownBaseProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>(Array(itemCount).fill(null));

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    strategy: 'fixed',
    transform: false,
    middleware: [offset(offsetPx), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const clickInteraction = useClick(context);
  const dismissInteraction = useDismiss(context);
  const roleInteraction = useRole(context, { role });
  const listNavInteraction = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    clickInteraction,
    dismissInteraction,
    roleInteraction,
    listNavInteraction,
  ]);

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: transitionDuration,
    initial: transitionInitial,
    open: transitionOpen,
  });

  return (
    <>
      {trigger({
        open,
        ref: refs.setReference as unknown as React.RefCallback<Element>,
        triggerProps: getReferenceProps() as React.HTMLAttributes<HTMLElement>,
      })}

      {isMounted && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            {children({
              floatingRef: refs.setFloating as (node: HTMLElement | null) => void,
              floatingStyles,
              transitionStyles,
              floatingProps: getFloatingProps() as React.HTMLAttributes<HTMLElement>,
              getItemProps: getItemProps as (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>,
              activeIndex,
              listRef,
            }) as React.ReactElement}
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
