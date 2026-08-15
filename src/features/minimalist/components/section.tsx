'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type RefObject, type UIEvent } from 'react';

import { MarkdownText } from '@/shared/components/markdown-text';
import type { ExperienceEntry, PortfolioData } from '@/shared/types/portfolio';

import { nextCircularIndex } from '../a11y';
import { useMinimalistCardEmphasis } from '../hooks/use-minimalist-card-emphasis';
import { useMinimalistFlipLayout } from '../hooks/use-minimalist-flip';
import { MINIMALIST_DEFAULT_SOUND_KEY } from '../sound-catalog';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistAppearance } from '../types';
import { MinimalistAnchor } from './anchor';
import { Button } from './button';
import { MinimalistCard } from './card';
import { Divider } from './divider';
import { NavigationHint } from './navigation';
import { MinimalistWindowedList } from './windowed-list';

function period(start: string, end: string | null | undefined, present: string): string {
  const from = new Date(start).toISOString().slice(0, 7).replace('-', '/');
  const to = end ? new Date(end).toISOString().slice(0, 7).replace('-', '/') : present;
  return `${from} - ${to}`;
}

function EmptyState({ message }: { message: string }) {
  return <p className="minimalist__empty">{message}</p>;
}

export function AboutPage({
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

export function ExperiencePage({
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
        <div className="minimalist__experience-list" inert={expanded || undefined}>
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
          className="minimalist__experience-detail-slot minimalist__experience-detail-slot--responsive"
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

export function ProjectsPage({
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
                  meta={item.dateNote ?? period(item.startDate, item.endDate, t('present'))}
                  metaExpanded={item.projectUrl ? t('viewProject') : t('private')}
                  expansionId={projectId}
                  expanded={isExpanded}
                  onExpandedChange={() => onToggleProject(projectId)}
                  expansionLabel={t('expand')}
                  collapseLabel={t('collapse')}
                  footer={
                    <>
                      <span className="minimalist-card__footer-hint">
                        <NavigationHint appearance={appearance} />
                      </span>
                      <span className="minimalist-card__footer-primary">
                        {item.projectUrl ? (
                          <MinimalistAnchor appearance={appearance} href={item.projectUrl}>
                            {t('viewProject')}
                          </MinimalistAnchor>
                        ) : (
                          <span className="minimalist__project-status">{t('private')}</span>
                        )}
                      </span>
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

export function EducationPage({
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
