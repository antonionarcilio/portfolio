'use client';

import {
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

type Placement = 'top' | 'bottom' | 'left' | 'right';

type TooltipProps = {
  children: React.ReactElement;
  placement?: Placement;
  className?: string;
} & (
  | { content: React.ReactNode; title?: never; description?: never }
  | { content?: never; title: string; description?: string }
);

export function Tooltip({ children, placement = 'top', className, ...props }: TooltipProps) {
  const body =
    'title' in props && props.title != null ? (
      <span className="flex flex-col gap-[3px]">
        <span>{props.title}</span>
        {props.description && (
          <span className="opacity-70 normal-case tracking-normal first-letter:uppercase">{props.description}</span>
        )}
      </span>
    ) : (
      (props as { content: React.ReactNode }).content
    );
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles, context, middlewareData, update } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    strategy: 'fixed',
    // Use left/top instead of transform:translate so transition scale doesn't override position
    transform: false,
    middleware: [offset(10), flip(), shift({ padding: 6 }), arrow({ element: arrowRef })],
  });

  // Drive autoUpdate manually so we can guarantee both refs exist before calling
  useEffect(() => {
    if (!open) return;
    const reference = refs.reference.current;
    const floating = refs.floating.current;
    if (!reference || !floating) return;
    return autoUpdate(reference, floating, update, { animationFrame: true });
  }, [open, refs.reference, refs.floating, update]);

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });
  const click = useClick(context, { toggle: false });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role, click]);

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 150,
    initial: { opacity: 0, transform: 'scale(0.92)' },
    open: { opacity: 1, transform: 'scale(1)' },
  });

  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;
  const side = context.placement.split('-')[0] as Placement;

  const arrowSideStyles: Record<Placement, string> = {
    top: 'bottom-[-4px] border-t border-l',
    bottom: 'top-[-4px] border-b border-r',
    left: 'right-[-4px] border-l border-b',
    right: 'left-[-4px] border-r border-t',
  };

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()} className="inline-flex cursor-help">
        {children}
      </span>

      <FloatingPortal>
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            ...(isMounted ? transitionStyles : { opacity: 0, pointerEvents: 'none', visibility: 'hidden' }),
          }}
          {...getFloatingProps()}
          className={clsx(
            'z-[199] text-[12px] text-cv-cyan tracking-[0.16em]',
            'border border-cv-cyan-dim px-[9px] py-[3px]',
            'bg-[rgba(43,214,255,0.06)] backdrop-blur-[18px]',
            'shadow-[0_0_14px_rgba(43,214,255,0.12)]',
            'whitespace-normal max-w-[280px] pointer-events-none',
            className,
          )}
        >
          {body}

          <div
            ref={arrowRef}
            style={{
              left: arrowX != null ? `${arrowX}px` : '',
              top: arrowY != null ? `${arrowY}px` : '',
            }}
            className={clsx(
              'absolute w-[6px] h-[6px]',
              'bg-[rgba(43,214,255,0.06)] backdrop-blur-[18px]',
              'border-cv-cyan-dim rotate-45',
              arrowSideStyles[side],
            )}
          />
        </div>
      </FloatingPortal>
    </>
  );
}
