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
import { Drawer } from 'vaul';

import type { Placement } from '@floating-ui/react';

import { useIsMobile } from '../hooks/use-is-mobile';

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
  /** True when rendered inside a vaul bottom-sheet on mobile. */
  isDrawer: boolean;
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
  /** ID of the DOM element to use as FloatingPortal root */
  portalId?: string;
  /** Accessible label for the drawer panel on mobile (used as aria-label on Drawer.Content). Caller must provide an already-localized string — this component has no i18n access. */
  drawerLabel: string;
  /** Extra classes for the drawer overlay (background, blur, z-index, cursor, etc.) */
  drawerOverlayClassName?: string;
  /** Extra classes for the drawer content panel (background, border, cursor, z-index, etc.) */
  drawerContentClassName?: string;
  /** Classes for the drag handle bar (background color) */
  drawerHandleClassName?: string;
  /** Skip all open/close transitions (a11y: reduce motion) */
  noMotion?: boolean;
};

const NOOP_REF: (node: HTMLElement | null) => void = () => {};

// ---------------------------------------------------------------------------
// Base component — handles open/close, positioning, collision, keyboard nav.
// On viewports < sm (640 px) renders a vaul bottom-sheet instead of a floating panel.
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
  portalId,
  drawerLabel,
  drawerOverlayClassName,
  drawerContentClassName,
  drawerHandleClassName = 'bg-white/20',
  noMotion = false,
}: DropdownBaseProps) {
  const duration = noMotion ? 0 : transitionDuration;
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>(Array(itemCount).fill(null));

  // useFloating is called unconditionally; skip autoUpdate and middleware on mobile
  // to avoid unnecessary DOM measurements when the panel is never positioned.
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    strategy: 'fixed',
    transform: false,
    middleware: isMobile ? [] : [offset(offsetPx), flip(), shift({ padding: 8 })],
    whileElementsMounted: isMobile ? undefined : autoUpdate,
  });

  const clickInteraction = useClick(context);
  // Disable dismiss in drawer mode: useDismiss registers a document mousedown listener
  // that fires setOpen(false) for any click "outside" the floating element.
  // With NOOP_REF there is no floating element, so every click inside the drawer would close it.
  const dismissInteraction = useDismiss(context, { enabled: !isMobile });
  const roleInteraction = useRole(context, { role });
  const listNavInteraction = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
    focusItemOnOpen: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    clickInteraction,
    dismissInteraction,
    roleInteraction,
    listNavInteraction,
  ]);

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration,
    initial: transitionInitial,
    open: transitionOpen,
  });

  const triggerNode = trigger({
    open,
    ref: refs.setReference as unknown as React.RefCallback<Element>,
    triggerProps: getReferenceProps() as React.HTMLAttributes<HTMLElement>,
  });

  const sharedPanelProps: DropdownPanelProps = {
    floatingRef: NOOP_REF,
    floatingStyles: {},
    transitionStyles: {},
    floatingProps: {},
    getItemProps: getItemProps as (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>,
    activeIndex,
    listRef,
    isDrawer: true,
  };

  // ── Mobile: vaul bottom-sheet ────────────────────────────────────────────
  if (isMobile) {
    // Render into document.body (not into portalId) so the drawer stays outside
    // .a11y-zoom-wrapper. position:fixed inside a zoomed ancestor loses viewport
    // anchoring and causes the handle to drift on scroll.
    return (
      <>
        {triggerNode}
        <Drawer.Root open={open} onOpenChange={setOpen}>
          <Drawer.Portal>
            <Drawer.Overlay
              style={noMotion ? { animationDuration: '0s', animationDelay: '0s', transitionDuration: '0s' } : undefined}
              className={`fixed inset-0 ${drawerOverlayClassName ?? ''}`}
            />
            <Drawer.Content
              style={noMotion ? { animationDuration: '0s', animationDelay: '0s', transitionDuration: '0s' } : undefined}
              className={`fixed bottom-0 left-0 right-0 flex flex-col max-h-[92dvh] outline-none ${drawerContentClassName ?? ''}`}
            >
              <Drawer.Title className="sr-only">{drawerLabel}</Drawer.Title>
              {/* Drag handle */}
              <div className="flex justify-center pt-[10px] pb-0 shrink-0" aria-hidden="true">
                <div className={`w-9 h-[3px] rounded-full ${drawerHandleClassName}`} />
              </div>
              {children(sharedPanelProps)}
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </>
    );
  }

  // ── Desktop: floating panel ──────────────────────────────────────────────
  return (
    <>
      {triggerNode}

      {isMounted && (
        <FloatingPortal id={portalId}>
          <FloatingFocusManager context={context} modal={false}>
            {
              children({
                floatingRef: refs.setFloating as (node: HTMLElement | null) => void,
                floatingStyles,
                transitionStyles,
                floatingProps: getFloatingProps() as React.HTMLAttributes<HTMLElement>,
                getItemProps: getItemProps as (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>,
                activeIndex,
                listRef,
                isDrawer: false,
              }) as React.ReactElement
            }
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
