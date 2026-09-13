'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';

import { MarkdownText } from '@/shared/components/markdown-text';
import { PlainText } from '@/shared/components/plain-text';
import type { ExperienceEntry, PortfolioData } from '@/shared/types/portfolio';

import { minimalistFadeTransition } from '../animations';
import { useMinimalistCardEmphasis } from '../hooks/use-minimalist-card-emphasis';
import { useScrollEdges } from '../hooks/use-scroll-edges';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistAppearance } from '../types';
import { scrollExpandedContent } from '../utils/scroll-expanded-content';
import { AnimatedIcon } from './animated-icon';
import { Button } from './button';
import { MinimalistCard } from './card';
import { ContactLinks } from './contact-links';
import { Divider } from './divider';
import { ProjectExpandedPanel } from './project-expanded-panel';
import { TimelineExperience } from './timeline';

function period(start: string, end: string | null | undefined, present: string): string {
  const from = new Date(start).toISOString().slice(0, 7).replace('-', '/');
  const to = end ? new Date(end).toISOString().slice(0, 7).replace('-', '/') : present;
  return `${from} - ${to}`;
}

function year(date: string | null | undefined, fallback: string): string {
  return date ? String(new Date(date).getUTCFullYear()) : fallback;
}

function monthYear(date: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(new Date(date));
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
    <div className="minimalist__about-wrapper flex max-w-[880px] flex-col items-center gap-[72px]">
      <div className="minimalist__about-contact invisible flex w-full justify-center" aria-hidden="true">
        <ContactLinks data={data} appearance={appearance} />
      </div>
      <div className="minimalist__about flex items-start gap-8">
        <div className="minimalist__portrait" aria-hidden="true">
          {data.avatarUrl && <Image src={data.avatarUrl} alt="" width={168} height={168} priority />}
        </div>
        <div className="minimalist__about-copy grid max-w-[390px] gap-4">
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
              variant="secondary"
              className="minimalist__more"
              label={t('aboutExpand')}
              icon={<AnimatedIcon icon="chevrons-up-down" size={16} />}
              aria-expanded={isExpanded}
              aria-controls="minimalist-about-bio-panel"
              onClick={onExpand}
            />
          )}
        </div>
      </div>
      <div className="minimalist__about-contact flex w-full justify-center">
        <ContactLinks data={data} appearance={appearance} />
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
  t: (key: string, values?: Record<string, string | number>) => string;
  soundEffectsEnabled: boolean;
  expanded: boolean;
  onExpandedChange: () => void;
}) {
  const current: ExperienceEntry | undefined = data.experience[0];
  const locale = useLocale();
  const { play: playExpandSound } = useMinimalistSoundEffects('mouseClickClose', soundEffectsEnabled);
  const expandedFieldsRef = useRef<HTMLDivElement>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const metaColumnRef = useRef<HTMLDivElement>(null);
  // Focus the scroll area the moment the expanded view mounts (AnimatePresence mode="wait" delays
  // that mount past any rAF), so ArrowUp/Down scroll the content instead of focus landing on <body>.
  const focusExpandedFields = useCallback((node: HTMLDivElement | null) => {
    expandedFieldsRef.current = node;
    node?.focus({ preventScroll: true });
  }, []);
  const leftExpandTriggerRef = useRef<HTMLButtonElement>(null);
  const rightExpandTriggerRef = useRef<HTMLButtonElement>(null);
  const lastExpandTriggerRef = useRef<'left' | 'right'>('left');
  const wasExpandedRef = useRef(expanded);
  // Desktop: each column scrolls (contentEdges / metaEdges). Mobile: the grid scrolls as one
  // (fieldsEdges). Only one side is ever active — the inactive scroller reports no overflow.
  const contentEdges = useScrollEdges(expandedContentRef, expanded, current);
  const metaEdges = useScrollEdges(metaColumnRef, expanded, current);
  const fieldsEdges = useScrollEdges(expandedFieldsRef, expanded, current);
  const showTopOverlay = contentEdges.showTop || fieldsEdges.showTop;
  const showBottomOverlay = contentEdges.showBottom || fieldsEdges.showBottom;

  const focusLastExpandTrigger = () => {
    const trigger = lastExpandTriggerRef.current === 'left' ? leftExpandTriggerRef : rightExpandTriggerRef;
    trigger.current?.focus();
  };

  const handleExpandedChange = () => {
    playExpandSound();
    onExpandedChange();
  };
  useEffect(() => {
    const wasExpanded = wasExpandedRef.current;
    wasExpandedRef.current = expanded;
    // Expanding: `focusExpandedFields` (callback ref) handles focus. Collapsing: restore the trigger.
    if (expanded || !wasExpanded) return;
    const timeout = window.setTimeout(focusLastExpandTrigger, 250);
    return () => window.clearTimeout(timeout);
  }, [expanded]);
  const handleViewportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!expanded) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      handleExpandedChange();
      return;
    }
    // Try the grid (mobile scroller) then the content column (desktop scroller).
    const scrolled =
      (expandedFieldsRef.current && scrollExpandedContent(expandedFieldsRef.current, event.key)) ||
      (expandedContentRef.current && scrollExpandedContent(expandedContentRef.current, event.key));
    if (scrolled) {
      event.preventDefault();
    }
  };

  if (!current) return <EmptyState message={t('empty')} />;
  return (
    <div className="relative flex h-full min-h-0 w-full items-center justify-center" onKeyDown={handleViewportKeyDown}>
      <AnimatePresence mode="wait" initial={false} onExitComplete={focusLastExpandTrigger}>
        {!expanded ? (
          <motion.div
            key="collapsed"
            className="minimalist__experience minimalist__experience--collapsed grid h-full max-w-[880px] content-center grid-flow-col grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[12px] max-desktop:px-[22px] max-panel:px-0 max-mobile:grid-cols-[auto_minmax(0,1fr)] max-mobile:grid-rows-[auto_auto] max-mobile:items-stretch max-mobile:gap-x-2 max-mobile:gap-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={minimalistFadeTransition}
          >
            <div className="min-h-0 self-stretch col-start-2 max-mobile:col-start-1 max-mobile:row-span-2 max-mobile:row-start-1">
              <TimelineExperience
                appearance={appearance}
                activeStep="start"
                startYear={year(current.startDate, t('present'))}
                endYear={year(current.endDate, t('present'))}
              />
            </div>
            <div className="contents max-mobile:col-start-2 max-mobile:row-span-2 max-mobile:row-start-1 max-mobile:flex max-mobile:flex-col max-mobile:gap-4 max-mobile:py-16 max-mobile:pr-3">
              <div className="minimalist__experience-column minimalist__experience-column--left col-start-1 flex min-h-0 min-w-0 flex-col items-end gap-[22px] text-right max-mobile:order-2 max-mobile:items-stretch max-mobile:gap-[12px] max-mobile:text-left">
                <div className="minimalist__experience-copy grid w-full gap-[22px] max-mobile:gap-4">
                  <h2 className="minimalist__experience-title m-0 text-minimalist-sm font-minimalist-semibold leading-[1.25] text-minimalist-alpha-black-100 uppercase">
                    {t('experienceAreaLabel')}
                  </h2>
                  <PlainText className="minimalist__experience-description line-clamp-8 overflow-hidden text-justify text-minimalist-md font-minimalist-light leading-[1.45] text-minimalist-alpha-black-80 hyphens-auto max-mobile:text-minimalist-sm max-mobile:leading-minimalist-text-sm">
                    {current.description}
                  </PlainText>
                </div>
                <Button
                  ref={leftExpandTriggerRef}
                  appearance={appearance}
                  variant="secondary"
                  className="minimalist__experience-expand-trigger mt-auto max-mobile:mt-0 max-mobile:self-end"
                  label={t('expand')}
                  icon={<AnimatedIcon icon="chevrons-up-down" size={16} />}
                  aria-expanded={false}
                  aria-controls="minimalist-experience-expanded-content"
                  onClick={() => {
                    lastExpandTriggerRef.current = 'left';
                    handleExpandedChange();
                  }}
                />
              </div>
              <div className="minimalist__experience-column minimalist__experience-column--right col-start-3 flex min-h-0 min-w-0 flex-col items-start gap-[22px] text-left max-mobile:order-1 max-mobile:items-stretch max-mobile:gap-4">
                <div className="minimalist__experience-copy grid w-full gap-[22px] max-mobile:gap-4">
                  <h2 className="minimalist__experience-title m-0 text-minimalist-sm font-minimalist-semibold leading-[1.25] text-minimalist-alpha-black-100 uppercase">
                    {current.companyAliases.join(' | ')}
                  </h2>
                  <PlainText className="minimalist__experience-description line-clamp-8 overflow-hidden text-justify text-minimalist-md font-minimalist-light leading-[1.45] text-minimalist-alpha-black-80 hyphens-auto max-mobile:text-minimalist-sm max-mobile:leading-minimalist-text-sm">
                    {current.about}
                  </PlainText>
                </div>
                <Button
                  ref={rightExpandTriggerRef}
                  appearance={appearance}
                  variant="secondary"
                  className="minimalist__experience-expand-trigger mt-auto max-mobile:mt-0 max-mobile:self-end"
                  label={t('expand')}
                  icon={<AnimatedIcon icon="chevrons-up-down" size={16} />}
                  aria-expanded={false}
                  aria-controls="minimalist-experience-expanded-content"
                  onClick={() => {
                    lastExpandTriggerRef.current = 'right';
                    handleExpandedChange();
                  }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            className="minimalist__experience-expanded-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={minimalistFadeTransition}
          >
            <motion.div
              id="minimalist-experience-expanded-content"
              data-expanded="true"
              className="minimalist__experience-detail minimalist__experience-detail--expanded"
            >
              <div className="minimalist__experience-detail-body minimalist__experience-detail-body--expanded">
                <div
                  className="minimalist__experience-expanded-content-shell"
                  onWheel={(event) => event.stopPropagation()}
                >
                  <div
                    ref={focusExpandedFields}
                    className="minimalist__experience-expanded-fields grid grid-cols-[minmax(0,1fr)_280px] items-start gap-x-[34px] gap-y-[22px]"
                    data-project-expanded-content="true"
                    tabIndex={0}
                    onWheel={(event) => event.stopPropagation()}
                  >
                    <div
                      ref={expandedContentRef}
                      className="minimalist__experience-content-column flex min-w-0 flex-col gap-[22px]"
                    >
                      <div className="minimalist__experience-expanded-field gap-[16px]">
                        <h3>{t('experienceAboutCompanyLabel')}</h3>
                        <MarkdownText gapClassName="gap-[16px]">{current.about}</MarkdownText>
                      </div>
                      <div className="minimalist__experience-expanded-field gap-[16px]">
                        <h3>{t('experienceAboutLabel')}</h3>
                        <MarkdownText gapClassName="gap-[16px]">{current.description}</MarkdownText>
                      </div>
                    </div>
                    <div
                      ref={metaColumnRef}
                      className="minimalist__experience-meta-column flex min-w-0 flex-col gap-[16px]"
                    >
                      {current.logoUrl && (
                        <div className="minimalist__experience-expanded-field gap-[6px]">
                          <h3>{t('experienceCompanyLabel')}</h3>
                          <ExperienceCompanyLogo
                            src={current.logoUrl}
                            href={current.companyUrl}
                            title={current.companyAliases.join(' | ')}
                          />
                        </div>
                      )}
                      {current.industry && (
                        <div className="minimalist__experience-expanded-field gap-[6px]">
                          <h3>{t('experienceIndustryLabel')}</h3>
                          <p>{current.industry}</p>
                        </div>
                      )}
                      {current.location && (
                        <div className="minimalist__experience-expanded-field gap-[6px]">
                          <h3>{t('locationLabel')}</h3>
                          <p>{current.location}</p>
                        </div>
                      )}
                      <div className="minimalist__experience-expanded-field gap-[6px]">
                        <h3>{t('experienceRoleLabel')}</h3>
                        <p>{current.role}</p>
                      </div>
                      {current.employmentType && (
                        <div className="minimalist__experience-expanded-field gap-[6px]">
                          <h3>{t('experienceEmploymentTypeLabel')}</h3>
                          <p>{current.employmentType}</p>
                        </div>
                      )}
                      <div className="minimalist__experience-expanded-field gap-[6px]">
                        <h3>{t('experienceTenureLabel')}</h3>
                        <p>
                          {t('experienceTenureRange', {
                            start: monthYear(current.startDate, locale),
                            end: current.endDate ? monthYear(current.endDate, locale) : t('present'),
                          })}
                        </p>
                      </div>
                      {current.products.length > 0 && (
                        <div className="minimalist__experience-expanded-field gap-[6px]">
                          <h3>{t('experienceProductsLabel')}</h3>
                          <p>{[...current.products.map((product) => product.label), '+5'].join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <motion.span
                    className="minimalist__experience-expanded-gradient minimalist__experience-expanded-gradient--top"
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showTopOverlay ? 1 : 0 }}
                    transition={minimalistFadeTransition}
                  />
                  <motion.span
                    className="minimalist__experience-expanded-gradient minimalist__experience-expanded-gradient--bottom"
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showBottomOverlay ? 1 : 0 }}
                    transition={minimalistFadeTransition}
                  />
                  <motion.span
                    className="minimalist__experience-expanded-gradient minimalist__experience-expanded-gradient--meta minimalist__experience-expanded-gradient--top"
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: metaEdges.showTop ? 1 : 0 }}
                    transition={minimalistFadeTransition}
                  />
                  <motion.span
                    className="minimalist__experience-expanded-gradient minimalist__experience-expanded-gradient--meta minimalist__experience-expanded-gradient--bottom"
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: metaEdges.showBottom ? 1 : 0 }}
                    transition={minimalistFadeTransition}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function projectKey(item: { company: string; projectName: string }): string {
  return `${item.company}-${item.projectName}`;
}

/** Company logo in the experience detail. Wraps it in a link only when the company has a live
 * site URL — an `<a>` with no `href` is not a real link. */
function ExperienceCompanyLogo({ src, href, title }: { src: string; href?: string; title: string }) {
  const logo = (
    <Image
      src={src}
      alt=""
      title={title}
      width={164}
      height={50}
      className="minimalist__experience-logo h-auto w-auto max-w-[164px]"
    />
  );
  if (!href) return logo;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="minimalist__experience-logo-link inline-block">
      {logo}
    </a>
  );
}

export function ProjectsPage({
  data,
  appearance,
  t,
  expandedProjectId,
  onToggleProject,
}: {
  data: PortfolioData;
  appearance: MinimalistAppearance;
  t: (key: string, values?: Record<string, string | number>) => string;
  expandedProjectId: string | null;
  onToggleProject: (projectId: string) => void;
}) {
  const projectGridRef = useRef<HTMLDivElement | null>(null);
  const [gridElement, setGridElement] = useState<HTMLDivElement | null>(null);
  const hasExpandedProject = expandedProjectId !== null;
  const emphasis = useMinimalistCardEmphasis();
  const { gridRef: emphasisGridRef } = emphasis;
  const setProjectGridNode = useCallback(
    (node: HTMLDivElement | null) => {
      projectGridRef.current = node;
      emphasisGridRef(node);
      setGridElement(node);
    },
    [emphasisGridRef],
  );
  const expandedProject = expandedProjectId
    ? data.projects.find((item) => projectKey(item) === expandedProjectId)
    : undefined;
  const [showProjectGradient, setShowProjectGradient] = useState(false);
  const expandedFieldsRef = useRef<HTMLDivElement>(null);
  // See ExperiencePage: focus the scroll area as soon as the expanded view mounts so arrow keys scroll it.
  const focusExpandedFields = useCallback((node: HTMLDivElement | null) => {
    expandedFieldsRef.current = node;
    node?.focus({ preventScroll: true });
  }, []);
  // Keyboard scroll (handleViewportKeyDown): the primary column on desktop, the whole grid on mobile.
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const lastExpandedProjectIdRef = useRef<string | null>(null);
  const wasExpandedRef = useRef(hasExpandedProject);
  const pendingFocusRestoreRef = useRef(false);
  const focusLastExpandTrigger = () => {
    const id = lastExpandedProjectIdRef.current;
    if (!id) return;
    projectGridRef.current
      ?.querySelector<HTMLElement>(`[data-project-card="${id}"] .minimalist-card__expand-control`)
      ?.focus();
  };
  const handleExpandedChange = (id: string) => {
    lastExpandedProjectIdRef.current = id;
    onToggleProject(id);
  };
  useLayoutEffect(() => {
    // Depends on `gridElement` (set by the callback ref), not `hasExpandedProject`: AnimatePresence's
    // `mode="wait"` remounts the collapsed grid in a later commit than the state flip, after the
    // expanded view's exit animation finishes. Keying this off `hasExpandedProject` directly would run
    // before that remount (grid still null) and never fire again once it actually reappears.
    const grid = gridElement;
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
  }, [gridElement]);
  useEffect(() => {
    const wasExpanded = wasExpandedRef.current;
    wasExpandedRef.current = hasExpandedProject;
    // Expanding: `focusExpandedFields` (callback ref) handles focus. Collapsing: restore the trigger.
    if (!hasExpandedProject && wasExpanded) pendingFocusRestoreRef.current = true;
  }, [hasExpandedProject]);
  /** Restores focus once the collapsed grid actually remounts — a fixed timeout race-guessed against
   * AnimatePresence's exit animation instead would fire too early on a slow frame and silently no-op. */
  useLayoutEffect(() => {
    if (!gridElement || !pendingFocusRestoreRef.current) return;
    pendingFocusRestoreRef.current = false;
    focusLastExpandTrigger();
  }, [gridElement]);
  const handleViewportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!hasExpandedProject || !expandedProjectId) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      onToggleProject(expandedProjectId);
      return;
    }
    // Try the grid (mobile scroller) then the content column (desktop scroller).
    const scrolled =
      (expandedFieldsRef.current && scrollExpandedContent(expandedFieldsRef.current, event.key)) ||
      (expandedContentRef.current && scrollExpandedContent(expandedContentRef.current, event.key));
    if (scrolled) {
      event.preventDefault();
    }
  };

  if (!data.projects.length) return <EmptyState message={t('empty')} />;
  return (
    <div className="relative h-full min-h-0 w-full" onKeyDown={handleViewportKeyDown}>
      <AnimatePresence mode="wait" initial={false}>
        {!hasExpandedProject ? (
          <motion.div
            key="collapsed"
            className="minimalist__listing grid h-full content-center justify-items-center gap-7 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={minimalistFadeTransition}
          >
            <div className="minimalist__project-viewport">
              <div
                ref={setProjectGridNode}
                className="minimalist__project-grid"
                tabIndex={0}
                aria-label={t('titles.projects')}
              >
                {data.projects.map((item) => {
                  const id = projectKey(item);
                  const cardEmphasis = emphasis.getCardEmphasis(id);
                  return (
                    <MinimalistCard
                      key={id}
                      data-project-card={id}
                      active={cardEmphasis.active}
                      dimmed={cardEmphasis.dimmed}
                      appearance={appearance}
                      eyebrow={item.projectName}
                      meta={item.dateNote ?? period(item.startDate, item.endDate, t('present'))}
                      onExpandedChange={() => handleExpandedChange(id)}
                      expansionLabel={t('expand')}
                      footer={
                        <span className="minimalist-card__footer-primary">
                          {item.stacks.length <= 2
                            ? item.stacks.join(', ')
                            : `${item.stacks[0]}, ${item.stacks[1]} +${item.stacks.length - 2}`}
                        </span>
                      }
                    >
                      <MarkdownText inline>{item.excerpt}</MarkdownText>
                    </MinimalistCard>
                  );
                })}
              </div>
              {showProjectGradient && <span className="minimalist__project-gradient" aria-hidden="true" />}
            </div>
          </motion.div>
        ) : (
          expandedProject && (
            <ProjectExpandedPanel
              key="expanded"
              project={expandedProject}
              period={
                expandedProject.dateNote ?? period(expandedProject.startDate, expandedProject.endDate, t('present'))
              }
              appearance={appearance}
              t={t}
              fieldsRef={focusExpandedFields}
              primaryColumnRef={expandedContentRef}
            />
          )
        )}
      </AnimatePresence>
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
    <div className="minimalist__education grid h-full max-w-[880px] content-center justify-items-center gap-7 text-center">
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
