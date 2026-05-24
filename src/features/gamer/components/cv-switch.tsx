'use client';

import { motion } from 'framer-motion';

interface CvSwitchBaseProps {
  checked: boolean;
  id?: string;
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

const trackCls = (checked: boolean) =>
  [
    'relative w-7 h-4 border flex-shrink-0 transition-[border-color,background-color,box-shadow] duration-200',
    checked
      ? 'border-cv-cyan bg-[rgba(43,214,255,0.12)] shadow-[0_0_8px_rgba(43,214,255,0.25)]'
      : 'border-cv-border bg-transparent',
  ].join(' ');

const knobCls = (checked: boolean) =>
  [
    'absolute top-[3px] w-[8px] h-[8px] block',
    checked ? 'bg-cv-cyan shadow-[0_0_6px_#2bd6ff]' : 'bg-cv-text-muted',
  ].join(' ');

function Knob({ checked }: { checked: boolean }) {
  return (
    <motion.span
      className={knobCls(checked)}
      animate={{ left: checked ? '13px' : '3px' }}
      transition={{ type: 'tween', duration: 0.18, ease: 'easeInOut' }}
    />
  );
}

export function CvSwitch(props: CvSwitchProps) {
  const { checked, id, asDisplay } = props;

  if (asDisplay) {
    return (
      <span className={trackCls(checked)} aria-hidden="true">
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
        trackCls(checked),
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
