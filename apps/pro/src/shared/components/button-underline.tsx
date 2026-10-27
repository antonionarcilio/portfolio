'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { motion, useAnimate } from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';

import arrowUpRightIcon from '@/_assets/icons/lucide-arrow-up-right.svg';
import { ScrambleText } from '@/shared/components/scramble-text';

const WAVE_PERIOD = 14;
const WAVE_HEIGHT = 4;
const WAVE_TILE_REPEATS = 20;
const WAVE_SVG_WIDTH = WAVE_PERIOD * WAVE_TILE_REPEATS;

const WAVE_ANIMATE = { x: [0, -WAVE_PERIOD] };
const WAVE_TRANSITION = { duration: 1.8, repeat: Infinity, ease: 'linear' as const };

const hoverRevealVariants = {
  initial: { opacity: 0 },
  active: { opacity: 1, transition: { duration: 0.2, ease: [0.2, 0.7, 0.2, 1] as const } },
};

function buildWavePathD(): string {
  const midY = WAVE_HEIGHT / 2;
  const halfPeriod = WAVE_PERIOD / 2;
  let d = `M0,${midY}`;
  for (let x = 0, step = 0; x < WAVE_SVG_WIDTH; x += halfPeriod, step += 1) {
    const controlX = x + halfPeriod / 2;
    const controlY = step % 2 === 0 ? 0 : WAVE_HEIGHT;
    d += ` Q${controlX},${controlY} ${x + halfPeriod},${midY}`;
  }
  return d;
}

const WAVE_PATH_D = buildWavePathD();

function WaveUnderline() {
  const [scope, animate] = useAnimate<SVGSVGElement>();

  useEffect(() => {
    if (scope.current) animate(scope.current, WAVE_ANIMATE, WAVE_TRANSITION);
  }, [animate, scope]);

  return (
    <motion.svg
      ref={scope}
      width={WAVE_SVG_WIDTH}
      height={WAVE_HEIGHT}
      viewBox={`0 0 ${WAVE_SVG_WIDTH} ${WAVE_HEIGHT}`}
      fill="none"
    >
      <path d={WAVE_PATH_D} stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" />
    </motion.svg>
  );
}

const anchorVariants = cva(
  'inline-flex items-center gap-[2px] font-regular font-portfolio text-alpha-black-100 hover:text-alpha-black-70 focus-visible:text-alpha-black-70 focus-visible:outline-none',
  {
    variants: { size: { md: 'text-sm', lg: 'text-md' } },
    defaultVariants: { size: 'md' },
  },
);

/** A seta cresce na mesma proporção do texto. */
const ARROW_PIXELS = { md: 16, lg: 18 } as const;

type ButtonUnderlineProps = VariantProps<typeof anchorVariants> & {
  label: string;
  href: string;
  external?: boolean;
  className?: string;
};

/**
 * Text link with animated wave underline on hover/focus, trailing arrow icon.
 * @example <ButtonUnderline label="LinkedIn" href="https://linkedin.com/..." external />
 */
export function ButtonUnderline({ label, href, external = false, className, size }: ButtonUnderlineProps) {
  const arrowPixels = ARROW_PIXELS[size ?? 'md'];
  return (
    <motion.a
      href={href}
      className={`${anchorVariants({ size })}${className ? ` ${className}` : ''}`}
      initial="initial"
      whileHover="active"
      whileFocus="active"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className="relative inline-block">
        <ScrambleText>{label}</ScrambleText>
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-[3px] h-1 overflow-hidden"
          variants={hoverRevealVariants}
        >
          <WaveUnderline />
        </motion.span>
      </span>
      <Image src={arrowUpRightIcon} alt="" aria-hidden width={arrowPixels} height={arrowPixels} />
    </motion.a>
  );
}
