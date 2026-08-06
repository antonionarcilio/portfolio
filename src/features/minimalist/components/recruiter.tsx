'use client';

import { MotionConfig, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type UIEvent,
  type WheelEvent,
} from 'react';

import dividerV1 from '@/_assets/icons/divider-v1.svg';

import { usePathname, useRouter } from '@/i18n/navigation';
import { MarkdownText } from '@/shared/components/markdown-text';
import type { ExperienceEntry, PortfolioData } from '@/shared/types/portfolio';

import { MINIMALIST_A11Y_OPTION_KEYS, useMinimalistA11y } from '../a11y';
import { MinimalistSoundPreferenceProvider } from '../contexts/sound-preference-context';
import { useMinimalistAppearance } from '../hooks/use-minimalist-appearance';
import { useIsMinimalistSoundLocked } from '../hooks/use-minimalist-mobile-lock';
import { useMinimalistSnapScroll } from '../hooks/use-minimalist-snap-scroll';
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
type RecruiterProps = { data: PortfolioData; locale: 'en' | 'pt-BR' };

function period(start: string, end: string | null | undefined, present: string): string {
  const from = new Date(start).toISOString().slice(0, 7).replace('-', '/');
  const to = end ? new Date(end).toISOString().slice(0, 7).replace('-', '/') : present;
  return `${from} - ${to}`;
}

function EmptyState({ message }: { message: string }) {
  return <p className="minimalist__empty">{message}</p>;
}

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
  const snap = useMinimalistSnapScroll();
  const projectGridRef = useRef<HTMLDivElement | null>(null);
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
  const handleProjectWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (expandedProjectIds.size && !(event.target as Element).closest('[data-project-expanded-content]')) return;
    snap.onWheel(event);
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
            snap.viewportRef(node);
          }}
          className={`minimalist__project-grid${expandedProjectIds.size ? ' minimalist__project-grid--expanded' : ''}`}
          tabIndex={0}
          onKeyDown={snap.onKeyDown}
          onTouchStart={snap.onTouchStart}
          onTouchMove={snap.onTouchMove}
          onTouchEnd={snap.onTouchEnd}
          onTouchCancel={snap.onTouchCancel}
          onScroll={handleProjectScroll}
          onWheel={handleProjectWheel}
          aria-label={t('titles.projects')}
        >
          {data.projects.length ? (
            data.projects.map((item) => {
              const projectId = `${item.company}-${item.projectName}`;
              const isExpanded = expandedProjectIds.has(projectId);
              return (
                <MinimalistCard
                  key={`${item.company}-${item.projectName}`}
                  data-project-card="true"
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

export function MinimalistRecruiter({ data, locale }: RecruiterProps) {
  const t = useTranslations('minimalist.recruiter');
  const tA11y = useTranslations('minimalist.a11yPanel');
  const router = useRouter();
  const pathname = usePathname();
  const { appearance, changeAppearance } = useMinimalistAppearance();
  const [activeIndex, setActiveIndex] = useState(0);
  const [a11yOpen, setA11yOpen] = useState(false);
  const a11yTriggerRef = useRef<HTMLButtonElement>(null);
  const { options: a11yOptions, toggle: toggleA11y } = useMinimalistA11y();
  const isSoundLocked = useIsMinimalistSoundLocked();
  const soundEffectsEnabled = a11yOptions.soundEffects && !isSoundLocked;
  const { play: playExitSound } = useMinimalistSoundEffects('mouseClickClose', soundEffectsEnabled);
  const closeA11yPanel = () => {
    setA11yOpen(false);
    window.requestAnimationFrame(() => a11yTriggerRef.current?.focus());
  };
  const [expandedProjectIds, setExpandedProjectIds] = useState<ReadonlySet<string>>(new Set());
  const navigationLock = useRef(false);
  const footerTrackRef = useRef<HTMLDivElement>(null);
  const footerFocusPending = useRef(false);
  const [footerPosition, setFooterPosition] = useState(2);
  const [footerTranslate, setFooterTranslate] = useState(0);
  const [footerTransitionEnabled, setFooterTransitionEnabled] = useState(true);
  const hasExpandedProject = expandedProjectIds.size > 0;
  const pages: RecruiterPage[] = [
    { id: 'about', label: t('pages.about') },
    { id: 'projects', label: t('pages.projects') },
    { id: 'experience', label: t('pages.experience') },
    { id: 'education', label: t('pages.education') },
  ];
  const footerPages = Array.from(
    { length: pages.length * 3 },
    (_, index) => pages[circularIndex(index - 2, pages.length)],
  );
  const acquireNavigationLock = () => {
    if (navigationLock.current) return false;
    navigationLock.current = true;
    window.setTimeout(() => {
      navigationLock.current = false;
    }, 1000);
    return true;
  };
  const selectPage = (index: number) => {
    if (hasExpandedProject) return false;
    if (!acquireNavigationLock()) return false;
    const nextIndex = circularIndex(index, pages.length);
    setActiveIndex(nextIndex);
    setFooterPosition(2 + nextIndex);
    return true;
  };
  const movePage = (delta: number) => {
    if (hasExpandedProject) return false;
    if (delta === 0 || !acquireNavigationLock()) return false;
    const nextPosition = footerPosition + delta;
    setFooterPosition(nextPosition);
    setActiveIndex(circularIndex(nextPosition - 2, pages.length));
    return true;
  };
  const toggleProject = (projectId: string) => {
    setExpandedProjectIds((current) => {
      const next = new Set(current);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  };
  useLayoutEffect(() => {
    const track = footerTrackRef.current;
    const active = track?.querySelector<HTMLElement>(`[data-footer-position="${footerPosition}"]`);
    const viewport = track?.parentElement;
    if (!track || !active || !viewport) return;
    const viewportRect = viewport.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const viewportCenter = viewportRect.left + viewportRect.width / 2;
    const activeCenter = activeRect.left + activeRect.width / 2;
    setFooterTranslate((current) => current + viewportCenter - activeCenter);
    if (footerFocusPending.current) {
      window.requestAnimationFrame(() => {
        if (!footerFocusPending.current) return;
        footerFocusPending.current = false;
        active.querySelector<HTMLButtonElement>('.minimalist-switch-btn')?.focus({ preventScroll: true });
      });
    }
  }, [footerPosition]);
  useLayoutEffect(() => {
    if (footerPosition > 1 && footerPosition < footerPages.length - 2) return;
    const resetPosition = footerPosition <= 1 ? footerPosition + pages.length : footerPosition - pages.length;
    const timer = window.setTimeout(() => {
      setFooterTransitionEnabled(false);
      setFooterPosition(resetPosition);
      window.requestAnimationFrame(() => setFooterTransitionEnabled(true));
    }, 600);
    return () => window.clearTimeout(timer);
  }, [footerPages.length, footerPosition, pages.length]);
  const scheduleFooterItemFocus = () => {
    window.setTimeout(() => {
      if (!footerFocusPending.current) return;
      footerFocusPending.current = false;
      footerTrackRef.current
        ?.querySelector<HTMLButtonElement>('.minimalist-switch-btn--current')
        ?.focus({ preventScroll: true });
    }, 550);
  };
  const handleFooterItemKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (hasExpandedProject) {
      event.preventDefault();
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    footerFocusPending.current = true;
    if (movePage(event.key === 'ArrowRight' ? 1 : -1)) scheduleFooterItemFocus();
  };
  const handleFooterItemClick = (event: MouseEvent<HTMLButtonElement>, index: number) => {
    if (hasExpandedProject) {
      event.preventDefault();
      return;
    }
    if (!selectPage(index)) return;
    footerFocusPending.current = true;
    event.currentTarget.focus({ preventScroll: true });
    window.setTimeout(
      () => footerTrackRef.current?.querySelector<HTMLButtonElement>('.minimalist-switch-btn--current')?.focus(),
      700,
    );
  };
  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (hasExpandedProject) {
      event.preventDefault();
      return;
    }
    if (Math.abs(event.deltaY) < 20) return;
    movePage(event.deltaY > 0 ? 1 : -1);
  };
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
          <div className="minimalist__main" onWheel={handleWheel}>
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
                <PaginationButton appearance={appearance} direction="previous" onClick={() => movePage(-1)} />
                <div className="minimalist__footer-viewport" role="group" aria-label={t('footerNavigation')}>
                  <motion.div
                    ref={footerTrackRef}
                    className={`minimalist__footer-track${footerTransitionEnabled ? ' minimalist__footer-track--ready' : ''}`}
                    animate={{ x: footerTranslate }}
                    transition={
                      footerTransitionEnabled ? { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] } : { duration: 0 }
                    }
                  >
                    {footerPages.map((page, index) => (
                      <div
                        key={`${page.id}-${index}`}
                        className={`minimalist__footer-option${index === footerPosition ? ' minimalist__footer-option--active' : ''}`}
                        data-footer-position={index}
                      >
                        <MinimalistSwitchBtn
                          appearance={appearance}
                          current={index === footerPosition}
                          label={page.label}
                          onClick={(event) =>
                            handleFooterItemClick(
                              event,
                              pages.findIndex((item) => item.id === page.id),
                            )
                          }
                          onKeyDown={handleFooterItemKeyDown}
                          tabIndex={index === footerPosition ? 0 : -1}
                        />
                        <span className="minimalist__footer-divider" aria-hidden="true">
                          <Image src={dividerV1} alt="" width={6} height={13} />
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </div>
                <PaginationButton appearance={appearance} direction="next" onClick={() => movePage(1)} />
              </>
            )}
          </footer>
        </main>
      </MotionConfig>
    </MinimalistSoundPreferenceProvider>
  );
}
