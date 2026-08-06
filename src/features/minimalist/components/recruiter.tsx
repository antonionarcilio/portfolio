'use client';

import { motion, MotionConfig } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type UIEvent,
} from 'react';

import dividerV1 from '@/_assets/icons/divider-v1.svg';

import { usePathname, useRouter } from '@/i18n/navigation';
import { MarkdownText } from '@/shared/components/markdown-text';
import type { ExperienceEntry, PortfolioData } from '@/shared/types/portfolio';

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
import { useMinimalistCardEmphasis } from '../hooks/use-minimalist-card-emphasis';
import { useIsMinimalistSoundLocked } from '../hooks/use-minimalist-mobile-lock';
// import { useMinimalistSnapScroll } from '../hooks/use-minimalist-snap-scroll';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistAppearance } from '../types';
import { circularIndex } from '../utils/circular-index';
import { LOCALE_STORAGE_KEY, writeStoredPreference } from '../utils/preferences';
import { MinimalistA11yPanel } from './a11y-panel';
import { MinimalistA11yTrigger } from './a11y-trigger';
import { MinimalistAnchor } from './anchor';
import { Button } from './button';
import { MinimalistCard } from './card';
import { Divider } from './divider';
import { NavigationHint, SectionSwitch, StepPagination } from './navigation';
import { PaginationButton } from './navigation-menu';
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

function period(start: string, end: string | null | undefined, present: string): string {
  const from = new Date(start).toISOString().slice(0, 7).replace('-', '/');
  const to = end ? new Date(end).toISOString().slice(0, 7).replace('-', '/') : present;
  return `${from} - ${to}`;
}

function EmptyState({ message }: { message: string }) {
  return <p className="minimalist__empty">{message}</p>;
}

// function guardSnapHandler<E extends { preventDefault: () => void }>(
//   hasExpandedProject: boolean,
//   handler: (event: E) => void,
// ): (event: E) => void {
//   return (event) => {
//     if (hasExpandedProject) {
//       event.preventDefault();
//       return;
//     }
//     handler(event);
//   };
// }
// const PROJECT_SNAP_KEYS = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'];

function AboutPage({
  data,
  appearance,
  t,
}: {
  data: PortfolioData;
  appearance: MinimalistAppearance;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const shortBio = data.bio?.excerpt ?? data.highlightText ?? t('empty');
  const fullBio = data.bio?.description ?? shortBio;
  return (
    <div className="minimalist__about">
      <div className="minimalist__portrait" aria-hidden="true">
        {data.avatarUrl && <Image src={data.avatarUrl} alt="" width={168} height={168} priority />}
      </div>
      <div className="minimalist__about-copy">
        <p className="minimalist__about-kicker">{t('aboutKicker')}</p>
        <h1>
          {data.name}
          <Divider appearance={appearance} variant="v1" orientation="vertical" />
          <span className="minimalist__about-role">{data.role}</span>
        </h1>
        <p className="minimalist__about-location">{t('locationSuffix', { location: data.location })}</p>
        <MarkdownText>{shortBio}</MarkdownText>
        {fullBio !== shortBio && (
          <Button appearance={appearance} className="minimalist__more" label={t('more')} disabled />
        )}
        <div className="minimalist__about-meta">
          {data.githubUrl && (
            <MinimalistAnchor appearance={appearance} href={data.githubUrl} variant="secondary">
              GitHub
            </MinimalistAnchor>
          )}
          {data.linkedinUrl && (
            <MinimalistAnchor appearance={appearance} href={data.linkedinUrl} variant="secondary">
              LinkedIn
            </MinimalistAnchor>
          )}
          {data.email && (
            <MinimalistAnchor
              appearance={appearance}
              href={data.email.startsWith('mailto:') ? data.email : `mailto:${data.email}`}
              variant="secondary"
            >
              E-Mail
            </MinimalistAnchor>
          )}
          {data.contacts
            .filter((contact) => {
              const normalizedEmail = data.email.replace(/^mailto:/, '');
              return (
                contact.url !== data.linkedinUrl &&
                contact.url !== data.githubUrl &&
                !contact.url.includes(normalizedEmail)
              );
            })
            .map((contact) => (
              <MinimalistAnchor key={contact.url} appearance={appearance} href={contact.url} variant="secondary">
                {contact.label}
              </MinimalistAnchor>
            ))}
        </div>
      </div>
    </div>
  );
}

function ExperiencePage({
  data,
  appearance,
  t,
}: {
  data: PortfolioData;
  appearance: MinimalistAppearance;
  t: (key: string) => string;
}) {
  const [selected, setSelected] = useState(0);
  const entries: ExperienceEntry[] = data.experience;
  const current = entries[selected];
  const selectEntry = (index: number) => setSelected(Math.max(0, Math.min(entries.length - 1, index)));
  if (!entries.length) return <EmptyState message={t('empty')} />;
  return (
    <div className="minimalist__experience">
      <h1 className="sr-only">{t('titles.experience')}</h1>
      <div
        className="minimalist__experience-switch"
        role="group"
        aria-label={t('labels.experience')}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') selectEntry(selected + 1);
          if (event.key === 'ArrowUp') selectEntry(selected - 1);
        }}
      >
        {entries.map((item, index) => (
          <SectionSwitch
            key={`${item.company}-${item.startDate}`}
            appearance={appearance}
            active={index === selected}
            label={item.company}
            onClick={() => selectEntry(index)}
          />
        ))}
      </div>
      <div className="minimalist__experience-detail">
        <p className="minimalist-kicker">{`// ${current.company}`}</p>
        <h2>{current.role}</h2>
        <time>{period(current.startDate, current.endDate, t('present'))}</time>
        <span className="minimalist__experience-company">{current.company}</span>
        <p className="minimalist-kicker">{t('description')}</p>
        <MarkdownText inline>{current.excerpt}</MarkdownText>
        <div className="minimalist__experience-footer">
          <NavigationHint appearance={appearance} />
          <Button appearance={appearance} className="minimalist__more" label={t('expand')} disabled />
        </div>
      </div>
    </div>
  );
}

function ProjectsPage({
  data,
  appearance,
  t,
  expandedProjectIds,
  onToggleProject,
}: {
  data: PortfolioData;
  appearance: MinimalistAppearance;
  t: (key: string, values?: Record<string, string | number>) => string;
  expandedProjectIds: ReadonlySet<string>;
  onToggleProject: (projectId: string) => void;
}) {
  // const snap = useMinimalistSnapScroll();
  const projectGridRef = useRef<HTMLDivElement | null>(null);
  const emphasis = useMinimalistCardEmphasis(projectGridRef);
  const hasExpandedProject = expandedProjectIds.size > 0;
  const [showProjectGradient, setShowProjectGradient] = useState(false);
  useLayoutEffect(() => {
    const grid = projectGridRef.current;
    if (!grid) return;
    const updateGradient = () => {
      setShowProjectGradient(grid.scrollTop + grid.clientHeight < grid.scrollHeight - 1);
    };
    updateGradient();
    grid.addEventListener('scroll', updateGradient, { passive: true });
    const resizeObserver = new ResizeObserver(updateGradient);
    resizeObserver.observe(grid);
    return () => {
      grid.removeEventListener('scroll', updateGradient);
      resizeObserver.disconnect();
    };
  }, []);
  // const handleProjectWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
  //   if (hasExpandedProject) return;
  //   snap.onWheel(event);
  // };
  const handleProjectGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!hasExpandedProject) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      expandedProjectIds.forEach((projectId) => onToggleProject(projectId));
      return;
    }
    const insideExpandedContent = (event.target as Element).closest('[data-project-expanded-content]');
    if (insideExpandedContent) return;
    // if (PROJECT_SNAP_KEYS.includes(event.key)) event.preventDefault();
  };
  const handleProjectScroll = (event: UIEvent<HTMLDivElement>) => {
    const lock = event.currentTarget.querySelector<HTMLElement>('[data-project-scroll-lock]');
    if (!lock) return;
    const scrollTop = Number(lock.dataset.projectScrollLock);
    if (Number.isFinite(scrollTop)) event.currentTarget.scrollTop = scrollTop;
  };

  return (
    <div className="minimalist__listing">
      <h1 className="sr-only">{t('titles.projects')}</h1>
      <div
        className={`minimalist__project-viewport${expandedProjectIds.size ? ' minimalist__project-viewport--expanded' : ''}`}
      >
        <div
          ref={(node) => {
            projectGridRef.current = node;
            // snap.viewportRef(node);
          }}
          className={`minimalist__project-grid${expandedProjectIds.size ? ' minimalist__project-grid--expanded' : ''}`}
          tabIndex={hasExpandedProject ? -1 : 0}
          onKeyDown={handleProjectGridKeyDown}
          // onTouchStart={guardSnapHandler(hasExpandedProject, snap.onTouchStart)}
          // onTouchMove={guardSnapHandler(hasExpandedProject, snap.onTouchMove)}
          // onTouchEnd={guardSnapHandler(hasExpandedProject, snap.onTouchEnd)}
          // onTouchCancel={guardSnapHandler(hasExpandedProject, () => snap.onTouchCancel())}
          onScroll={handleProjectScroll}
          // onWheel={handleProjectWheel}
          aria-label={t('titles.projects')}
        >
          {data.projects.length ? (
            data.projects.map((item) => {
              const projectId = `${item.company}-${item.projectName}`;
              const isExpanded = expandedProjectIds.has(projectId);
              const cardEmphasis = hasExpandedProject
                ? { active: false, dimmed: false }
                : emphasis.getCardEmphasis(projectId);
              return (
                <MinimalistCard
                  key={`${item.company}-${item.projectName}`}
                  data-project-card={projectId}
                  active={cardEmphasis.active}
                  dimmed={cardEmphasis.dimmed}
                  appearance={appearance}
                  eyebrow={`// ${item.projectName}`}
                  title={
                    isExpanded
                      ? item.projectUrl
                        ? t('viewProject')
                        : t('private')
                      : (item.dateNote ?? period(item.startDate, item.endDate, t('present')))
                  }
                  expansionId={projectId}
                  expanded={isExpanded}
                  onExpandedChange={() => onToggleProject(projectId)}
                  expansionLabel={t('expand')}
                  collapseLabel={t('collapse')}
                  footer={
                    <>
                      {isExpanded && <NavigationHint appearance={appearance} />}
                      {!isExpanded &&
                        (item.projectUrl ? (
                          <MinimalistAnchor appearance={appearance} href={item.projectUrl}>
                            {t('viewProject')}
                          </MinimalistAnchor>
                        ) : (
                          <span className="minimalist__project-status">{t('private')}</span>
                        ))}
                    </>
                  }
                  expandedContent={
                    <div className="minimalist-card__expanded-main">
                      <div className="minimalist-card__expanded-field">
                        <h3>{t('workedAs')}</h3>
                        <p>{item.expertiseArea}</p>
                      </div>
                      <div className="minimalist-card__expanded-field">
                        <h3>{t('developmentPeriod')}</h3>
                        <p>{item.dateNote ?? period(item.startDate, item.endDate, t('present'))}</p>
                      </div>
                      <div className="minimalist-card__expanded-field">
                        <h3>{t('servicesFor')}</h3>
                        <p>{item.company}</p>
                      </div>
                      <div className="minimalist-card__expanded-field">
                        <h3>{t('aboutProject')}</h3>
                        <MarkdownText>{item.desc}</MarkdownText>
                      </div>
                      <div className="minimalist-card__expanded-field">
                        <h3>{t('stack')}</h3>
                        <p>{item.stacks.join(' + ')}</p>
                      </div>
                    </div>
                  }
                >
                  <MarkdownText inline>{item.excerpt}</MarkdownText>
                </MinimalistCard>
              );
            })
          ) : (
            <EmptyState message={t('empty')} />
          )}
        </div>
        {showProjectGradient && !expandedProjectIds.size && (
          <span className="minimalist__project-gradient" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

function EducationPage({
  data,
  t,
}: {
  data: PortfolioData;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  return (
    <div className="minimalist__education">
      <h1 className="sr-only">{t('titles.education')}</h1>
      {data.education.length ? (
        <div className="minimalist__education-list">
          {data.education.map((item) => (
            <article key={`${item.title}-${item.year}`} className="minimalist__education-item">
              <h2>{item.title}</h2>
              <p>
                {t('educationConclusion', {
                  year: item.year,
                  city: item.city,
                  federation: item.federation,
                  country: item.country,
                })}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState message={t('empty')} />
      )}
    </div>
  );
}

export function MinimalistRecruiter({ data, locale, a11yOptions, toggleA11y }: RecruiterProps) {
  const t = useTranslations('minimalist.recruiter');
  const tA11y = useTranslations('minimalist.a11yPanel');
  const router = useRouter();
  const pathname = usePathname();
  const { appearance, changeAppearance } = useMinimalistAppearance();
  const [activeIndex, setActiveIndex] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);
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
  const footerViewportRef = useRef<HTMLDivElement>(null);
  const footerTrackRef = useRef<HTMLDivElement>(null);
  const activeOptionRef = useRef<HTMLButtonElement>(null);
  const footerWheelAccumulator = useRef(0);
  const footerNavigationLock = useRef(false);
  const focusCenterPending = useRef(false);
  const [footerTranslate, setFooterTranslate] = useState(0);
  const hasExpandedProject = expandedProjectIds.size > 0;
  const pages: RecruiterPage[] = [
    { id: 'about', label: t('pages.about') },
    { id: 'projects', label: t('pages.projects') },
    { id: 'experience', label: t('pages.experience') },
    { id: 'education', label: t('pages.education') },
  ];
  const selectPage = useCallback(
    (index: number) => {
      if (hasExpandedProject) return false;
      const nextIndex = circularIndex(index, pages.length);
      setActiveIndex(nextIndex);
      const changed = nextIndex !== activeIndex;
      if (changed) playSectionChangeSound();
      return changed;
    },
    [activeIndex, hasExpandedProject, pages.length, playSectionChangeSound],
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
    if (hasExpandedProject) {
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
    if (hasExpandedProject) {
      event.preventDefault();
      return;
    }
    if (selectFooterPage(index)) focusCenterPending.current = true;
  };
  const handleWheel = useCallback(
    (event: globalThis.WheelEvent) => {
      if (a11yOpen) return;
      if (hasExpandedProject) {
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
        if (!atTop && !atBottom) return;
      }
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
    [a11yOpen, hasExpandedProject, moveFooterPage],
  );
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    main.addEventListener('wheel', handleWheel, { passive: false });
    return () => main.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);
  const changeLocale = (nextLocale: 'en' | 'pt-BR') => {
    writeStoredPreference(LOCALE_STORAGE_KEY, nextLocale);
    router.replace(pathname, { locale: nextLocale });
  };
  const logo = appearance === 'light' ? '/logo-light.svg' : '/logo-dark.svg';

  return (
    <MinimalistSoundPreferenceProvider enabled={soundEffectsEnabled}>
      <MotionConfig reducedMotion="user">
        <main
          className={`minimalist-theme minimalist-theme--${appearance}${hasExpandedProject ? ' minimalist-theme--project-expanded' : ''}`}
          id="main-content"
        >
          <header className="minimalist__header">
            <div className="minimalist__header-tools">
              <I18nToggle appearance={appearance} locale={locale} onChange={changeLocale} />
              <Divider appearance={appearance} variant="v2" orientation="vertical" />
              <ThemeToggle appearance={appearance} onChange={changeAppearance} />
            </div>
            <Image className="minimalist__logo" src={logo} alt={data.name} width={73} height={21} />
            <div className="minimalist__header-tools minimalist__header-tools--right">
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
          <div ref={mainRef} className="minimalist__main">
            <MinimalistA11yPanel appearance={appearance} open={a11yOpen} options={a11yOptions} onToggle={toggleA11y} />
            <div
              className="minimalist__side-pagination"
              aria-hidden={a11yOpen || hasExpandedProject}
              inert={a11yOpen || hasExpandedProject ? true : undefined}
            >
              <StepPagination
                appearance={appearance}
                currentStep={activeIndex + 1}
                totalSteps={pages.length}
                onStepChange={selectPage}
              />
            </div>
            <div
              className="minimalist__content"
              aria-live="polite"
              aria-hidden={a11yOpen}
              inert={a11yOpen ? true : undefined}
            >
              <motion.div
                className="minimalist__content-track"
                animate={{ y: `${activeIndex * -25}%` }}
                transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
              >
                {pages.map((page, index) => (
                  <section
                    key={page.id}
                    className="minimalist__page"
                    aria-labelledby={`minimalist-page-${page.id}`}
                    aria-hidden={index !== activeIndex}
                    inert={index !== activeIndex ? true : undefined}
                  >
                    <div className="minimalist__page-content" id={`minimalist-page-${page.id}`}>
                      {page.id === 'about' && <AboutPage data={data} appearance={appearance} t={t} />}
                      {page.id === 'experience' && <ExperiencePage data={data} appearance={appearance} t={t} />}
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
          </div>
          <footer
            className="minimalist__footer"
            aria-hidden={hasExpandedProject}
            inert={hasExpandedProject ? true : undefined}
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
                  className="minimalist__footer-viewport"
                  role="group"
                  aria-label={t('footerNavigation')}
                >
                  <div
                    ref={footerTrackRef}
                    className="minimalist__footer-track"
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
                          className={`minimalist__footer-option${isActive ? ' minimalist__footer-option--active' : ''}`}
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
                          <span className="minimalist__footer-divider" aria-hidden="true">
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
        </main>
      </MotionConfig>
    </MinimalistSoundPreferenceProvider>
  );
}
