'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
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

/**
 * Mesma arte de public/portfolios/minimalist/placeholder-gallery.svg, como data URI: um <img
 * src="...svg"> por URL ainda depende de uma requisição de rede (por menor que seja) e pisca em
 * branco até ela responder — data URI já nasce pintado no mesmo paint do resto do painel.
 */
const CAROUSEL_PLACEHOLDER_SRC = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
    '<rect width="1920" height="1080" fill="#e6e7e8"/>' +
    '<path d="M920.301 492.925C931.04 492.925 939.746 484.211 939.746 473.462C939.746 462.714 931.04 454 920.301 454C909.563 454 900.857 462.714 900.857 473.462C900.857 484.211 909.563 492.925 920.301 492.925Z" fill="#939598"/>' +
    '<path d="M828.638 617.551C825.845 621.527 828.689 627 833.548 627H1087.82C1092.39 627 1095.28 622.093 1093.07 618.094L1009.26 466.713C1006.98 462.591 1001.05 462.587 998.767 466.708L949.236 555.946C947.092 559.81 941.647 560.108 939.094 556.501L910.094 515.546C907.698 512.161 902.672 512.171 900.288 515.564L828.638 617.551Z" fill="#939598"/>' +
    '</svg>',
)}`;

/**
 * Pré-carrega `src` fora da <img> visível e só troca pro real quando ele estiver pronto. Até lá
 * a <img> exibe o placeholder — mesmo elemento, mesmo fluxo normal do layout original, sem
 * wrapper nem posicionamento extra; só a origem do bitmap muda enquanto a imagem do CMS carrega.
 */
function useCarouselImageSrc(src: string) {
  const [resolvedSrc, setResolvedSrc] = useState(CAROUSEL_PLACEHOLDER_SRC);

  useEffect(() => {
    setResolvedSrc(CAROUSEL_PLACEHOLDER_SRC);
    const preloadImage = new window.Image();
    preloadImage.src = src;
    preloadImage.onload = () => setResolvedSrc(src);
    return () => {
      preloadImage.onload = null;
    };
  }, [src]);

  return resolvedSrc;
}

function CarouselSlideImage({ src, alt }: { src: string; alt: string }) {
  const resolvedSrc = useCarouselImageSrc(src);
  return (
    // CMS art, não é LCP (vive dentro do painel expandido) — <img> evita o allowlist de
    // domínios remotos e o bloqueio de SVG do next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={resolvedSrc} alt={alt} decoding="async" draggable={false} />
  );
}

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
              <CarouselSlideImage src={src} alt={t('carrouselSlideAlt', { project: projectName, index: index + 1 })} />
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
