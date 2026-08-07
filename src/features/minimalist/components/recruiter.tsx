'use client';

import { motion, MotionConfig } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';

import dividerV1 from '@/_assets/icons/divider-v1.svg';

import { usePathname, useRouter } from '@/i18n/navigation';
import type { PortfolioData } from '@/shared/types/portfolio';

import {
  consumeA11yWheel,
  MINIMALIST_A11Y_OPTION_KEYS,
  MINIMALIST_FOOTER_NAVIGATION_DELAY_MS,
  MINIMALIST_GLOBAL_WHEEL_THRESHOLD,
  type MinimalistA11yKey,
  type MinimalistA11yOptions,
} from '../a11y';
import { MinimalistSoundPreferenceProvider } from '../contexts/sound-preference-context';
import { useMinimalistAppearance } from '../hooks/use-minimalist-appearance';
import { useIsMinimalistSoundLocked } from '../hooks/use-minimalist-mobile-lock';
import { useMinimalistSoundEffects } from '../sound-controller';
import { circularIndex } from '../utils/circular-index';
import { LOCALE_STORAGE_KEY, writeStoredPreference } from '../utils/preferences';
import { MinimalistA11yPanel } from './a11y-panel';
import { MinimalistA11yTrigger } from './a11y-trigger';
import { AboutBioPanel } from './about-bio-panel';
import { Divider } from './divider';
import { StepPagination } from './navigation';
import { PaginationButton } from './navigation-menu';
import { AboutPage, EducationPage, ExperiencePage, ProjectsPage } from './section';
import { MinimalistSwitchBtn } from './switch-btn';
import { I18nToggle, ModeToggle, ThemeToggle } from './switches';

type RecruiterPage = { id: string; label: string };
type RecruiterProps = {
  data: PortfolioData;
  locale: 'en' | 'pt-BR';
  a11yOptions: MinimalistA11yOptions;
  toggleA11y: (key: MinimalistA11yKey) => void;
};
const FOOTER_WINDOW_RADIUS = 2;

export function MinimalistRecruiter({ data, locale, a11yOptions, toggleA11y }: RecruiterProps) {
  const t = useTranslations('minimalist.recruiter');
  const tA11y = useTranslations('minimalist.a11yPanel');
  const router = useRouter();
  const pathname = usePathname();
  const { appearance, changeAppearance } = useMinimalistAppearance();
  const [activeIndex, setActiveIndex] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const [a11yOpen, setA11yOpen] = useState(false);
  const a11yTriggerRef = useRef<HTMLButtonElement>(null);
  const isSoundLocked = useIsMinimalistSoundLocked();
  const soundEffectsEnabled = a11yOptions.soundEffects && !isSoundLocked;
  const { play: playExitSound } = useMinimalistSoundEffects('mouseClickClose', soundEffectsEnabled);
  const { play: playSectionChangeSound } = useMinimalistSoundEffects('plasticBubbleClick', soundEffectsEnabled);
  const closeA11yPanel = () => {
    setA11yOpen(false);
    window.requestAnimationFrame(() => a11yTriggerRef.current?.focus());
  };
  const [expandedProjectIds, setExpandedProjectIds] = useState<ReadonlySet<string>>(new Set());
  const [isExperienceExpanded, setIsExperienceExpanded] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const aboutExpandTriggerRef = useRef<HTMLButtonElement>(null);
  const openAboutBioPanel = () => {
    playExitSound();
    setIsAboutExpanded(true);
  };
  const closeAboutBioPanel = () => {
    playExitSound();
    setIsAboutExpanded(false);
    window.requestAnimationFrame(() => aboutExpandTriggerRef.current?.focus());
  };
  const footerViewportRef = useRef<HTMLDivElement>(null);
  const footerTrackRef = useRef<HTMLDivElement>(null);
  const activeOptionRef = useRef<HTMLButtonElement>(null);
  const footerWheelAccumulator = useRef(0);
  const footerNavigationLock = useRef(false);
  const focusCenterPending = useRef(false);
  const [footerTranslate, setFooterTranslate] = useState(0);
  const hasExpandedProject = expandedProjectIds.size > 0;
  const hasExpandedContent = hasExpandedProject || isAboutExpanded || isExperienceExpanded;
  const aboutShortBio = data.bio?.excerpt ?? data.highlightText ?? t('empty');
  const aboutFullBio = data.bio?.description ?? aboutShortBio;
  const aboutHasMoreBioContent = aboutFullBio !== aboutShortBio;
  const pages: RecruiterPage[] = [
    { id: 'about', label: t('pages.about') },
    { id: 'projects', label: t('pages.projects') },
    { id: 'experience', label: t('pages.experience') },
    { id: 'education', label: t('pages.education') },
  ];
  const selectPage = useCallback(
    (index: number) => {
      if (hasExpandedContent) return false;
      const nextIndex = circularIndex(index, pages.length);
      setActiveIndex(nextIndex);
      const changed = nextIndex !== activeIndex;
      if (changed) playSectionChangeSound();
      return changed;
    },
    [activeIndex, hasExpandedContent, pages.length, playSectionChangeSound],
  );
  const startFooterNavigationDelay = useCallback(() => {
    if (footerNavigationLock.current) return false;
    footerNavigationLock.current = true;
    window.setTimeout(() => {
      footerNavigationLock.current = false;
    }, MINIMALIST_FOOTER_NAVIGATION_DELAY_MS);
    return true;
  }, []);
  const selectFooterPage = useCallback(
    (index: number) => {
      if (!startFooterNavigationDelay()) return false;
      const changed = selectPage(index);
      if (!changed) footerNavigationLock.current = false;
      return changed;
    },
    [selectPage, startFooterNavigationDelay],
  );
  const moveFooterPage = useCallback(
    (delta: number) => {
      return delta !== 0 && selectFooterPage(activeIndex + delta);
    },
    [activeIndex, selectFooterPage],
  );
  const toggleProject = (projectId: string) => {
    setExpandedProjectIds((current) => {
      const next = new Set(current);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  };
  useLayoutEffect(() => {
    const viewport = footerViewportRef.current;
    const track = footerTrackRef.current;
    const activeOption = track?.querySelector<HTMLElement>('[data-footer-offset="0"]');
    const active = activeOption?.querySelector<HTMLElement>('button');
    if (!viewport || !track || !activeOption || !active) return;
    const updateTranslate = () => {
      const activeCenter = track.offsetLeft + activeOption.offsetLeft + active.offsetLeft + active.offsetWidth / 2;
      setFooterTranslate(viewport.clientWidth / 2 - activeCenter);
    };
    updateTranslate();
    const resizeObserver = new ResizeObserver(updateTranslate);
    resizeObserver.observe(viewport);
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) updateTranslate();
    });
    return () => {
      cancelled = true;
      resizeObserver.disconnect();
    };
  }, [activeIndex, appearance, locale]);
  useLayoutEffect(() => {
    if (!focusCenterPending.current) return;
    focusCenterPending.current = false;
    activeOptionRef.current?.focus({ preventScroll: true });
  }, [activeIndex]);
  const handleFooterItemKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (hasExpandedContent) {
      event.preventDefault();
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    if (selectFooterPage(activeIndex + (event.key === 'ArrowRight' ? 1 : -1))) {
      focusCenterPending.current = true;
    }
  };
  const handleFooterItemClick = (event: MouseEvent<HTMLButtonElement>, index: number) => {
    if (hasExpandedContent) {
      event.preventDefault();
      return;
    }
    if (selectFooterPage(index)) focusCenterPending.current = true;
  };
  const handleWheel = useCallback(
    (event: globalThis.WheelEvent) => {
      if (a11yOpen) return;
      if (hasExpandedContent) {
        const insideExpandedContent =
          event.target instanceof Element && event.target.closest('[data-project-expanded-content]');
        if (!insideExpandedContent) event.preventDefault();
        return;
      }
      const projectGrid =
        event.target instanceof Element ? event.target.closest<HTMLElement>('.minimalist__project-grid') : null;
      if (projectGrid) {
        const atTop = event.deltaY < 0 && projectGrid.scrollTop <= 1;
        const atBottom =
          event.deltaY > 0 && projectGrid.scrollTop + projectGrid.clientHeight >= projectGrid.scrollHeight - 1;
        if (!atTop && !atBottom) {
          event.preventDefault();
          projectGrid.scrollBy({ top: event.deltaY, behavior: 'auto' });
          return;
        }
      }
      // Company list is circular (no boundary), so it always consumes the wheel itself
      // via its own onWheel handler — never falls through to footer page navigation.
      const windowedList =
        event.target instanceof Element ? event.target.closest<HTMLElement>('.minimalist-windowed-list') : null;
      if (windowedList) return;
      const selection = consumeA11yWheel(
        footerWheelAccumulator.current,
        event.deltaY,
        MINIMALIST_GLOBAL_WHEEL_THRESHOLD,
      );
      footerWheelAccumulator.current = selection.accumulator;
      if (selection.direction === 0) return;
      event.preventDefault();
      moveFooterPage(selection.direction);
    },
    [a11yOpen, hasExpandedContent, moveFooterPage],
  );
  const handleShellWheel = useCallback(
    (event: globalThis.WheelEvent) => {
      const main = mainRef.current;
      if (main && event.target instanceof Node && main.contains(event.target)) return;
      handleWheel(event);
    },
    [handleWheel],
  );
  useEffect(() => {
    const main = mainRef.current;
    const theme = themeRef.current;
    if (!main || !theme) return;
    main.addEventListener('wheel', handleWheel, { passive: false });
    theme.addEventListener('wheel', handleShellWheel, { passive: false });
    return () => {
      main.removeEventListener('wheel', handleWheel);
      theme.removeEventListener('wheel', handleShellWheel);
    };
  }, [handleShellWheel, handleWheel]);
  const changeLocale = (nextLocale: 'en' | 'pt-BR') => {
    writeStoredPreference(LOCALE_STORAGE_KEY, nextLocale);
    router.replace(pathname, { locale: nextLocale });
  };
  const logo = appearance === 'light' ? '/logo-light.svg' : '/logo-dark.svg';

  return (
    <MinimalistSoundPreferenceProvider enabled={soundEffectsEnabled}>
      <MotionConfig reducedMotion="user">
        <div
          ref={themeRef}
          className={`minimalist-theme minimalist-theme--${appearance} items-center gap-4 px-8 py-8${hasExpandedContent ? ' minimalist-theme--content-expanded' : ''}${a11yOpen ? ' minimalist-theme--a11y-open' : ''}`}
        >
          <header className="minimalist__header relative flex min-h-[30px] w-full max-w-[1120px] items-center justify-between">
            <div className="minimalist__header-tools flex min-w-[185px] items-center gap-2">
              <I18nToggle appearance={appearance} locale={locale} onChange={changeLocale} />
              <Divider appearance={appearance} variant="v2" orientation="vertical" />
              <ThemeToggle appearance={appearance} onChange={changeAppearance} />
            </div>
            <Image
              className="minimalist__logo absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2"
              src={logo}
              alt={data.name}
              width={73}
              height={21}
            />
            <div className="minimalist__header-tools minimalist__header-tools--right flex min-w-[185px] items-center justify-end gap-2">
              <MinimalistA11yTrigger
                ref={a11yTriggerRef}
                appearance={appearance}
                opened={a11yOpen}
                activeCount={MINIMALIST_A11Y_OPTION_KEYS.filter((key) => a11yOptions[key]).length}
                onClick={() => {
                  if (a11yOpen) {
                    closeA11yPanel();
                  } else {
                    setA11yOpen(true);
                  }
                }}
              />
              <Divider appearance={appearance} variant="v2" orientation="vertical" />
              <ModeToggle appearance={appearance} current="R" />
            </div>
          </header>
          <main
            ref={mainRef}
            className="minimalist__main relative grow w-full max-w-[1120px] overflow-hidden"
            id="main-content"
          >
            <MinimalistA11yPanel appearance={appearance} open={a11yOpen} options={a11yOptions} onToggle={toggleA11y} />
            <AboutBioPanel
              appearance={appearance}
              open={isAboutExpanded}
              data={data}
              fullBio={aboutFullBio}
              onClose={closeAboutBioPanel}
            />
            <div
              className="minimalist__side-pagination"
              aria-hidden={a11yOpen || hasExpandedContent}
              inert={a11yOpen || hasExpandedContent ? true : undefined}
            >
              <StepPagination
                appearance={appearance}
                currentStep={activeIndex + 1}
                totalSteps={pages.length}
                onStepChange={selectPage}
              />
            </div>
            <div
              className="minimalist__content relative mx-auto h-full w-full max-w-[850px] overflow-hidden"
              aria-live="polite"
              aria-hidden={a11yOpen || isAboutExpanded}
              inert={a11yOpen || isAboutExpanded ? true : undefined}
            >
              <motion.div
                className="minimalist__content-track flex w-full flex-col"
                animate={{ y: `${activeIndex * -25}%` }}
                transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
              >
                {pages.map((page, index) => (
                  <section
                    key={page.id}
                    className="minimalist__page block h-1/4 min-h-0 w-full overflow-auto p-0"
                    aria-labelledby={`minimalist-page-${page.id}`}
                    aria-hidden={index !== activeIndex}
                    inert={index !== activeIndex ? true : undefined}
                  >
                    <div
                      className="minimalist__page-content grid min-h-full place-items-center"
                      id={`minimalist-page-${page.id}`}
                    >
                      {page.id === 'about' && (
                        <AboutPage
                          data={data}
                          appearance={appearance}
                          t={t}
                          shortBio={aboutShortBio}
                          hasMoreBioContent={aboutHasMoreBioContent}
                          isExpanded={isAboutExpanded}
                          onExpand={openAboutBioPanel}
                          expandTriggerRef={aboutExpandTriggerRef}
                        />
                      )}
                      {page.id === 'experience' && (
                        <ExperiencePage
                          data={data}
                          appearance={appearance}
                          t={t}
                          soundEffectsEnabled={soundEffectsEnabled}
                          expanded={isExperienceExpanded}
                          onExpandedChange={() => setIsExperienceExpanded((current) => !current)}
                        />
                      )}
                      {page.id === 'projects' && (
                        <ProjectsPage
                          data={data}
                          appearance={appearance}
                          t={t}
                          expandedProjectIds={expandedProjectIds}
                          onToggleProject={toggleProject}
                        />
                      )}
                      {page.id === 'education' && <EducationPage data={data} t={t} />}
                    </div>
                  </section>
                ))}
              </motion.div>
            </div>
          </main>
          <footer
            className="minimalist__footer flex min-h-[30px] w-full max-w-[1120px] items-center justify-center gap-4"
            aria-hidden={hasExpandedContent && !a11yOpen}
            inert={hasExpandedContent && !a11yOpen ? true : undefined}
          >
            {a11yOpen ? (
              <button
                className="minimalist__footer-exit"
                type="button"
                onClick={() => {
                  playExitSound();
                  closeA11yPanel();
                }}
              >
                {tA11y('close')}
              </button>
            ) : (
              <>
                <PaginationButton appearance={appearance} direction="previous" onClick={() => moveFooterPage(-1)} />
                <div
                  ref={footerViewportRef}
                  className="minimalist__footer-viewport relative w-full max-w-[550px] overflow-hidden"
                  role="group"
                  aria-label={t('footerNavigation')}
                >
                  <div
                    ref={footerTrackRef}
                    className="minimalist__footer-track relative flex h-6 w-max items-center gap-[22px]"
                    style={{ transform: `translateX(${footerTranslate}px)` }}
                  >
                    {Array.from(
                      { length: FOOTER_WINDOW_RADIUS * 2 + 1 },
                      (_, offsetIndex) => offsetIndex - FOOTER_WINDOW_RADIUS,
                    ).map((offset) => {
                      const page = pages[circularIndex(activeIndex + offset, pages.length)];
                      const isActive = offset === 0;
                      return (
                        <div
                          key={`${page.id}-${offset}`}
                          className={`minimalist__footer-option relative flex h-6 w-auto items-center justify-center gap-[14px]${isActive ? ' minimalist__footer-option--active' : ''}`}
                          data-footer-offset={offset}
                        >
                          <MinimalistSwitchBtn
                            ref={isActive ? activeOptionRef : undefined}
                            appearance={appearance}
                            current={isActive}
                            label={page.label}
                            onClick={(event) =>
                              handleFooterItemClick(event, circularIndex(activeIndex + offset, pages.length))
                            }
                            onKeyDown={handleFooterItemKeyDown}
                            playClickSound={false}
                            tabIndex={isActive ? 0 : -1}
                          />
                          <span className="minimalist__footer-divider h-4 w-auto" aria-hidden="true">
                            <Image src={dividerV1} alt="" width={6} height={13} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <PaginationButton appearance={appearance} direction="next" onClick={() => moveFooterPage(1)} />
              </>
            )}
          </footer>
        </div>
      </MotionConfig>
    </MinimalistSoundPreferenceProvider>
  );
}
