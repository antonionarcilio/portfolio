'use client';

import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { cloneElement } from 'react';

import { type TooltipPanelProps, TooltipBase } from '@/shared/tooltip-base';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Side = TooltipPanelProps['side'];

type TooltipProps = {
  children: React.ReactElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>;
  placement?: Side;
  className?: string;
} & (
  | { content: React.ReactNode; title?: never; description?: never }
  | { content?: never; title: string; description?: string }
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const arrowVariant = cva(
  'absolute w-[6px] h-[6px] rotate-45 bg-[rgba(43,214,255,0.06)] backdrop-blur-[18px] border-cv-cyan-dim',
  {
    variants: {
      side: {
        top: 'bottom-[-4px] border-t border-l',
        bottom: 'top-[-4px] border-b border-r',
        left: 'right-[-4px] border-l border-b',
        right: 'left-[-4px] border-r border-t',
      },
    },
  },
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

  return (
    <TooltipBase
      placement={placement}
      trigger={({ ref, triggerProps }) =>
        cloneElement(children, {
          ref: ref as unknown as React.Ref<HTMLElement>,
          ...triggerProps,
        })
      }
    >
      {({
        floatingRef,
        floatingStyles,
        transitionStyles,
        isMounted,
        floatingProps,
        arrowRef,
        arrowX,
        arrowY,
        side,
      }) => (
        <div
          ref={floatingRef}
          style={{
            ...floatingStyles,
            ...(isMounted ? transitionStyles : { opacity: 0, pointerEvents: 'none', visibility: 'hidden' }),
          }}
          {...floatingProps}
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
            className={arrowVariant({ side })}
          />
        </div>
      )}
    </TooltipBase>
  );
}
