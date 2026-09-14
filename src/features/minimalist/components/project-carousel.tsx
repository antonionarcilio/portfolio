'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

import { IconInteractionProvider, useIconInteractionHandlers } from '../contexts/icon-interaction-context';
import { useMinimalistReducedMotion } from '../contexts/reduced-motion-context';
import type { MinimalistAppearance } from '../types';
import { AnimatedIcon } from './animated-icon';

type ProjectCarouselProps = {
  images: string[];
  projectName: string;
  appearance: MinimalistAppearance;
};

function CarouselArrow({
  appearance,
  direction,
  label,
  onClick,
}: {
  appearance: MinimalistAppearance;
  direction: 'previous' | 'next';
  label: string;
  onClick: () => void;
}) {
  const { state, handlers } = useIconInteractionHandlers({ disabled: false });
  return (
    <button
      type="button"
      className={clsx(
        'pointer-events-auto inline-flex cursor-pointer items-center justify-center rounded-full border-0 p-1 text-minimalist-foreground shadow-[0_4px_6px_rgba(0,0,0,0.05)]',
        appearance === 'light' ? 'bg-minimalist-alpha-white-100' : 'bg-[rgb(255_255_255/14%)]',
      )}
      aria-label={label}
      onClick={onClick}
      {...handlers}
    >
      <IconInteractionProvider value={state}>
        <AnimatedIcon icon={direction === 'previous' ? 'chevron-left' : 'chevron-right'} size={12} />
      </IconInteractionProvider>
    </button>
  );
}

/** Curva de easing padrão do feature Minimalist. */
const MINIMALIST_CAROUSEL_EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)';

/**
 * O efeito "slide" do Swiper só transiciona o wrapper (posição). O realce dos vizinhos
 * (scale/opacity em styles.css) muda junto com as classes `.swiper-slide-prev/-active/-next`
 * e, sem duração, dava um "pulo". Este hook propaga a duração da navegação do Swiper para os
 * próprios slides, então o realce acompanha o deslize. `setTransition(0)` no fim reseta.
 */
function syncSlideTransitions(swiper: SwiperInstance, durationMs: number) {
  for (const slide of swiper.slides) {
    const element = slide as HTMLElement;
    element.style.transitionProperty = durationMs > 0 ? 'transform, opacity' : '';
    element.style.transitionDuration = durationMs > 0 ? `${durationMs}ms` : '';
    element.style.transitionTimingFunction = durationMs > 0 ? MINIMALIST_CAROUSEL_EASE : '';
  }
}

export function ProjectCarousel({ images, projectName, appearance }: ProjectCarouselProps) {
  const t = useTranslations('minimalist.recruiter');
  const reduceMotion = useMinimalistReducedMotion();
  const swiperRef = useRef<SwiperInstance | null>(null);
  const canCycle = images.length > 1;
  // `loop` centralizado precisa de folga de slides dos dois lados; com 3-4 imagens o Swiper
  // não consegue montar o loop e o slide "central" encosta na borda. Duplicar a lista curta
  // resolve sem o usuário perceber (as mesmas imagens repetem no ciclo).
  const slides = useMemo(() => (images.length >= 6 ? images : [...images, ...images]), [images]);

  // O painel monta depois do crossfade do AnimatePresence (mode="wait"), então o Swiper às
  // vezes inicializa antes do container ter a largura final — remede a geometria no mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      swiperRef.current?.update();
      swiperRef.current?.slideToLoop(0, 0);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    // O container-query em .minimalist__project-detail-body decide o modo do carrossel a partir
    // da largura real do painel (não do viewport): faixa com destaque + setas enquanto couber,
    // senão um slide só ocupando tudo. Ver styles.css.
    <div className="minimalist__project-carousel" data-node-name="project/carousel">
      <div className="minimalist__project-carousel-stage">
        <Swiper
          className="minimalist__project-carousel-track"
          onSwiper={(instance) => {
            swiperRef.current = instance;
          }}
          slidesPerView="auto"
          centeredSlides
          spaceBetween={0}
          speed={reduceMotion ? 0 : 420}
          loop
          onSetTransition={reduceMotion ? undefined : syncSlideTransitions}
        >
          {slides.map((src, index) => (
            <SwiperSlide key={`${src}-${index}`} className="minimalist__project-carousel-slide">
              {/* CMS/placeholder art, não é LCP (vive dentro do painel expandido) — <img> evita o
                  allowlist de domínios do next/image e o bloqueio de SVG do placeholder. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={t('carrouselSlideAlt', { project: projectName, index: index + 1 })}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {canCycle && (
          <div className="minimalist__project-carousel-controls">
            <CarouselArrow
              appearance={appearance}
              direction="previous"
              label={t('carrouselPrevious')}
              onClick={() => swiperRef.current?.slidePrev()}
            />
            <CarouselArrow
              appearance={appearance}
              direction="next"
              label={t('carrouselNext')}
              onClick={() => swiperRef.current?.slideNext()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
