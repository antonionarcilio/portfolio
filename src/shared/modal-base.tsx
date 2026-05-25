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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ModalPanelProps = {
  floatingRef: (node: HTMLElement | null) => void;
  floatingProps: React.HTMLAttributes<HTMLElement>;
  panelStyles: React.CSSProperties;
};

type ModalBaseProps = {
  open: boolean;
  onClose: () => void;
  /** Render the panel; receives ref, interaction props, and transition styles */
  children: (props: ModalPanelProps) => React.ReactNode;
  /** Portal root element id — render into a specific DOM node instead of document.body */
  portalId?: string;
  transitionDuration?: number;
  transitionInitial?: React.CSSProperties;
  transitionOpen?: React.CSSProperties;
};

// ---------------------------------------------------------------------------
// Base component — handles portal, overlay, focus trap, dismiss, transitions
// ---------------------------------------------------------------------------

export function ModalBase({
  open,
  onClose,
  children,
  portalId,
  transitionDuration = 220,
  transitionInitial = { opacity: 0, transform: 'scale(0.97) translateY(10px)' },
  transitionOpen = { opacity: 1, transform: 'scale(1) translateY(0px)' },
}: ModalBaseProps) {
  const { refs, context } = useFloating({
    open,
    onOpenChange: (v) => {
      if (!v) onClose();
    },
  });

  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' });
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

  if (!isMounted) return null;

  return (
    <FloatingPortal id={portalId}>
      <FloatingOverlay
        lockScroll
        style={overlayStyles}
        className="fixed inset-0 bg-[rgba(3,6,15,0.78)] backdrop-blur-[4px] flex items-center justify-center p-6 z-[300]"
      >
        <FloatingFocusManager context={context} modal>
          {
            children({
              floatingRef: refs.setFloating as (node: HTMLElement | null) => void,
              floatingProps: getFloatingProps() as React.HTMLAttributes<HTMLElement>,
              panelStyles,
            }) as React.ReactElement
          }
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}
