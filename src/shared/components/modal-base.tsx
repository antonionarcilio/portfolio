'use client';

import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import { Drawer } from 'vaul';

import { useIsMobile } from '../hooks/use-is-mobile';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ModalPanelProps = {
  floatingRef: (node: HTMLElement | null) => void;
  floatingProps: React.HTMLAttributes<HTMLElement>;
  panelStyles: React.CSSProperties;
  /** True when rendered inside a vaul bottom-sheet on mobile. */
  isDrawer: boolean;
};

type ModalBaseProps = {
  open: boolean;
  onClose: () => void;
  /** Render the panel; receives ref, interaction props, transition styles and isDrawer flag */
  children: (props: ModalPanelProps) => React.ReactNode;
  /** Portal root element id — render into a specific DOM node instead of document.body */
  portalId?: string;
  transitionDuration?: number;
  transitionInitial?: React.CSSProperties;
  transitionOpen?: React.CSSProperties;
  /** Accessible title for the drawer panel on mobile (required by Radix/vaul for screen readers) */
  drawerTitle?: string;
};

const NOOP_REF: (node: HTMLElement | null) => void = () => {};

// ---------------------------------------------------------------------------
// Base component — handles portal, overlay, focus trap, dismiss, transitions.
// On viewports < sm (640 px) renders a vaul bottom-sheet instead of a modal.
// ---------------------------------------------------------------------------

export function ModalBase({
  open,
  onClose,
  children,
  portalId,
  transitionDuration = 220,
  transitionInitial = { opacity: 0, transform: 'scale(0.97) translateY(10px)' },
  transitionOpen = { opacity: 1, transform: 'scale(1) translateY(0px)' },
  drawerTitle = 'Detalhes',
}: ModalBaseProps) {
  const isMobile = useIsMobile();

  // Floating UI hooks — called unconditionally (rules of hooks).
  const { refs, context } = useFloating({
    open,
    onOpenChange: (v) => {
      if (!v) onClose();
    },
  });

  // Disable dismiss in drawer mode: useDismiss registers a document mousedown listener
  // that fires onOpenChange(false) for any click "outside" the floating element.
  // With NOOP_REF there is no floating element, so every click inside the drawer would close it.
  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown', enabled: !isMobile });
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  const { isMounted, styles: overlayStyles } = useTransitionStyles(context, {
    duration: transitionDuration,
    initial: { opacity: 0 },
    open: { opacity: 1 },
  });

  const { styles: panelStyles } = useTransitionStyles(context, {
    duration: transitionDuration,
    initial: transitionInitial,
    open: transitionOpen,
  });

  // ── Mobile: vaul bottom-sheet ────────────────────────────────────────────
  if (isMobile) {
    // Render into document.body (not into portalId) so the drawer stays outside
    // .a11y-zoom-wrapper. position:fixed inside a zoomed ancestor loses viewport
    // anchoring and causes the handle to drift on scroll.
    // All CSS custom properties (palette, fonts) are on :root/html and cascade fine.
    return (
      <Drawer.Root open={open} onOpenChange={(v) => !v && onClose()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-[rgba(3,6,15,0.78)] backdrop-blur-[4px] z-[300] cursor-gamer-pointer" />
          <Drawer.Content
            aria-describedby={undefined}
            className="fixed bottom-0 left-0 right-0 z-[300] bg-cv-panel border-t border-cv-cyan outline-none cursor-gamer-default flex flex-col max-h-[92dvh] font-cv-mono"
          >
            <Drawer.Title className="sr-only">{drawerTitle}</Drawer.Title>
            {/* Drag handle */}
            <div className="flex justify-center pt-[10px] pb-0 shrink-0" aria-hidden="true">
              <div className="w-9 h-[3px] rounded-full bg-cv-cyan/30" />
            </div>
            {children({ floatingRef: NOOP_REF, floatingProps: {}, panelStyles: {}, isDrawer: true })}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  // ── Desktop: floating modal ──────────────────────────────────────────────
  if (!isMounted) return null;

  return (
    <FloatingPortal id={portalId}>
      <FloatingOverlay
        lockScroll
        style={overlayStyles}
        className="fixed inset-0 bg-[rgba(3,6,15,0.78)] backdrop-blur-[4px] flex items-center justify-center p-6 z-[300] cursor-gamer-pointer"
      >
        <FloatingFocusManager context={context} modal>
          {
            children({
              floatingRef: refs.setFloating as (node: HTMLElement | null) => void,
              floatingProps: getFloatingProps() as React.HTMLAttributes<HTMLElement>,
              panelStyles,
              isDrawer: false,
            }) as React.ReactElement
          }
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}
