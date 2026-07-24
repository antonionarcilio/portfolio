'use client';

import { motion, useInView } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useA11y } from '@/features/gamified/contexts/a11y-context';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import type { PortfolioData } from '@/shared/types/portfolio';
import { A11yDropdown } from './a11y-dropdown';
import { CornerBrackets } from './corner-brackets';

/** Labels de exibição para cada locale — concern da UI, separado da config global. */
const LOCALE_LABELS: Record<string, string> = { 'pt-BR': 'PT', en: 'EN' };

const RANK_INDEX: Record<string, number> = { junior: 1, mid: 2, senior: 3 };

function detectClasseIndex(role: string): number {
  const lower = role.toLowerCase();
  if (lower.includes('fullstack')) return 3;
  if (lower.includes('frontend')) return 2;
  if (lower.includes('backend')) return 1;
  return 0;
}

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
  smallWidthVariant,
}: {
  label: string;
  options: string[];
  targetIndex: number;
  skip?: boolean;
  startAnimation?: boolean;
  onDone?: () => void;
  smallWidthVariant?: 'rank' | 'classe';
}) {
  const swiperRef = useRef<SwiperType | null>(null);
  const hasStartedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [animating, setAnimating] = useState(false);
  const [userInteracting, setUserInteracting] = useState(false);
  const [swiperReady, setSwiperReady] = useState(false);
  const t = useTranslations('gamified.cvHeader');
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
    <div className="cv-rank-row inline-flex items-center gap-[10px]">
      <div className="opacity-80 text-cv-text w-fit cv-rank-label">{label}</div>
      <motion.div
        className={`inline-flex items-center gap-[4px] border border-cv-border bg-[rgba(43,214,255,0.04)] px-1 py-[2px] cursor-gamified-default cv-rank-swiper-box ${smallWidthVariant ? `cv-rank-swiper-box--${smallWidthVariant}` : ''}`}
        variants={swiperBoxVariants}
        animate={(animating || userInteracting) && !noMotion ? 'active' : 'idle'}
        whileHover={noMotion ? undefined : 'active'}
        transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <button
          type="button"
          className="cv-rank-swiper-nav bg-transparent border-0 text-cv-cyan leading-none px-[5px] py-[2px] opacity-60 hover:opacity-100 hover:[text-shadow:0_0_8px_#2bd6ff] transition-all duration-150 cursor-gamified-pointer"
          onClick={() => handleUserNavigate('prev')}
          aria-label={t('prevAria')}
        >
          &lt;
        </button>
        <div className="w-[132px] overflow-hidden cv-rank-swiper-inner">
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
          className="cv-rank-swiper-nav bg-transparent border-0 text-cv-cyan leading-none px-[5px] py-[2px] opacity-60 hover:opacity-100 hover:[text-shadow:0_0_8px_#2bd6ff] transition-all duration-150 cursor-gamified-pointer"
          onClick={() => handleUserNavigate('next')}
          aria-label={t('nextAria')}
        >
          &gt;
        </button>
      </motion.div>
    </div>
  );
}

// i18n toggle + a11y dropdown — duplicated above (condensed) and below (expanded)
function HeaderTriggers({ condensed = false }: { condensed?: boolean }) {
  const t = useTranslations('gamified.cvHeader');
  const currentLocale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-[18px] flex-wrap cv-header-triggers">
      <nav
        className="inline-flex items-center gap-2 border border-cv-border px-[10px] py-1 bg-[rgba(43,214,255,0.04)]"
        aria-label={t('langNavAria')}
      >
        {routing.locales.map((code, i) => {
          const isActive = currentLocale === code;
          return (
            <span key={code} className="inline-flex items-center gap-2">
              {i > 0 && <span className="text-cv-cyan-soft text-[12px]">|</span>}
              <Link
                href={pathname}
                locale={code}
                aria-current={isActive ? 'page' : undefined}
                className={`text-[12px] tracking-[0.22em] px-1 py-0.5 font-cv-mono no-underline ${
                  isActive
                    ? 'text-cv-cyan [text-shadow:0_0_8px_#2bd6ff] cursor-gamified-default pointer-events-none'
                    : 'text-cv-text-dim opacity-60 hover:opacity-100 cursor-gamified-pointer'
                }`}
              >
                {LOCALE_LABELS[code] ?? code}
              </Link>
            </span>
          );
        })}
      </nav>
      <A11yDropdown floatingTopOverride={condensed ? '80px' : undefined} />
    </div>
  );
}

export function CvHeader({ data }: { data: PortfolioData }) {
  const t = useTranslations('gamified.cvHeader');
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
      if (!cardRef.current) return;
      // Exposed as a CSS var so anchor targets (scroll-mt) can size their
      // scroll-margin off the *actual* rendered header height instead of a
      // guessed pixel value — the condensed pill wraps onto extra lines at
      // narrow viewports (rank/classe row, footer triggers), growing taller
      // than any single fixed offset could account for.
      document.documentElement.style.setProperty('--cv-header-h', `${cardRef.current.offsetHeight}px`);
      if (condensedRef.current) return;
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
  const upscaleRef = useRef(opts.upscale);
  useEffect(() => {
    upscaleRef.current = opts.upscale;
  }, [opts.upscale]);

  // ── XP / level state ──────────────────────────────────────────────────
  const [levelLabel, setLevelLabel] = useState(t('levelZero'));
  const [xpDisplay, setXpDisplay] = useState('0000 / 0000');
  const [lvlFill, setLvlFill] = useState(0);
  const xpFilledRef = useRef(false);
  const BLOCKS = 26;
  const on = Math.round((lvlFill / 100) * BLOCKS);

  // ── Typewriter / rank ─────────────────────────────────────────────────
  const heroName = data.name.toUpperCase();
  const heroFirstSpaceIndex = heroName.indexOf(' ');
  const heroFirstName = heroFirstSpaceIndex === -1 ? heroName : heroName.slice(0, heroFirstSpaceIndex);
  const heroRestName = heroFirstSpaceIndex === -1 ? '' : heroName.slice(heroFirstSpaceIndex);
  const { displayed: titleText, done: titleDone } = useTerminalTypewriter(
    heroName,
    80,
    contentVisible,
    noMotion,
    'NOME DO USUARIO',
    1000,
  );
  const heroBoldEnd = heroFirstSpaceIndex === -1 ? titleText.length : Math.min(titleText.length, heroFirstSpaceIndex);
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
      // Breakpoint rules only apply when upscale is disabled
      if (!upscaleRef.current) {
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
      <div className="relative mb-9" style={{ height: spacerH || 'fit-content' }} aria-hidden={condensed}>
        <motion.div
          ref={cardRef}
          className={
            !spacerH
              ? 'relative w-full z-[110] border border-cv-border bg-cv-panel cv-header-box'
              : condensed
                ? 'fixed top-[14px] left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[1126px] z-[110] border border-cv-border bg-transparent cv-header-box is-condensed'
                : 'relative top-0 left-0 right-0 z-[110] border border-cv-border bg-cv-panel cv-header-box'
          }
          style={condensed ? { backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' } : undefined}
          animate={{
            paddingTop: condensed ? 14 : 32,
            paddingBottom: condensed ? 14 : 32,
            paddingLeft: condensed ? 16 : smallScreen ? 16 : 32,
            paddingRight: condensed ? 14 : smallScreen ? 16 : 32,
            boxShadow:
              'inset 0 0 40px rgba(43,214,255,0.06), 0 0 0 1px rgba(43,214,255,0.05), 0 8px 40px rgba(43,214,255,0.05)',
          }}
          initial={false}
          transition={{ duration: 0 }}
        >
          <CornerBrackets size={condensed ? 'sm' : 'md'} />

          {/* ── 2-column grid: hidden when condensed ────────────────────────── */}
          <div
            className={`${condensed ? 'hidden' : 'grid'} grid-cols-[1fr_280px] gap-[30px] items-center cv-header-info-row`}
            aria-hidden={condensed}
          >
            {/* col1 */}
            <div className="flex flex-col items-start gap-[32px] min-w-0 cv-header-info-left">
              <div className="[font-size:clamp(16px,calc(7px_+_3vw),31.5px)] text-cv-cyan tracking-[0.18em] mt-0 mb-0 leading-[28px] [text-shadow:0_0_12px_rgba(43,214,255,0.4),0_0_30px_rgba(43,214,255,0.2)] flex items-center cv-header-title">
                <span
                  aria-hidden="true"
                  className="cv-header-title-slash font-cv-heading text-cv-cyan opacity-60 mr-[6px] leading-[28px]"
                >
                  {'//'}
                </span>
                <h1 className="flex items-center gap-1.5 font-cv-heading min-h-[1lh]">
                  <strong className="font-bold leading-[28px]">{titleText.slice(0, heroBoldEnd)}</strong>
                  <span className="[-webkit-text-stroke:1px_var(--color-cv-cyan)] [-webkit-text-fill-color:transparent] font-black leading-[28px]">
                    {titleText.slice(heroBoldEnd)}
                  </span>
                </h1>
                <BlinkingCursor
                  className="cv-header-title-cursor w-[13.5px] h-[28px] align-[-0.16em]"
                  hidden={noMotion}
                />
              </div>
              <h2 className="text-cv-text-dim text-[13px] tracking-[0.14em] uppercase flex items-center gap-[14px] flex-wrap cv-header-name-row m-0">
                <RankSwiper
                  label={t('rankLabel')}
                  options={t.raw('rankOptions')}
                  targetIndex={RANK_INDEX[data.seniority ?? ''] ?? 0}
                  skip={noMotion}
                  startAnimation={titleDone}
                  onDone={handleRankDone}
                  smallWidthVariant="rank"
                />
                <span className="text-cv-cyan-soft cv-name-divider">|</span>
                <RankSwiper
                  label={t('classeLabel')}
                  options={t.raw('classeOptions')}
                  targetIndex={detectClasseIndex(data.role)}
                  skip={noMotion}
                  startAnimation={rankDone}
                  smallWidthVariant="classe"
                />
              </h2>
            </div>

            {/* col2 */}
            <div className="text-right mt-[2px] cv-header-info-right">
              <span className="block text-[11px] text-cv-text-dim tracking-[0.2em] uppercase opacity-70 hover:opacity-100 transition-opacity duration-200">
                {levelLabel}
              </span>
              <div className="flex gap-[3px] mt-[6px] w-full max-w-[240px] ml-auto h-[22px] border border-cv-cyan shadow-[0_0_10px_rgba(43,214,255,0.25),inset_0_0_6px_rgba(43,214,255,0.12)] px-[4px] py-[3px] overflow-hidden items-stretch cv-header-level-bar">
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
            className={`${condensed ? 'mt-0 border-t-0 pt-0' : 'mt-[32px] pt-[32px] border-t border-dashed border-cv-border'} flex items-center justify-between gap-[30px] flex-wrap cv-header-bottom`}
          >
            {/* Mini name — hidden when expanded, shown when condensed */}
            <button
              type="button"
              className={`${condensed ? 'flex' : 'hidden'} bg-transparent border-none text-cv-cyan text-[16px] tracking-[0.14em] whitespace-nowrap [text-shadow:0_0_10px_rgba(43,214,255,0.4)] p-0 cursor-gamified-pointer font-cv-heading items-center cv-mini-name`}
              onClick={toTop}
              title={t('backToTop')}
              aria-hidden={!condensed}
              tabIndex={condensed ? 0 : -1}
            >
              <span className="opacity-60 mr-[6px]">{'//'}</span>
              <span>
                <strong className="font-bold">{heroFirstName}</strong>
                {heroRestName}
              </span>
              <BlinkingCursor className="w-[8px] h-[15px] align-[-2px]" hidden={noMotion} />
            </button>
            <span
              className={`cv-header-highlight ${condensed ? 'hidden' : 'inline-block'} ${!data.highlightText ? 'invisible' : ''} border border-dashed border-cv-cyan px-[14px] py-[6px] text-cv-cyan text-[12px] tracking-[0.18em] uppercase bg-[rgba(43,214,255,0.06)] text-center`}
            >
              {data.highlightText ?? ' '}
            </span>
            {!condensed && (
              <div
                aria-hidden="true"
                className="cv-header-dots hidden flex-1 min-w-[40px] w-full h-[30px] overflow-hidden opacity-35 items-center"
              >
                <svg width="100%" height="25" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="hdr-dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.2" fill="#2bd6ff" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="25" fill="url(#hdr-dots)" />
                </svg>
              </div>
            )}
            <div className="flex items-center justify-between gap-[32px] flex-wrap mt-0 pb-0 cv-header-triggers-row">
              <HeaderTriggers key={condensed ? 'foot-off' : 'foot-on'} condensed={condensed} />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
