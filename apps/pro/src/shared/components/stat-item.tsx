'use client';
import { ScrambleText } from '@/shared/components/scramble-text';
import { useEffect, useRef, useState } from 'react';

type StatItemProps = {
  /** Target integer to count up to */
  count: number;
  /** Locale-specific suffix displayed right after the number, e.g. " anos" or " +" */
  suffix: string;
  /** Short descriptor label below the number */
  label: string;
  /** Animation duration in ms */
  duration?: number;
};

/**
 * Displays a numeric stat that counts up from 0 to `count` once it enters the viewport.
 * Uses IntersectionObserver so the animation fires only when visible, and only once.
 * @example <StatItem count={13} suffix=" +" label="Projetos" />
 */
export function StatItem({ count, suffix, label, duration = 1400 }: StatItemProps) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const startTime = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          // ease-out cubic for a natural deceleration feel
          const eased = 1 - Math.pow(1 - progress, 3);
          setCurrent(Math.round(eased * count));
          if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [count, duration]);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center">
      <div className="flex items-center gap-[4px]">
        <span className="text-display-md font-regular font-portfolio-title text-alpha-black-100">{current}</span>
        <span className="text-display-md font-regular font-portfolio-title text-alpha-black-100">{suffix}</span>
      </div>
      <span className="text-sm font-regular font-portfolio text-alpha-black-80">
        <ScrambleText>{label}</ScrambleText>
      </span>
    </div>
  );
}
