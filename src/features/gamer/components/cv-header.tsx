'use client';

import { motion, useInView } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

    const initialDelay = setTimeout(() => {
      setIsAnimating(true);
      let deleteIndex = initialText.length;

      const deleteInterval = setInterval(() => {
        deleteIndex--;
        setDisplayed(initialText.slice(0, deleteIndex));

        if (deleteIndex === 0) {
          clearInterval(deleteInterval);

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
  smallWidthClass = 'max-[480px]:w-[80px]',
}: {
  label: string;
  options: string[];
  targetIndex: number;
  skip?: boolean;
  startAnimation?: boolean;
  onDone?: () => void;
  smallWidthClass?: string;
}) {
  const swiperRef = useRef<SwiperType | null>(null);
  const hasStartedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [animating, setAnimating] = useState(false);
  const [userInteracting, setUserInteracting] = useState(false);
  const [swiperReady, setSwiperReady] = useState(false);
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
        setTimeout(() => {
          // Snap to the exact target in case the swiper geometry drifted
          // (e.g. slides advanced while the header was condensed/hidden).
          swiperRef.current?.slideToLoop(targetIndex, 0);
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

  // The header collapses to `display:none` while scrolled away, which zeroes
  // the swiper's geometry and can leave it on the wrong slide once shown again.
  // Re-measure and snap back to the resting target whenever it re-enters view
  // (unless the entrance animation is running or the user is interacting).
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper?.el) return;

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (animating || userInteracting || !hasStartedRef.current) continue;
        swiper.update();
        swiper.slideToLoop(targetIndex, 0);
      }
    });
    io.observe(swiper.el);
    return () => io.disconnect();
  }, [swiperReady, animating, userInteracting, targetIndex]);

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
    <div className="inline-flex items-center gap-[10px] max-[480px]:gap-[2px]">
      <div className="opacity-80 text-cv-text w-fit max-[363px]:w-[62px] cv-rank-label">{label}</div>
      <motion.div
        className={`inline-flex items-center gap-[4px] border border-cv-border bg-[rgba(43,214,255,0.04)] px-1 py-[2px] cursor-gamer-default max-[947px]:w-[150px] max-[653px]:w-[135px] max-[526px]:w-[95px] ${smallWidthClass} cv-rank-swiper-box`}
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
        <div className="w-[132px] max-[653px]:flex-1 max-[653px]:min-w-0 overflow-hidden cv-rank-swiper-inner">
          <Swiper
            onSwiper={(s) => {
              swiperRef.current = s;
              setSwiperReady(true);
            }}
            initialSlide={skip ? targetIndex : 0}
            loop
            observer
            observeParents
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

// i18n toggle + a11y dropdown — duplicated above (condensed) and below (expanded)
function HeaderTriggers({ condensed = false }: { condensed?: boolean }) {
  return (
    <div className="flex items-center gap-[18px] flex-wrap max-[296px]:gap-y-[8px] max-[296px]:justify-center cv-header-triggers">
      <div
        className="inline-flex items-center gap-2 border border-cv-border px-[10px] py-1 bg-[rgba(43,214,255,0.04)]"
        role="group"
        aria-label="Language"
      >
        <button
          type="button"
          className="bg-transparent border-0 text-cv-cyan text-[12px] tracking-[0.22em] px-1 py-0.5 [text-shadow:0_0_8px_#2bd6ff] font-cv-mono cursor-gamer-pointer"
        >
          PT
        </button>
        <span className="text-cv-cyan-soft text-[12px]">|</span>
        <button
          type="button"
          className="bg-transparent border-0 text-cv-text-dim text-[12px] tracking-[0.22em] px-1 py-0.5 cursor-gamer-not-allowed opacity-40 font-cv-mono"
          disabled
        >
          EN
        </button>
      </div>
      <A11yDropdown floatingTopOverride={condensed ? '80px' : undefined} />
    </div>
  );
}

export function CvHeader({ data }: { data: PortfolioData }) {
  // ── Header state ──────────────────────────────────────────────────────
  const cardRef = useRef<HTMLDivElement>(null);
  const [condensed, setCondensed] = useState(false);
  const condensedRef = useRef(false);
  useEffect(() => {
    condensedRef.current = condensed;
  }, [condensed]);

  // Container height: measured via ResizeObserver so any internal change
  // (A11Y badge count, text wrap, option toggles) updates the spacer too.
  const [spacerH, setSpacerH] = useState(0);

  useLayoutEffect(() => {
    if (!cardRef.current) return;
    const measure = () => {
      if (!cardRef.current || condensedRef.current) return;
      setSpacerH(cardRef.current.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Animations / a11y ─────────────────────────────────────────────────
  const isInView = useInView(cardRef, { once: true });
  const { opts } = useA11y();
  const noMotion = opts.reduceMotion;
  // The card stays on-screen while condensed, but its expanded grid is
  // `display:none`. Gate the entrance animations on the expanded content
  // actually being visible so they don't burn while hidden (e.g. when the
  // page loads already scrolled down / condensed) and instead play on reveal.
  const contentVisible = isInView && !condensed;
  const textLargeRef = useRef(opts.textLarge);
  useEffect(() => {
    textLargeRef.current = opts.textLarge;
  }, [opts.textLarge]);

  // ── XP / level state ──────────────────────────────────────────────────
  const [levelLabel, setLevelLabel] = useState('Nível 0 — Experiência');
  const [xpDisplay, setXpDisplay] = useState('0000 / 0000');
  const [lvlFill, setLvlFill] = useState(0);
  const xpFilledRef = useRef(false);
  const BLOCKS = 26;
  const on = Math.round((lvlFill / 100) * BLOCKS);

  // ── Typewriter / rank ─────────────────────────────────────────────────
  const { displayed: titleText, done: titleDone } = useTerminalTypewriter(
    'ANTÔNIO_MASCARENHAS',
    80,
    contentVisible,
    noMotion,
    'NOME_DO_USUARIO',
    1000,
  );
  const [rankDone, setRankDone] = useState(false);
  const handleRankDone = useCallback(() => setRankDone(true), []);

  // ── Expanded padding: 16px on all sides below 470px ─────────────────
  const [smallScreen, setSmallScreen] = useState(false);
  useEffect(() => {
    const update = () => setSmallScreen(window.innerWidth < 470);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Scroll: relative below threshold, sticky above ───────────────────
  useEffect(() => {
    const getThresholds = () => {
      // Breakpoint rules only apply when text-large scale is disabled
      if (!textLargeRef.current) {
        if (window.innerWidth < 298) return { stickAt: 335, unstickAt: 335 };
        if (window.innerWidth < 363) return { stickAt: 310, unstickAt: 310 };
        if (window.innerWidth < 465) return { stickAt: 263, unstickAt: 263 };
        if (window.innerWidth < 563) return { stickAt: 250, unstickAt: 250 };
        if (window.innerWidth < 703) return { stickAt: 295, unstickAt: 295 };
        if (window.innerWidth < 880) return { stickAt: 250, unstickAt: 250 };
        if (window.innerWidth < 1125) return { stickAt: 165, unstickAt: 165 };
        return { stickAt: 185, unstickAt: 185 };
      }

      if (window.innerWidth < 357) return { stickAt: 410, unstickAt: 410 };
      if (window.innerWidth < 392) return { stickAt: 380, unstickAt: 380 };
      if (window.innerWidth < 515) return { stickAt: 365, unstickAt: 365 };
      if (window.innerWidth < 710) return { stickAt: 320, unstickAt: 320 };
      if (window.innerWidth < 878) return { stickAt: 360, unstickAt: 360 };
      if (window.innerWidth < 1136) return { stickAt: 300, unstickAt: 300 };
      if (window.innerWidth < 1350) return { stickAt: 200, unstickAt: 200 };
      return { stickAt: 215, unstickAt: 215 };
    };

    const onScroll = () => {
      const { stickAt, unstickAt } = getThresholds();
      setCondensed((prev) => {
        if (!prev && window.scrollY >= stickAt) return true;
        if (prev && window.scrollY < unstickAt) return false;
        return prev;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // ── XP bar fill animation ─────────────────────────────────────────────
  useEffect(() => {
    setLevelLabel(data.level.label);
    setXpDisplay(data.level.sub);

    if (noMotion) {
      setLvlFill(data.level.fill);
      xpFilledRef.current = true;
      return;
    }
    if (!contentVisible) return;

    const target = data.level.fill;
    // Animate the fill only once; on later reveals just keep it filled so it
    // doesn't restart from 0 each time the header expands back into view.
    if (xpFilledRef.current) {
      setLvlFill(target);
      return;
    }
    xpFilledRef.current = true;

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
  }, [contentVisible, noMotion, data.level.label, data.level.sub, data.level.fill]);

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* Container: holds layout space; height offsets ±15 px by state */}
      <div className="relative mb-7" style={{ height: spacerH || 'fit-content' }} aria-hidden={condensed}>
        <motion.div
          ref={cardRef}
          className={
            !spacerH
              ? 'relative w-full z-[110] border border-cv-cyan cv-header-box'
              : condensed
                ? 'fixed top-[14px] left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[1052px] z-[110] border border-cv-cyan cv-header-box is-condensed'
                : 'relative top-0 left-0 right-0 z-[110] border border-cv-cyan cv-header-box'
          }
          style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
          animate={{
            paddingTop: condensed ? 12 : 26,
            paddingBottom: condensed ? 12 : 26,
            paddingLeft: condensed ? 14 : smallScreen ? 16 : 26,
            paddingRight: condensed ? 12 : smallScreen ? 16 : 26,
            boxShadow:
              'inset 0 0 40px rgba(43,214,255,0.06), 0 0 0 1px rgba(43,214,255,0.05), 0 8px 40px rgba(43,214,255,0.05)',
          }}
          initial={false}
          transition={{ duration: 0 }}
        >
          {/* Corner brackets */}
          <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan top-[-5px] left-[-5px] border-r-0 border-b-0" />
          <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan top-[-5px] right-[-5px] border-l-0 border-b-0" />
          <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan bottom-[-5px] left-[-5px] border-r-0 border-t-0" />
          <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan bottom-[-5px] right-[-5px] border-l-0 border-t-0" />

          {/* ── 2-column grid: hidden when condensed ────────────────────────── */}
          <div
            className={`${condensed ? 'hidden' : 'grid'} grid-cols-[1fr_280px] gap-[30px] max-cv:grid-cols-1 max-cv:gap-[14px] items-center cv-header-info-row`}
            aria-hidden={condensed}
          >
            {/* col1 */}
            <div className="flex flex-col items-start gap-4 min-w-0 max-cv:items-center max-cv:w-full cv-header-info-left">
              <div className="[font-size:clamp(16px,calc(7px_+_3vw),34px)] text-cv-cyan tracking-[0.18em] mt-0 mb-0 [text-shadow:0_0_12px_rgba(43,214,255,0.4),0_0_30px_rgba(43,214,255,0.2)] flex items-center max-cv:justify-center cv-header-title">
                <div aria-hidden="true">{'//'}</div>
                <h1 className="inline ml-[6px]">{titleText}</h1>
                <BlinkingCursor className="w-[0.47em] h-[0.95em] align-[-0.16em] mb-[0.07em]" hidden={noMotion} />
              </div>
              <h2 className="text-cv-text-dim text-[13px] tracking-[0.14em] uppercase flex items-center gap-[14px] flex-wrap max-cv:justify-center cv-header-name-row m-0">
                <RankSwiper
                  label="rank:"
                  options={['nenhum', 'júnior', 'pleno', 'sênior']}
                  targetIndex={2}
                  skip={noMotion}
                  startAnimation={titleDone}
                  onDone={handleRankDone}
                  smallWidthClass="max-[480px]:w-[70px] max-[363px]:w-[90px]"
                />
                <span className="text-cv-cyan-soft cv-name-divider">|</span>
                <RankSwiper
                  label="classe:"
                  options={['nenhuma', 'backend', 'frontend', 'fullstack']}
                  targetIndex={2}
                  skip={noMotion}
                  startAnimation={rankDone}
                  smallWidthClass="max-[480px]:w-[90px] max-[363px]:w-[90px]"
                />
              </h2>
            </div>

            {/* col2 */}
            <div className="text-right max-cv:text-center max-cv:min-w-0 max-cv:w-full mt-[2px] cv-header-info-right">
              <span className="block text-[11px] text-cv-text-dim tracking-[0.2em] uppercase opacity-70 hover:opacity-100 transition-opacity duration-200">
                {levelLabel}
              </span>
              <div className="flex gap-[3px] mt-[6px] w-full max-w-[240px] ml-auto max-cv:mx-auto h-[22px] border border-cv-cyan shadow-[0_0_10px_rgba(43,214,255,0.25),inset_0_0_6px_rgba(43,214,255,0.12)] px-[4px] py-[3px] overflow-hidden items-stretch cv-header-level-bar">
                {Array.from({ length: BLOCKS }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 block transition-[background,box-shadow] duration-[250ms] [transition-timing-function:ease] ${
                      i < on ? 'bg-cv-cyan shadow-[0_0_7px_rgba(43,214,255,0.7)]' : 'bg-[rgba(43,214,255,0.14)]'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between w-full max-w-[240px] ml-auto mt-2 text-[12px] text-cv-cyan tracking-[0.06em] cv-header-level-sub">
                <span className="opacity-70 hover:opacity-100 transition-opacity duration-200 tabular-nums">
                  {lvlFill}%
                </span>
                <span className="transition-opacity duration-300">{xpDisplay}</span>
              </div>
            </div>
          </div>

          {/* ── Footer row: always visible ───────────────────────────────────
            Mini name appears here (display:none by default) when condensed.
            Tagline + triggers always present. */}
          <div
            className={`${condensed ? 'mt-0 border-t-0 pt-0 max-[563px]:justify-center max-[563px]:gap-[6px]' : 'mt-[22px] pt-4 max-cv:pt-[24px] border-t border-dashed border-cv-border'} flex items-center justify-between gap-[18px] flex-wrap cv-header-bottom`}
          >
            {/* Mini name — hidden when expanded, shown when condensed */}
            <button
              type="button"
              className={`${condensed ? 'flex' : 'hidden'} bg-transparent border-none text-cv-cyan text-[16px] max-[348px]:text-[4.5vw] tracking-[0.14em] whitespace-nowrap [text-shadow:0_0_10px_rgba(43,214,255,0.4)] p-0 cursor-gamer-pointer font-cv-mono items-center cv-mini-name`}
              onClick={toTop}
              title="Voltar ao topo"
              aria-hidden={!condensed}
              tabIndex={condensed ? 0 : -1}
            >
              {'// ANTÔNIO_MASCARENHAS'}
              <BlinkingCursor className="w-[8px] h-[15px] align-[-2px]" hidden={noMotion} />
            </button>
            <span
              className={`${condensed ? 'hidden' : 'inline-block'} border border-dashed border-cv-cyan px-[14px] py-[6px] max-[299px]:p-[13.5px] text-cv-cyan text-[12px] tracking-[0.18em] uppercase bg-[rgba(43,214,255,0.06)] text-center`}
            >
              Obsessão por qualidade em cada detalhe.
            </span>
            <HeaderTriggers key={condensed ? 'foot-off' : 'foot-on'} condensed={condensed} />
          </div>
        </motion.div>
      </div>
    </>
  );
}
