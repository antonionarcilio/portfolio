'use client';

import { useTranslations } from 'next-intl';
import Image, { type StaticImageData } from 'next/image';
import { useCallback, useRef, useState } from 'react';

import acaiSticker from '@/_assets/stickers/acai.png';
import bumbaMeuBoiSticker from '@/_assets/stickers/bumba-meu-boi.png';
import casoroesSticker from '@/_assets/stickers/casaroes.png';
import janelaSticker from '@/_assets/stickers/janela.png';
import palacioSticker from '@/_assets/stickers/palacio-dos-leoes.png';
import pescadoresSticker from '@/_assets/stickers/pescadores.png';
import { ScrambleText } from '@/shared/components/scramble-text';

/** Cursor distance (px) at which a sticker starts to appear. */
const REVEAL_RADIUS = 130;
/** Cursor distance (px) at which the buzz animation kicks in. */
const BUZZ_RADIUS = 50;

type StickerDef = {
  id: string;
  src: StaticImageData;
  /** Image size (px) — matches Figma */
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

function computeStickerState(dist: number): StickerState {
  if (dist >= REVEAL_RADIUS) return { opacity: 0, buzzing: false };
  if (dist < BUZZ_RADIUS) return { opacity: 1, buzzing: true };
  return {
    opacity: 1 - (dist - BUZZ_RADIUS) / (REVEAL_RADIUS - BUZZ_RADIUS),
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

    setStates(
      STICKERS.map((_, i) => {
        const el = centerRefs.current[i];
        if (!el) return { opacity: 0, buzzing: false };
        const rect = el.getBoundingClientRect();
        const cx = rect.left - containerRect.left + rect.width / 2;
        const cy = rect.top - containerRect.top + rect.height / 2;
        const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
        return computeStickerState(dist);
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
      className="relative flex w-full items-center justify-center overflow-hidden rounded-[32px] min-h-[calc(100vh-var(--header-height))]"
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
                    className="block"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center gap-2 text-center">
        <h1 className="font-portfolio-title font-regular text-display-lg text-alpha-black-100 whitespace-nowrap">
          <ScrambleText>{t('heroHeading')}</ScrambleText>
        </h1>
        <p className="font-portfolio font-regular text-md text-alpha-black-80 w-[368px]">
          <ScrambleText>{t('heroGreeting')}</ScrambleText>
          <ScrambleText>{t('heroTagline')}</ScrambleText>
        </p>
      </div>
    </section>
  );
}
