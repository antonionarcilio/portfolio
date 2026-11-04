'use client';

import { useTranslations } from 'next-intl';
import Image, { type StaticImageData } from 'next/image';
import { useCallback, useRef, useState, type CSSProperties } from 'react';

import acaiSticker from '@/_assets/stickers/acai.png';
import bumbaMeuBoiSticker from '@/_assets/stickers/bumba-meu-boi.png';
import casoroesSticker from '@/_assets/stickers/casaroes.png';
import janelaSticker from '@/_assets/stickers/janela.png';
import palacioSticker from '@/_assets/stickers/palacio-dos-leoes.png';
import pescadoresSticker from '@/_assets/stickers/pescadores.png';
import { ScrambleText } from '@/shared/components/scramble-text';

/** Cursor distance (px) at which a sticker starts to appear (at the 986px design width). */
const REVEAL_RADIUS = 130;
/** Cursor distance (px) at which the buzz animation kicks in (at the 986px design width). */
const BUZZ_RADIUS = 50;
/** Hero width of the Figma canvas; narrower heroes scale stickers and radii down proportionally. */
const DESIGN_WIDTH = 986;
/** Ajuste fino: em heroes estreitos os stickers ficam 5% maiores que a proporção exata (nunca passam do tamanho do Figma). */
const NARROW_SCALE_BOOST = 1.05;

/** Abaixo deste viewport (px) os stickers escalam com o hero; a partir dele ficam no tamanho do Figma. */
const DESKTOP_MIN_WIDTH = 1020;
/** No desktop os stickers ficam 20px menores que o tamanho do Figma; o mobile segue a escala do Figma. */
const DESKTOP_SIZE_REDUCTION_PIXELS = 20;

/** Variáveis lidas por `.about-sticker` (styles.css): tamanho do Figma e tamanho fluido (container query units). */
function stickerSizeVariables(size: number): CSSProperties {
  const fluid = ((size / DESIGN_WIDTH) * 100 * NARROW_SCALE_BOOST).toFixed(3);
  return {
    '--sticker-size': `${size - DESKTOP_SIZE_REDUCTION_PIXELS}px`,
    '--sticker-mobile-max-size': `${size}px`,
    '--sticker-fluid-size': `${fluid}cqw`,
  } as CSSProperties;
}

type StickerDef = {
  id: string;
  src: StaticImageData;
  /** Image size (px) — matches Figma; also the base of the mobile scale (desktop renders 20px smaller). */
  size: number;
  /** Base rotation from design (degrees) */
  rotation: number;
  /** Sticker center as % of hero width */
  cx: number;
  /** Sticker center as % of hero height */
  cy: number;
};

type StickerState = { opacity: number; buzzing: boolean };

// Positions derived from Figma easter-eggs frame inside hero (canvas: 986×600)
// cx = sticker_center_x / 986 × 100; cy = sticker_center_y / 600 × 100
const STICKERS: StickerDef[] = [
  { id: 'acai', src: acaiSticker, size: 120, rotation: -10, cx: 18.1, cy: 28.6 },
  { id: 'palacio', src: palacioSticker, size: 120, rotation: 10, cx: 83.3, cy: 26.3 },
  { id: 'janela', src: janelaSticker, size: 135, rotation: 0, cx: 49.4, cy: 9.2 },
  { id: 'bumba', src: bumbaMeuBoiSticker, size: 120, rotation: -10, cx: 49.4, cy: 86.5 },
  { id: 'casaroes', src: casoroesSticker, size: 135, rotation: 10, cx: 16.2, cy: 72.9 },
  { id: 'pescadores', src: pescadoresSticker, size: 135, rotation: -10, cx: 85.5, cy: 75.5 },
];

/** `scale` (≤ 1) shrinks both radii together with the stickers. */
function computeStickerState(dist: number, scale: number): StickerState {
  const revealRadius = REVEAL_RADIUS * scale;
  const buzzRadius = BUZZ_RADIUS * scale;
  if (dist >= revealRadius) return { opacity: 0, buzzing: false };
  if (dist < buzzRadius) return { opacity: 1, buzzing: true };
  return {
    opacity: 1 - (dist - buzzRadius) / (revealRadius - buzzRadius),
    buzzing: false,
  };
}

export function AboutHeroSection() {
  const t = useTranslations('pro.about');
  const containerRef = useRef<HTMLElement>(null);
  const centerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [states, setStates] = useState<StickerState[]>(STICKERS.map(() => ({ opacity: 0, buzzing: false })));

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - containerRect.left;
    const my = e.clientY - containerRect.top;
    const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
    const scale = isDesktop ? 1 : Math.min(1, (containerRect.width / DESIGN_WIDTH) * NARROW_SCALE_BOOST);

    setStates(
      STICKERS.map((_, i) => {
        const el = centerRefs.current[i];
        if (!el) return { opacity: 0, buzzing: false };
        const rect = el.getBoundingClientRect();
        const cx = rect.left - containerRect.left + rect.width / 2;
        const cy = rect.top - containerRect.top + rect.height / 2;
        const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
        return computeStickerState(dist, scale);
      }),
    );
  }, []);

  const handleMouseLeave = useCallback(() => {
    setStates(STICKERS.map(() => ({ opacity: 0, buzzing: false })));
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex w-full items-center justify-center overflow-hidden rounded-[32px] [container-type:inline-size] min-h-[calc(100vh-var(--header-height))]"
    >
      {/* Easter-egg stickers — hidden by default, revealed by cursor proximity */}
      {STICKERS.map((sticker, i) => {
        const { opacity, buzzing } = states[i];
        return (
          <div
            key={sticker.id}
            aria-hidden="true"
            className="absolute"
            style={{ left: `${sticker.cx}%`, top: `${sticker.cy}%` }}
          >
            {/* Centering + opacity fade (reffed for distance measurement) */}
            <div
              ref={(el) => {
                centerRefs.current[i] = el;
              }}
              style={{ transform: 'translate(-50%, -50%)', opacity, transition: 'opacity 0.3s' }}
            >
              {/* Constant base rotation from design */}
              <div style={{ transform: `rotate(${sticker.rotation}deg)` }}>
                {/* Buzz animation — drop-shadow follows PNG alpha contour */}
                <div
                  className={buzzing ? 'about-sticker-buzz' : ''}
                  style={{
                    filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.25))',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  <Image
                    src={sticker.src}
                    alt=""
                    draggable={false}
                    width={sticker.size}
                    height={sticker.size}
                    style={stickerSizeVariables(sticker.size)}
                    className="about-sticker block"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center gap-2 px-[16px] text-center">
        <h1 className="font-portfolio-title font-regular text-display-lg text-alpha-black-100 min-[1020px]:whitespace-nowrap">
          <ScrambleText>{t('heroHeading')}</ScrambleText>
        </h1>
        <p className="font-portfolio font-regular text-md text-alpha-black-80 w-full max-w-[368px]">
          <ScrambleText>{t('heroGreeting')}</ScrambleText>
          <ScrambleText>{t('heroTagline')}</ScrambleText>
        </p>
      </div>
    </section>
  );
}
