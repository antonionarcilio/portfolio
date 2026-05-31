'use client';

import { motion, useInView } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useA11y } from '@/features/gamer/contexts/a11y-context';
import type { PortfolioData } from '@/features/gamer/types/portfolio';
import { A11yDropdown } from './a11y-dropdown';

const swiperBoxVariants = {
  idle: { borderColor: '#1a3a52', boxShadow: '0 0 0px rgba(43,214,255,0)' },
  active: { borderColor: '#2bd6ff', boxShadow: '0 0 14px rgba(43,214,255,0.22)' },
};

function useTerminalTypewriter(
  finalText: string,
  speed = 65,
  startTyping = true,
  skip = false,
  initialText = 'USER_NAME',
  waitDelay = 3000,
) {
  const [displayed, setDisplayed] = useState(initialText);
  const [done, setDone] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (skip) {
      setDisplayed(finalText);
      setDone(true);
      setIsAnimating(false);
      completedRef.current = true;
      return;
    }
    if (!startTyping) return;
    if (completedRef.current) return;

    // Aguarda antes de começar
    const initialDelay = setTimeout(() => {
      setIsAnimating(true);
      let deleteIndex = initialText.length;

      // Fase 1: Apagar texto inicial
      const deleteInterval = setInterval(() => {
        deleteIndex--;
        setDisplayed(initialText.slice(0, deleteIndex));

        if (deleteIndex === 0) {
          clearInterval(deleteInterval);

          // Fase 2: Escrever o nome final
          let writeIndex = 0;
          const writeInterval = setInterval(() => {
            writeIndex++;
            setDisplayed(finalText.slice(0, writeIndex));

            if (writeIndex === finalText.length) {
              clearInterval(writeInterval);
              setDone(true);
              setIsAnimating(false);
              completedRef.current = true;
            }
          }, speed);
        }
      }, speed);
    }, waitDelay);

    return () => {
      clearTimeout(initialDelay);
    };
  }, [finalText, speed, startTyping, skip, initialText, waitDelay]);

  return { displayed, done, isAnimating };
}

function BlinkingCursor({ className = '', hidden = false }: { className?: string; hidden?: boolean }) {
  if (hidden) return null;
  return (
    <motion.div
      className={`inline-block bg-cv-cyan shadow-[0_0_10px_#2bd6ff] ml-[0.1em] ${className}`}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: 'linear', times: [0, 0.45, 0.5, 1] }}
      aria-hidden="true"
    />
  );
}

function RankSwiper({
  label,
  options,
  targetIndex,
  skip = false,
  startAnimation = false,
  onDone,
}: {
  label: string;
  options: string[];
  targetIndex: number;
  skip?: boolean;
  startAnimation?: boolean;
  onDone?: () => void;
}) {
  const swiperRef = useRef<SwiperType | null>(null);
  const hasStartedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [animating, setAnimating] = useState(false);
  const [userInteracting, setUserInteracting] = useState(false);
  const { opts } = useA11y();
  const noMotion = opts.reduceMotion;

  useEffect(() => {
    if (!startAnimation || hasStartedRef.current) return;
    hasStartedRef.current = true;

    if (skip || targetIndex === 0) {
      onDone?.();
      return;
    }

    setAnimating(true);
    let step = 0;
    const id = setInterval(() => {
      step++;
      swiperRef.current?.slideNext();
      if (step >= targetIndex) {
        clearInterval(id);
        // Linger no estado ativo após pousar; só libera o próximo após remover o foco
        setTimeout(() => {
          setAnimating(false);
          onDone?.();
        }, 600);
      }
    }, 520);

    return () => clearInterval(id);
  }, [startAnimation, targetIndex, skip, onDone]);

  useEffect(() => {
    if (!skip || !swiperRef.current) return;
    swiperRef.current.slideToLoop(targetIndex, 0);
    setAnimating(false);
    onDone?.();
  }, [skip, targetIndex, onDone]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleUserNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      if (animating) return;

      if (direction === 'prev') {
        swiperRef.current?.slidePrev();
      } else {
        swiperRef.current?.slideNext();
      }

      setUserInteracting(true);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        swiperRef.current?.slideToLoop(targetIndex);
        setUserInteracting(false);
      }, 3000);
    },
    [animating, targetIndex],
  );

  return (
    <div className="inline-flex items-center gap-[10px]">
      <div className="opacity-80 text-cv-text max-[648px]:w-[54px] max-[648px]:text-right max-[648px]:shrink-0">
        {label}
      </div>
      <motion.div
        className="inline-flex items-center gap-[4px] border border-cv-border bg-[rgba(43,214,255,0.04)] px-1 py-[2px] cursor-gamer-default max-[648px]:w-[135px] max-[526px]:w-[95px] cv-rank-swiper-box"
        variants={swiperBoxVariants}
        animate={(animating || userInteracting) && !noMotion ? 'active' : 'idle'}
        whileHover={noMotion ? undefined : 'active'}
        transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <button
          type="button"
          className="bg-transparent border-0 text-cv-cyan leading-none px-[5px] py-[2px] opacity-60 hover:opacity-100 hover:[text-shadow:0_0_8px_#2bd6ff] transition-all duration-150 cursor-gamer-pointer max-[526px]:hidden"
          onClick={() => handleUserNavigate('prev')}
          aria-label="anterior"
        >
          &lt;
        </button>
        <div className="w-[132px] max-[648px]:flex-1 max-[648px]:min-w-0 overflow-hidden cv-rank-swiper-inner">
          <Swiper
            onSwiper={(s) => {
              swiperRef.current = s;
            }}
            initialSlide={skip ? targetIndex : 0}
            loop
            speed={skip ? 0 : 260}
            allowTouchMove={false}
          >
            {options.map((opt, i) => (
              <SwiperSlide key={opt}>
                <div
                  className={`block text-center text-[13px] tracking-[0.14em] uppercase leading-[1.2] ${
                    i === 0 ? 'text-cv-text-dim opacity-70' : 'text-cv-cyan opacity-90'
                  }`}
                >
                  {opt}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <button
          type="button"
          className="bg-transparent border-0 text-cv-cyan leading-none px-[5px] py-[2px] opacity-60 hover:opacity-100 hover:[text-shadow:0_0_8px_#2bd6ff] transition-all duration-150 cursor-gamer-pointer max-[526px]:hidden"
          onClick={() => handleUserNavigate('next')}
          aria-label="próximo"
        >
          &gt;
        </button>
      </motion.div>
    </div>
  );
}

export function CvHeader({ data }: { data: PortfolioData }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true });
  const { opts } = useA11y();
  const noMotion = opts.reduceMotion;

  const [levelLabel, setLevelLabel] = useState('Nível 0 — Experiência');
  const [xpDisplay, setXpDisplay] = useState('0000 / 0000');
  const [lvlFill, setLvlFill] = useState(0);
  const BLOCKS = 14;
  const on = Math.round((lvlFill / 100) * BLOCKS);

  const { displayed: titleText, done: titleDone } = useTerminalTypewriter(
    'ANTÔNIO_MASCARENHAS',
    80,
    isInView,
    noMotion,
    'NOME_DO_USUARIO',
    1000,
  );

  const [rankDone, setRankDone] = useState(false);
  const handleRankDone = useCallback(() => setRankDone(true), []);

  useEffect(() => {
    setLevelLabel(data.level.label);
    setXpDisplay(data.level.sub);

    if (noMotion) {
      setLvlFill(data.level.fill);
      return;
    }

    if (!isInView) return;

    const target = data.level.fill;
    let v = 0;
    const id = setInterval(() => {
      v += 4;
      if (v >= target) {
        v = target;
        clearInterval(id);
      }
      setLvlFill(v);
    }, 40);

    return () => clearInterval(id);
  }, [isInView, noMotion, data.level.label, data.level.sub, data.level.fill]);

  return (
    <div
      ref={headerRef}
      className="relative border border-cv-cyan bg-[linear-gradient(180deg,rgba(43,214,255,0.04),rgba(43,214,255,0.01))] px-[34px] pt-[28px] pb-[26px] mb-7 shadow-cv-header cv-header-box"
    >
      <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan top-[-5px] left-[-5px] border-r-0 border-b-0" />
      <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan top-[-5px] right-[-5px] border-l-0 border-b-0" />
      <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan bottom-[-5px] left-[-5px] border-r-0 border-t-0" />
      <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan bottom-[-5px] right-[-5px] border-l-0 border-t-0" />
      <div className="flex justify-between items-start gap-[30px] flex-wrap max-[970px]:flex-col max-[970px]:items-center max-[970px]:gap-[24px] cv-header-info-row">
        <div className="flex-[1_1_420px] min-w-0 max-[970px]:text-center max-[970px]:flex-none max-[970px]:w-full cv-header-info-left">
          <div className="[font-size:clamp(16px,calc(7px_+_3vw),37.7px)] text-cv-cyan tracking-[0.18em] mt-0 mb-[14px] [text-shadow:0_0_12px_rgba(43,214,255,0.4),0_0_30px_rgba(43,214,255,0.2)] flex items-center max-[970px]:justify-center cv-header-title">
            <div aria-hidden="true">&gt;</div>
            <h1 className="inline ml-[6px]">{titleText}</h1>
            <BlinkingCursor className="w-[0.47em] h-[0.95em] align-[-0.16em] mb-[0.07em]" hidden={noMotion} />
          </div>
          <h2 className="text-cv-text-dim text-[13px] tracking-[0.14em] uppercase flex items-center gap-[14px] flex-wrap max-[970px]:justify-center cv-header-name-row m-0">
            <RankSwiper
              label="rank:"
              options={['nenhum', 'júnior', 'pleno', 'sênior']}
              targetIndex={2}
              skip={noMotion}
              startAnimation={titleDone}
              onDone={handleRankDone}
            />
            <span className="text-cv-cyan-soft cv-name-divider">|</span>
            <RankSwiper
              label="classe:"
              options={['nenhuma', 'backend', 'frontend', 'fullstack']}
              targetIndex={2}
              skip={noMotion}
              startAnimation={rankDone}
            />
          </h2>
        </div>
        <div className="text-right min-w-[240px] max-[970px]:text-center max-[970px]:min-w-0 max-[970px]:w-full mt-[10px] cv-header-info-right">
          <span className="block text-[11px] text-cv-text-dim tracking-[0.2em] uppercase opacity-70 hover:opacity-100 transition-opacity duration-200">
            {levelLabel}
          </span>
          <div className="flex gap-[3px] mt-[11px] w-full max-w-[280px] ml-auto max-[970px]:mx-auto cv-header-level-bar">
            {Array.from({ length: BLOCKS }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-[10px] block border transition-[background,box-shadow,border-color] duration-[250ms] [transition-timing-function:ease] ${
                  i < on
                    ? 'bg-cv-cyan border-cv-cyan shadow-[0_0_8px_rgba(43,214,255,0.6)]'
                    : 'bg-[rgba(43,214,255,0.08)] border-cv-border'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between w-full max-w-[280px] ml-auto max-[970px]:mx-auto mt-2 text-[12px] text-cv-cyan tracking-[0.06em]">
            <span className="opacity-70 hover:opacity-100 transition-opacity duration-200 tabular-nums">
              {lvlFill}%
            </span>
            <span className="transition-opacity duration-300">{xpDisplay}</span>
          </div>
        </div>
      </div>
      <div className="mt-[22px] pt-4 max-[970px]:pt-[24px] border-t border-dashed border-cv-border flex items-center justify-between gap-[18px] flex-wrap cv-header-bottom">
        <span className="inline-block border border-dashed border-cv-cyan px-[14px] py-[6px] text-cv-cyan text-[12px] tracking-[0.18em] uppercase bg-[rgba(43,214,255,0.06)] text-center">
          Obsessão por qualidade em cada detalhe.
        </span>
        <div className="flex items-center gap-[18px] flex-wrap cv-header-bottom-actions">
          <div
            className="inline-flex items-center gap-2 border border-cv-border px-[10px] py-1 bg-[rgba(43,214,255,0.04)]"
            role="group"
            aria-label="Language"
          >
            <button className="bg-transparent border-0 text-cv-cyan text-[12px] tracking-[0.22em] px-1 py-0.5 [text-shadow:0_0_8px_#2bd6ff]">
              PT
            </button>
            <span className="text-cv-cyan-soft text-[12px]">|</span>
            <button
              className="bg-transparent border-0 text-cv-text-dim text-[12px] tracking-[0.22em] px-1 py-0.5 cursor-gamer-not-allowed opacity-40"
              disabled
            >
              EN
            </button>
          </div>
          <A11yDropdown />
        </div>
      </div>
    </div>
  );
}
