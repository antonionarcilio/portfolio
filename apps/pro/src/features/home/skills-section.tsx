'use client';

import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

// Logos normalized to height=20px; widths proportionally scaled from SVG naturals
const ROW_1 = [
  { name: 'JavaScript', file: 'javascript', width: 83, height: 20 },
  { name: 'TypeScript', file: 'typescript', width: 76, height: 20 },
  { name: 'React', file: 'react', width: 66, height: 20 },
  { name: 'Next.js', file: 'next', width: 99, height: 20 },
  { name: 'Svelte', file: 'svelte', width: 80, height: 20 },
  { name: 'OpenCode', file: 'opencode', width: 111, height: 20 },
  { name: 'Claude Code', file: 'claudecode', width: 76, height: 20 },
  { name: 'Codex', file: 'codex', width: 81, height: 20 },
] as const;

const ROW_2 = [
  { name: 'Tailwind CSS', file: 'tailwindcss', width: 162, height: 20 },
  { name: 'Motion', file: 'motion', width: 124, height: 20 },
  { name: 'Node.js', file: 'nodejs', width: 71, height: 20 },
  { name: 'Figma', file: 'figma', width: 56, height: 20 },
  { name: 'Docker', file: 'docker', width: 78, height: 20 },
  { name: 'WordPress', file: 'wordpress', width: 98, height: 20 },
] as const;

// marginRight (not flex gap) so that 50% of duplicated track = exactly one copy width
const LOGO_GAP = 52;
const MARQUEE_DURATION = 28; // seconds per full cycle

type LogoItem = { name: string; file: string; width: number; height: number };

function MarqueeRow({ items, reverse = false }: { items: readonly LogoItem[]; reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  // Refs so rAF callback captures stable values without stale closure issues
  const copyWidthRef = useRef(0);
  const speedRef = useRef(0);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // copyWidth = half the duplicated track; speed derived from desired duration
    copyWidthRef.current = track.scrollWidth / 2;
    speedRef.current = copyWidthRef.current / MARQUEE_DURATION;
    // Reverse row starts offset so the two rows begin visually in sync
    if (reverse) x.set(-copyWidthRef.current);
  }, [reverse, x]);

  // useAnimationFrame: continuous rAF loop — no keyframe reset, no snap-back glitch
  useAnimationFrame((_, delta) => {
    if (isPausedRef.current) return;
    const copyWidth = copyWidthRef.current;
    const speed = speedRef.current;
    if (!copyWidth) return;

    const direction = reverse ? 1 : -1;
    const next = x.get() + direction * speed * (delta / 1000);

    // Wrap around seamlessly: -copyWidth and 0 are visually identical
    if (!reverse && next < -copyWidth) {
      x.set(next + copyWidth);
    } else if (reverse && next > 0) {
      x.set(next - copyWidth);
    } else {
      x.set(next);
    }
  });

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => {
        isPausedRef.current = true;
      }}
      onMouseLeave={() => {
        isPausedRef.current = false;
      }}
    >
      {/* Edge overlays for smooth fade-out at both sides — cor segue o tema ativo (styles.css) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 skills-marquee-fade skills-marquee-fade--left" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 skills-marquee-fade skills-marquee-fade--right" />
      <motion.div ref={trackRef} className="flex items-center" style={{ width: 'max-content', x }}>
        {[...items, ...items].map(({ name, file, width, height }, index) => (
          <div key={`${file}-${index}`} style={{ marginRight: LOGO_GAP }}>
            <Image
              src={`/logos/${file}.svg`}
              alt={name}
              title={name}
              width={width}
              height={height}
              className="shrink-0 opacity-80"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function SkillsSection() {
  const t = useTranslations('pro.home');

  return (
    <section className="w-full overflow-hidden py-5">
      <p className="mb-4 text-center text-sm font-portfolio text-alpha-black-60">{t('skillsLabel')}</p>
      <MarqueeRow items={ROW_1} />
      <div className="mt-6">
        <MarqueeRow items={ROW_2} reverse />
      </div>
    </section>
  );
}
