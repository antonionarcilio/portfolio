'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

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

const LOGO_GAP = 52;

/** Velocidade do drift contínuo, em px por segundo. */
const MARQUEE_SPEED_PX_PER_SECOND = 40;

/** Repetições da lista: o Swiper trava (`isLocked`) se o conteúdo não transbordar. */
const MARQUEE_COPIES = 3;

type LogoItem = { name: string; file: string; width: number; height: number };

/**
 * Repete a lista até o total transbordar o container. O Swiper trava o loop
 * (`isLocked`) quando o conteúdo é menor que a viewport, então repetir as logos é
 * condição para o movimento existir — e cada cópia precisa ter largura idêntica
 * para o wrap não dar salto visível.
 */
function repeatToFill(items: readonly LogoItem[], copies: number): LogoItem[] {
  return Array.from({ length: copies }, () => items).flat();
}

/**
 * Move o trilho continuamente, quadro a quadro, em vez de deixar o `autoplay` do
 * Swiper animar slide a slide. O autoplay produz degraus (pausa → salto de um slide →
 * pausa), que é o "para e salta" do marquee; mover o translate direto entrega o drift
 * contínuo.
 *
 * O wrap precisa usar a largura de UMA CÓPIA (soma dos slides originais + gaps), não
 * um passo do `snapGrid` — usar um passo reposiciona apenas um slide e reaparece o salto.
 */
function measureCopyWidth(swiper: SwiperClass, originalLength: number): number {
  const slides = [...swiper.slides] as HTMLElement[];
  const widthPerCopy = slides.slice(0, originalLength).reduce((total, slide) => total + slide.offsetWidth, 0);
  const gapBetweenSlides = Number(swiper.params.spaceBetween ?? 0);
  return widthPerCopy + originalLength * gapBetweenSlides;
}

function useContinuousMarquee(
  swiperRef: React.RefObject<SwiperClass | null>,
  isPausedRef: React.RefObject<boolean>,
  originalLength: number,
  direction: 1 | -1,
) {
  useEffect(() => {
    let frameId = 0;
    let previousTimestamp = 0;

    const step = (timestamp: number) => {
      frameId = requestAnimationFrame(step);
      const swiper = swiperRef.current;
      if (!swiper || isPausedRef.current) {
        previousTimestamp = timestamp;
        return;
      }

      const copyWidth = measureCopyWidth(swiper, originalLength);
      if (!copyWidth) {
        previousTimestamp = timestamp;
        return;
      }

      const elapsedSeconds = previousTimestamp ? (timestamp - previousTimestamp) / 1000 : 0;
      const nextTranslate = swiper.getTranslate() - direction * MARQUEE_SPEED_PX_PER_SECOND * elapsedSeconds;

      // Mantém o translate dentro de uma cópia: no sentido positivo (translate
      // decrescente) rebobina ao passar de -copyWidth; no sentido negativo (translate
      // crescente) rebobina ao passar de 0. As cópias são idênticas, então o salto
      // coincide com o conteúdo da cópia vizinha e é invisível.
      // O limite de 0 vale para os dois sentidos: nunca deixar o trilho ir além do
      // começo, senão o Swiper fica sem conteúdo e a linha some.
      if (nextTranslate <= -copyWidth) {
        swiper.setTranslate(nextTranslate + copyWidth);
      } else if (nextTranslate > 0) {
        swiper.setTranslate(nextTranslate - copyWidth);
      } else {
        swiper.setTranslate(nextTranslate);
      }
      previousTimestamp = timestamp;
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [swiperRef, isPausedRef, originalLength, direction]);
}

function MarqueeRow({ items, reverse = false }: { items: readonly LogoItem[]; reverse?: boolean }) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const isPausedRef = useRef(false);
  const slides = repeatToFill(items, MARQUEE_COPIES);
  // 1 = direita para a esquerda; -1 = esquerda para a direita.
  const direction: 1 | -1 = reverse ? -1 : 1;

  useContinuousMarquee(swiperRef, isPausedRef, items.length, direction);

  return (
    <div
      className="relative overflow-hidden"
      // Pausar no hover preserva o comportamento do marquee anterior
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

      <Swiper
        className="skills-marquee"
        slidesPerView="auto"
        spaceBetween={LOGO_GAP}
        loop
        loopAdditionalSlides={items.length}
        allowTouchMove={false}
        // Carrega imagens próximas antes de entrarem na viewport. O módulo `Lazy` do
        // Swiper foi removido na v11 — hoje o lazy-load é o nativo do navegador
        // (`loading="lazy"`), e este parâmetro controla a antecipação.
        lazyPreloadPrevNext={items.length}
        // speed 0: a transição é feita pelo rAF, não pelo Swiper
        speed={0}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {slides.map(({ name, file, width, height }, index) => (
          <SwiperSlide key={`${file}-${index}`} className="!w-auto shrink-0">
            <Image
              src={`/logos/${file}.svg`}
              alt={name}
              title={name}
              width={width}
              height={height}
              // As cópias repetidas reaproveitam a mesma URL: o navegador carrega uma
              // vez e as demais saem do cache. `lazy` adia as que estão fora da tela.
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export function SkillsSection() {
  const t = useTranslations('pro.home');

  return (
    <section className="w-full overflow-hidden py-5">
      <p className="mb-[26px] text-center text-sm font-portfolio text-alpha-black-60">{t('skillsLabel')}</p>
      <MarqueeRow items={ROW_1} />
      <div className="mt-6">
        <MarqueeRow items={ROW_2} reverse />
      </div>
    </section>
  );
}
