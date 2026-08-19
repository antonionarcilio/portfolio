'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type RefObject, type UIEvent } from 'react';

import { MarkdownText } from '@/shared/components/markdown-text';
import type { ExperienceEntry, PortfolioData } from '@/shared/types/portfolio';

import { nextCircularIndex } from '../a11y';
import { minimalistExpansionTransition, minimalistFadeTransition } from '../animations';
import { useMinimalistCardEmphasis } from '../hooks/use-minimalist-card-emphasis';
import { useMinimalistCardFlip } from '../hooks/use-minimalist-card-flip';
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
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [showExpandedGradient, setShowExpandedGradient] = useState(false);
  // The viewport never scrolls, so the flip's scroll-lock callbacks stay at their no-op default
  // (unlike the project grid in `card.tsx`, which needs them).
  const flip = useMinimalistCardFlip({ containerRef: viewportRef, expanded });

  const handleExpandedChange = () => {
    flip.requestExpand();
    playExpandSound();
    onExpandedChange();
  };
  useEffect(() => {
    // Guarantees the trigger (already focused in the common click/keyboard-activation path)
    // owns keyboard focus once expanded, so Escape reaches handleViewportKeyDown.
    if (expanded) window.requestAnimationFrame(() => triggerRef.current?.focus());
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
          ref={flip.slotRef}
          className="minimalist__experience-detail-slot minimalist__experience-detail-slot--responsive"
          style={flip.slotSize ? { height: flip.slotSize.height, width: flip.slotSize.width } : undefined}
        >
          {flip.isOverlay && <span className="minimalist__experience-detail-slot__placeholder" aria-hidden="true" />}
          <motion.div
            key={flip.overlayCycle}
            data-expanded={expanded ? 'true' : 'false'}
            animate={flip.isOverlay && flip.overlayGeometry ? flip.overlayGeometry[flip.overlayTarget] : {}}
            transition={flip.isSeedingOverlay ? { duration: 0 } : minimalistExpansionTransition}
            className={clsx(
              'minimalist__experience-detail',
              flip.showExpandedLayout && 'minimalist__experience-detail--expanded',
              flip.isOverlay && 'minimalist__experience-detail--overlay',
            )}
          >
            <div
              className={clsx(
                'minimalist__experience-detail-body',
                flip.showExpandedLayout ? 'minimalist__experience-detail-body--expanded' : 'flex flex-col gap-[22px]',
              )}
            >
              <div className="minimalist__experience-header minimalist__experience-header--collapsed flex items-center justify-between">
                <p className="minimalist__experience-kicker">{`// ${current.role}`}</p>
                <span className="minimalist__experience-period">
                  {period(current.startDate, current.endDate, t('present'))}
                </span>
              </div>
              <div className="minimalist__experience-header minimalist__experience-header--expanded flex items-center justify-between">
                <p className="minimalist__experience-kicker">{`// ${current.companyAliases.join(' | ')}`}</p>
                {current.employmentType && (
                  <span className="minimalist__experience-period">{current.employmentType}</span>
                )}
              </div>

              {/* Collapsed and expanded content stay mounted at all times — same rule as the header
                  above and `card.tsx`'s footer trigger — and are toggled purely by CSS off
                  `.minimalist__experience-detail--expanded`. Wrapping either in a JSX/JS conditional
                  would unmount it mid-transition (as the footer's nav hint did), which both defeats
                  the "persistent content" contract this FLIP technique relies on and can drop focus. */}
              <div className="minimalist__experience-description">
                <MarkdownText inline>{current.excerpt}</MarkdownText>
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
                  <div className="minimalist__experience-expanded-excerpt">
                    <MarkdownText inline>{current.excerpt}</MarkdownText>
                  </div>
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

              <div className="minimalist__experience-footer flex items-center">
                <motion.span
                  className="minimalist__experience-footer-hint"
                  animate={{ opacity: flip.showExpandedLayout ? 1 : 0 }}
                  transition={minimalistFadeTransition}
                  aria-hidden={!flip.showExpandedLayout}
                >
                  <NavigationHint appearance={appearance} />
                </motion.span>
                <Button
                  ref={triggerRef}
                  appearance={appearance}
                  className="minimalist__more minimalist__experience-trigger"
                  label={expanded ? t('collapse') : t('expand')}
                  aria-expanded={expanded}
                  onPointerDown={() => {
                    if (!expanded) flip.captureExpansionGeometry();
                  }}
                  onClick={handleExpandedChange}
                />
              </div>
            </div>
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
                    <div className="minimalist-card__expanded-main grid gap-4 mt-4">
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
