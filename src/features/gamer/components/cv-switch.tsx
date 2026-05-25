'use client';

import { cva } from 'class-variance-authority';
import { motion } from 'framer-motion';

interface CvSwitchBaseProps {
  checked: boolean;
  id?: string;
  /** Indica que o item pai está com foco de teclado — acende visualmente o track */
  focused?: boolean;
}

interface CvSwitchInteractiveProps extends CvSwitchBaseProps {
  asDisplay?: false;
  onCheckedChange: (checked: boolean) => void;
  'aria-label'?: string;
}

interface CvSwitchDisplayProps extends CvSwitchBaseProps {
  asDisplay: true;
  onCheckedChange?: never;
  'aria-label'?: never;
}

type CvSwitchProps = CvSwitchInteractiveProps | CvSwitchDisplayProps;

const trackVariant = cva(
  'relative w-7 h-4 border flex-shrink-0 transition-[border-color,background-color,box-shadow] duration-200',
  {
    variants: {
      checked: {
        true: 'border-cv-cyan bg-[rgba(43,214,255,0.12)] shadow-[0_0_8px_rgba(43,214,255,0.25)]',
        false: 'border-cv-border bg-transparent',
      },
      focused: {
        true: 'border-cv-cyan shadow-[0_0_10px_rgba(43,214,255,0.5)]',
        false: '',
      },
    },
  },
);

const knobVariant = cva('absolute top-[3px] w-[8px] h-[8px] block', {
  variants: {
    checked: {
      true: 'bg-cv-cyan shadow-[0_0_6px_#2bd6ff]',
      false: 'bg-cv-text-muted',
    },
  },
});

function Knob({ checked }: { checked: boolean }) {
  return (
    <motion.span
      className={knobVariant({ checked })}
      animate={{ left: checked ? '13px' : '3px' }}
      transition={{ type: 'tween', duration: 0.18, ease: 'easeInOut' }}
    />
  );
}

export function CvSwitch(props: CvSwitchProps) {
  const { checked, id, asDisplay, focused } = props;

  if (asDisplay) {
    return (
      <span className={trackVariant({ checked, focused })} aria-hidden="true">
        <Knob checked={checked} />
      </span>
    );
  }

  const { onCheckedChange, 'aria-label': ariaLabel } = props as CvSwitchInteractiveProps;

  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onCheckedChange(!checked)}
      className={[
        trackVariant({ checked }),
        'cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cv-cyan',
        !checked && 'hover:border-cv-cyan-dim',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Knob checked={checked} />
    </button>
  );
}
