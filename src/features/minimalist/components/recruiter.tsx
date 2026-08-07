'use client';

import clsx from 'clsx';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
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
  type RefObject,
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
  nextCircularIndex,
  type MinimalistA11yKey,
  type MinimalistA11yOptions,
} from '../a11y';
import { MinimalistSoundPreferenceProvider } from '../contexts/sound-preference-context';
import { useMinimalistAppearance } from '../hooks/use-minimalist-appearance';
import { useMinimalistCardEmphasis } from '../hooks/use-minimalist-card-emphasis';
import { useMinimalistFlipLayout } from '../hooks/use-minimalist-flip';
import { useIsMinimalistSoundLocked } from '../hooks/use-minimalist-mobile-lock';
import { MINIMALIST_DEFAULT_SOUND_KEY } from '../sound-catalog';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistAppearance } from '../types';
import { circularIndex } from '../utils/circular-index';
import { LOCALE_STORAGE_KEY, writeStoredPreference } from '../utils/preferences';
import { MinimalistA11yPanel } from './a11y-panel';
import { MinimalistA11yTrigger } from './a11y-trigger';
import { AboutBioPanel } from './about-bio-panel';
import { MinimalistAnchor } from './anchor';
import { Button } from './button';
import { MinimalistCard } from './card';
import { Divider } from './divider';
import { NavigationHint, StepPagination } from './navigation';
import { PaginationButton } from './navigation-menu';
import { MinimalistSwitchBtn } from './switch-btn';
import { I18nToggle, ModeToggle, ThemeToggle } from './switches';
import { MinimalistWindowedList } from './windowed-list';

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

function AboutPage({
  data,
  appearance,
  t,
  shortBio,
  hasMoreBioContent,
  isExpanded,
  onExpand,
  expandTriggerRef,
}: {
  data: PortfolioData;
  appearance: MinimalistAppearance;
  t: (key: string, values?: Record<string, string | number>) => string;
  shortBio: string;
  hasMoreBioContent: boolean;
  isExpanded: boolean;
  onExpand: () => void;
  expandTriggerRef: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <div className="minimalist__about flex items-start gap-8">
      <div className="minimalist__portrait" aria-hidden="true">
        {data.avatarUrl && <Image src={data.avatarUrl} alt="" width={168} height={168} priority />}
      </div>
      <div className="minimalist__about-copy grid gap-4">
        <p className="minimalist__about-kicker">{t('aboutKicker')}</p>
        <h1>
          {data.name}
          <Divider appearance={appearance} variant="v1" orientation="vertical" />
          <span className="minimalist__about-role">{data.role}</span>
        </h1>
        <p className="minimalist__about-location">{t('locationSuffix', { location: data.location })}</p>
        <MarkdownText>{shortBio}</MarkdownText>
        {hasMoreBioContent && (
          <Button
            ref={expandTriggerRef}
            appearance={appearance}
            className="minimalist__more"
            label={t('aboutExpand')}
            aria-expanded={isExpanded}
            aria-controls="minimalist-about-bio-panel"
            onClick={onExpand}
          />
        )}
        <div className="minimalist__about-meta flex flex-wrap items-center gap-x-3.5 gap-y-2 mt-[6px]">
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

type ExperienceDetailBounds = { top: number; left: number; width: number; height: number };

function ExperiencePage({
  data,
  appearance,
  t,
  soundEffectsEnabled,
  expanded,
  onExpandedChange,
}: {
  data: PortfolioData;
  appearance: MinimalistAppearance;
  t: (key: string) => string;
  soundEffectsEnabled: boolean;
  expanded: boolean;
  onExpandedChange: () => void;
}) {
  const [selected, setSelected] = useState(0);
  const entries: ExperienceEntry[] = data.experience;
  const current = entries[selected];
  const { play: playChangeSound } = useMinimalistSoundEffects(MINIMALIST_DEFAULT_SOUND_KEY, soundEffectsEnabled);
  const { play: playExpandSound } = useMinimalistSoundEffects('mouseClickClose', soundEffectsEnabled);
  const moveSelection = (direction: -1 | 1) => {
    setSelected((current) => nextCircularIndex(current, direction, entries.length));
    playChangeSound();
  };

  const viewportRef = useRef<HTMLDivElement>(null);
  const detailSlotRef = useRef<HTMLDivElement>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const collapseTriggerRef = useRef<HTMLButtonElement>(null);
  const wasExpandedRef = useRef(expanded);
  const expansionGeometryCapturedRef = useRef(false);
  const [detailSlotSize, setDetailSlotSize] = useState<{ height: number; width: number } | null>(null);
  const [expandedBounds, setExpandedBounds] = useState<ExperienceDetailBounds | null>(null);
  const [isOverlay, setIsOverlay] = useState(false);
  const [showExpandedGradient, setShowExpandedGradient] = useState(false);
  // Stable layoutId: there is only ever one detail panel — it must not change when the
  // selected company changes, only when expanded/collapsed (unlike Projects, where each
  // card is its own persistent element and genuinely needs a per-item layoutId).
  const flipLayout = useMinimalistFlipLayout('experience-detail', expanded);

  const captureExpansionGeometry = () => {
    const slot = detailSlotRef.current?.getBoundingClientRect();
    const viewport = viewportRef.current?.getBoundingClientRect();
    if (slot) setDetailSlotSize({ height: slot.height, width: slot.width });
    if (viewport) setExpandedBounds({ top: 0, left: 0, width: viewport.width, height: viewport.height });
  };
  const handleExpandedChange = () => {
    if (!expanded) {
      if (!expansionGeometryCapturedRef.current) captureExpansionGeometry();
      setIsOverlay(true);
      expansionGeometryCapturedRef.current = false;
    }
    playExpandSound();
    onExpandedChange();
  };
  useEffect(() => {
    // Moves focus into the expanded panel so it (not <body>) owns keyboard focus —
    // otherwise Escape never reaches handleViewportKeyDown once the trigger button unmounts.
    if (expanded) window.requestAnimationFrame(() => collapseTriggerRef.current?.focus());
  }, [expanded]);
  useLayoutEffect(() => {
    const wasExpanded = wasExpandedRef.current;
    wasExpandedRef.current = expanded;
    if (expanded || !wasExpanded) return;
    const slot = detailSlotRef.current;
    const slotBounds = slot?.getBoundingClientRect();
    const viewport = viewportRef.current;
    const viewportBounds = viewport?.getBoundingClientRect();
    if (slotBounds && viewport && viewportBounds) {
      setExpandedBounds({
        top: slotBounds.top - viewportBounds.top,
        left: slotBounds.left - viewportBounds.left,
        width: slotBounds.width,
        height: slotBounds.height,
      });
    }
    const shouldRestoreFocus = !!slot && !!document.activeElement && slot.contains(document.activeElement);
    const timer = window.setTimeout(() => {
      setDetailSlotSize(null);
      setExpandedBounds(null);
      setIsOverlay(false);
      if (shouldRestoreFocus) slot?.querySelector<HTMLButtonElement>('[aria-expanded]')?.focus();
    }, 500);
    return () => window.clearTimeout(timer);
  }, [expanded]);
  useLayoutEffect(() => {
    const content = expandedContentRef.current;
    if (!expanded || !content) {
      setShowExpandedGradient(false);
      return;
    }
    const updateGradient = () => {
      const hasOverflow = content.scrollHeight > content.clientHeight + 1;
      const atEnd = content.scrollTop + content.clientHeight >= content.scrollHeight - 1;
      setShowExpandedGradient(hasOverflow && !atEnd);
    };
    updateGradient();
    content.addEventListener('scroll', updateGradient, { passive: true });
    const resizeObserver = new ResizeObserver(updateGradient);
    resizeObserver.observe(content);
    return () => {
      content.removeEventListener('scroll', updateGradient);
      resizeObserver.disconnect();
    };
  }, [expanded, current]);
  const handleViewportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!expanded || event.key !== 'Escape') return;
    event.preventDefault();
    handleExpandedChange();
  };

  if (!entries.length) return <EmptyState message={t('empty')} />;
  return (
    <div ref={viewportRef} className="minimalist__experience-viewport relative" onKeyDown={handleViewportKeyDown}>
      <div className="minimalist__experience grid items-center gap-16">
        <div inert={expanded || undefined}>
          <MinimalistWindowedList
            items={entries.map((entry, index) => ({ key: String(index), label: entry.company }))}
            selectedIndex={selected}
            ariaLabel={t('labels.experience')}
            idPrefix="minimalist-experience-option"
            onSelect={setSelected}
            onWheelConfirm={moveSelection}
          />
        </div>
        <div
          ref={detailSlotRef}
          className="minimalist__experience-detail-slot"
          style={detailSlotSize ? { height: detailSlotSize.height, width: detailSlotSize.width } : undefined}
        >
          {isOverlay && <span className="minimalist__experience-detail-slot__placeholder" aria-hidden="true" />}
          <motion.div
            {...flipLayout}
            // Only re-measure/animate layout when expand state itself changes — otherwise
            // switching the selected company (a same-size-class content swap) would also
            // animate, which reads as an unwanted shift. Matches the a11y menu, where
            // switching the selected option never animates.
            layoutDependency={expanded}
            style={isOverlay && expandedBounds ? expandedBounds : undefined}
            className={clsx(
              'minimalist__experience-detail',
              expanded && 'minimalist__experience-detail--expanded',
              isOverlay && 'minimalist__experience-detail--overlay',
            )}
          >
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  key="expanded"
                  className="minimalist__experience-detail-body minimalist__experience-detail-body--expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <div className="flex items-center justify-between">
                    <p className="minimalist__experience-kicker">{`// ${current.companyAliases.join(' | ')}`}</p>
                    {current.employmentType && (
                      <span className="minimalist__experience-period">{current.employmentType}</span>
                    )}
                  </div>
                  <div
                    className="minimalist__experience-expanded-content-shell"
                    onWheel={(event) => event.stopPropagation()}
                  >
                    <div
                      ref={expandedContentRef}
                      className="minimalist__experience-expanded-fields"
                      data-project-expanded-content="true"
                      tabIndex={0}
                      onWheel={(event) => event.stopPropagation()}
                    >
                      <div className="minimalist__experience-expanded-field">
                        <h3>{t('experienceRoleLabel')}</h3>
                        <p>{current.role}</p>
                      </div>
                      <div className="minimalist__experience-expanded-field">
                        <h3>{t('experiencePeriodLabel')}</h3>
                        <p>{period(current.startDate, current.endDate, t('present'))}</p>
                      </div>
                      <div className="minimalist__experience-expanded-field">
                        <h3>{t('experienceAboutLabel')}</h3>
                        <MarkdownText>{current.details}</MarkdownText>
                      </div>
                    </div>
                    {showExpandedGradient && (
                      <span className="minimalist__experience-expanded-gradient" aria-hidden="true" />
                    )}
                  </div>
                  <div className="minimalist__experience-footer flex items-center justify-between">
                    <NavigationHint appearance={appearance} />
                    <Button
                      ref={collapseTriggerRef}
                      appearance={appearance}
                      className="minimalist__more"
                      label={t('collapse')}
                      aria-expanded={true}
                      onClick={handleExpandedChange}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  className="minimalist__experience-detail-body flex flex-col gap-[22px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <div className="flex items-center justify-between">
                    <p className="minimalist__experience-kicker">{`// ${current.role}`}</p>
                    <span className="minimalist__experience-period">
                      {period(current.startDate, current.endDate, t('present'))}
                    </span>
                  </div>
                  <div className="minimalist__experience-description">
                    <MarkdownText inline>{current.excerpt}</MarkdownText>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      appearance={appearance}
                      className="minimalist__more"
                      label={t('expand')}
                      aria-expanded={false}
                      onPointerDown={() => {
                        captureExpansionGeometry();
                        expansionGeometryCapturedRef.current = true;
                      }}
                      onClick={handleExpandedChange}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
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
  const handleProjectGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!hasExpandedProject) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      expandedProjectIds.forEach((projectId) => onToggleProject(projectId));
      return;
    }
    const insideExpandedContent = (event.target as Element).closest('[data-project-expanded-content]');
    if (insideExpandedContent) return;
  };
  const handleProjectScroll = (event: UIEvent<HTMLDivElement>) => {
    const lock = event.currentTarget.querySelector<HTMLElement>('[data-project-scroll-lock]');
    if (!lock) return;
    const scrollTop = Number(lock.dataset.projectScrollLock);
    if (Number.isFinite(scrollTop)) event.currentTarget.scrollTop = scrollTop;
  };

  return (
    <div className="minimalist__listing grid h-full content-center justify-items-center gap-7 text-center">
      <h1 className="sr-only">{t('titles.projects')}</h1>
      <div
        className={`minimalist__project-viewport${expandedProjectIds.size ? ' minimalist__project-viewport--expanded' : ''}`}
      >
        <div
          ref={projectGridRef}
          className={`minimalist__project-grid${expandedProjectIds.size ? ' minimalist__project-grid--expanded' : ''}`}
          tabIndex={hasExpandedProject ? -1 : 0}
          onKeyDown={handleProjectGridKeyDown}
          onScroll={handleProjectScroll}
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
                    <div className="minimalist-card__expanded-main grid gap-4">
                      <div className="minimalist-card__expanded-field grid gap-1.5">
                        <h3>{t('workedAs')}</h3>
                        <p>{item.expertiseArea}</p>
                      </div>
                      <div className="minimalist-card__expanded-field grid gap-1.5">
                        <h3>{t('developmentPeriod')}</h3>
                        <p>{item.dateNote ?? period(item.startDate, item.endDate, t('present'))}</p>
                      </div>
                      <div className="minimalist-card__expanded-field grid gap-1.5">
                        <h3>{t('servicesFor')}</h3>
                        <p>{item.company}</p>
                      </div>
                      <div className="minimalist-card__expanded-field grid gap-1.5">
                        <h3>{t('aboutProject')}</h3>
                        <MarkdownText>{item.desc}</MarkdownText>
                      </div>
                      <div className="minimalist-card__expanded-field grid gap-1.5">
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
    <div className="minimalist__education grid h-full content-center justify-items-center gap-7 text-center">
      <h1 className="sr-only">{t('titles.education')}</h1>
      {data.education.length ? (
        <div className="minimalist__education-list grid gap-6">
          {data.education.map((item) => (
            <article key={`${item.title}-${item.year}`} className="minimalist__education-item flex flex-col gap-[10px]">
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
