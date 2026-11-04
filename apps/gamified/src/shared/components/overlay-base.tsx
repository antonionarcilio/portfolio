'use client';

import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react';

interface OverlayBaseProps {
  open: boolean;
  onClose: () => void;
  closeOnBackdropClick?: boolean;
  children: React.ReactNode;
}

export function OverlayBase({ open, onClose, closeOnBackdropClick = true, children }: OverlayBaseProps) {
  const { refs, context } = useFloating({
    open,
    onOpenChange: (v) => {
      if (!v) onClose();
    },
  });

  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' });
  const { getFloatingProps } = useInteractions([dismiss]);

  const { isMounted, styles: overlayStyles } = useTransitionStyles(context, {
    duration: { open: 220, close: 220 },
    initial: { opacity: 0 },
    open: { opacity: 1 },
  });

  if (!isMounted) return null;

  return (
    <FloatingPortal>
      <FloatingOverlay
        ref={refs.setFloating}
        lockScroll
        style={{ zIndex: 9999, ...overlayStyles }}
        className="flex items-center justify-center bg-black/70"
        onClick={closeOnBackdropClick ? onClose : undefined}
        {...getFloatingProps()}
      >
        <FloatingFocusManager context={context} modal>
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}
