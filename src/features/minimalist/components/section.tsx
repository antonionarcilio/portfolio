'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
} from 'react';

import chevronsDownUp from '@/_assets/icons/chevrons-down-up.svg';
import chevronsUpDown from '@/_assets/icons/chevrons-up-down.svg';
import { MarkdownText } from '@/shared/components/markdown-text';
import { PlainText } from '@/shared/components/plain-text';
import type { ExperienceEntry, PortfolioData } from '@/shared/types/portfolio';

import { minimalistFadeTransition } from '../animations';
import { useMinimalistCardEmphasis } from '../hooks/use-minimalist-card-emphasis';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistAppearance } from '../types';
import { scrollExpandedContent } from '../utils/scroll-expanded-content';
import { MinimalistAnchor } from './anchor';
import { Button } from './button';
import { MinimalistCard } from './card';
import { ContactLinks } from './contact-links';
import { Divider } from './divider';
import { NavigationHint } from './navigation';
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
            icon={<Image src={chevronsUpDown} alt="" width={16} height={16} aria-hidden="true" />}
            aria-expanded={isExpanded}
            aria-controls="minimalist-about-bio-panel"
            onClick={onExpand}
          />
        )}
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
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const leftExpandTriggerRef = useRef<HTMLButtonElement>(null);
  const rightExpandTriggerRef = useRef<HTMLButtonElement>(null);
  const lastExpandTriggerRef = useRef<'left' | 'right'>('left');
  const wasExpandedRef = useRef(expanded);
  const [showExpandedTopGradient, setShowExpandedTopGradient] = useState(false);
  const [showExpandedBottomGradient, setShowExpandedBottomGradient] = useState(false);

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
    if (expanded) {
      const frame = window.requestAnimationFrame(() => triggerRef.current?.focus());
      return () => window.cancelAnimationFrame(frame);
    }
    if (!wasExpanded) return;
    const timeout = window.setTimeout(focusLastExpandTrigger, 250);
    return () => window.clearTimeout(timeout);
  }, [expanded]);
  useLayoutEffect(() => {
    if (!expanded) {
      setShowExpandedTopGradient(false);
      setShowExpandedBottomGradient(false);
      return;
    }
    let frame = 0;
    let cleanup = () => {};
    const observeContent = () => {
      const content = expandedContentRef.current;
      if (!content) {
        frame = window.requestAnimationFrame(observeContent);
        return;
      }
      const updateGradient = () => {
        const hasOverflow = content.scrollHeight > content.clientHeight + 1;
        const atStart = content.scrollTop <= 1;
        const atEnd = content.scrollTop + content.clientHeight >= content.scrollHeight - 1;
        setShowExpandedTopGradient(hasOverflow && !atStart);
        setShowExpandedBottomGradient(hasOverflow && !atEnd);
      };
      updateGradient();
      content.addEventListener('scroll', updateGradient, { passive: true });
      const resizeObserver = new ResizeObserver(updateGradient);
      resizeObserver.observe(content);
      cleanup = () => {
        content.removeEventListener('scroll', updateGradient);
        resizeObserver.disconnect();
      };
    };
    frame = window.requestAnimationFrame(observeContent);
    return () => {
      window.cancelAnimationFrame(frame);
      cleanup();
    };
  }, [expanded, current]);
  const handleViewportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!expanded) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      handleExpandedChange();
      return;
    }
    if (expandedContentRef.current && scrollExpandedContent(expandedContentRef.current, event.key)) {
      event.preventDefault();
    }
  };

  if (!current) return <EmptyState message={t('empty')} />;
  return (
    <div className="relative h-full min-h-0 w-full" onKeyDown={handleViewportKeyDown}>
      <AnimatePresence mode="wait" initial={false} onExitComplete={focusLastExpandTrigger}>
        {!expanded ? (
          <motion.div
            key="collapsed"
            className="minimalist__experience minimalist__experience--collapsed grid h-full content-center grid-flow-col grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[12px] max-[950px]:px-[22px] max-[870px]:px-0 max-[670px]:grid-cols-[auto_minmax(0,1fr)] max-[670px]:grid-rows-[auto_auto] max-[670px]:items-stretch max-[670px]:gap-x-3 max-[670px]:gap-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={minimalistFadeTransition}
          >
            <div className="min-h-0 self-stretch col-start-2 max-[670px]:col-start-1 max-[670px]:row-span-2 max-[670px]:row-start-1">
              <TimelineExperience
                appearance={appearance}
                activeStep="start"
                startYear={year(current.startDate, t('present'))}
                endYear={year(current.endDate, t('present'))}
              />
            </div>
            <div className="contents max-[670px]:col-start-2 max-[670px]:row-span-2 max-[670px]:row-start-1 max-[670px]:flex max-[670px]:flex-col max-[670px]:gap-4 max-[670px]:py-16 max-[670px]:pr-3">
              <div className="minimalist__experience-column minimalist__experience-column--left col-start-1 flex min-h-0 min-w-0 flex-col items-end gap-[22px] text-right max-[670px]:order-2 max-[670px]:items-stretch max-[670px]:gap-[12px] max-[670px]:text-left">
                <div className="minimalist__experience-copy grid w-full gap-[22px] max-[670px]:gap-2">
                  <h2 className="minimalist__experience-title m-0 text-minimalist-sm font-minimalist-semibold leading-[1.25] text-minimalist-alpha-black-100 uppercase">
                    {t('experienceAreaLabel')}
                  </h2>
                  <PlainText className="minimalist__experience-description line-clamp-8 overflow-hidden text-justify text-minimalist-md font-minimalist-light leading-[1.45] text-minimalist-alpha-black-80 hyphens-auto max-[670px]:text-minimalist-sm max-[670px]:leading-minimalist-text-sm">
                    {current.description}
                  </PlainText>
                </div>
                <Button
                  ref={leftExpandTriggerRef}
                  appearance={appearance}
                  variant="secondary"
                  className="minimalist__experience-expand-trigger mt-auto max-[670px]:mt-0 max-[670px]:self-end"
                  label={t('expand')}
                  icon={<Image src={chevronsUpDown} alt="" width={16} height={16} aria-hidden="true" />}
                  aria-expanded={false}
                  aria-controls="minimalist-experience-expanded-content"
                  onClick={() => {
                    lastExpandTriggerRef.current = 'left';
                    handleExpandedChange();
                  }}
                />
              </div>
              <div className="minimalist__experience-column minimalist__experience-column--right col-start-3 flex min-h-0 min-w-0 flex-col items-start gap-[22px] text-left max-[670px]:order-1 max-[670px]:items-stretch max-[670px]:gap-[12px]">
                <div className="minimalist__experience-copy grid w-full gap-[22px] max-[670px]:gap-2">
                  <h2 className="minimalist__experience-title m-0 text-minimalist-sm font-minimalist-semibold leading-[1.25] text-minimalist-alpha-black-100 uppercase">
                    {current.companyAliases.join(' | ')}
                  </h2>
                  <PlainText className="minimalist__experience-description line-clamp-8 overflow-hidden text-justify text-minimalist-md font-minimalist-light leading-[1.45] text-minimalist-alpha-black-80 hyphens-auto max-[670px]:text-minimalist-sm max-[670px]:leading-minimalist-text-sm">
                    {current.about}
                  </PlainText>
                </div>
                <Button
                  ref={rightExpandTriggerRef}
                  appearance={appearance}
                  variant="secondary"
                  className="minimalist__experience-expand-trigger mt-auto max-[670px]:mt-0 max-[670px]:self-end"
                  label={t('expand')}
                  icon={<Image src={chevronsUpDown} alt="" width={16} height={16} aria-hidden="true" />}
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
                    ref={expandedContentRef}
                    className="minimalist__experience-expanded-fields grid grid-cols-[minmax(0,1fr)_280px] items-start gap-x-[34px] gap-y-[22px]"
                    data-project-expanded-content="true"
                    tabIndex={0}
                    onWheel={(event) => event.stopPropagation()}
                  >
                    <div className="flex min-w-0 flex-col gap-[22px]">
                      <div className="minimalist__experience-expanded-field gap-[16px]">
                        <h3>{t('experienceAboutCompanyLabel')}</h3>
                        <MarkdownText gapClassName="gap-[16px]">{current.about}</MarkdownText>
                      </div>
                      <div className="minimalist__experience-expanded-field gap-[16px]">
                        <h3>{t('experienceAboutLabel')}</h3>
                        <MarkdownText gapClassName="gap-[16px]">{current.description}</MarkdownText>
                      </div>
                    </div>
                    <div className="minimalist__experience-meta-column flex min-w-0 flex-col gap-[16px] sticky top-0">
                      <div className="minimalist__experience-expanded-field gap-[6px]">
                        <h3>{t('nameLabel')}</h3>
                        <MinimalistAnchor
                          appearance={appearance}
                          href={current.companyUrl ?? ''}
                          disabled={!current.companyUrl}
                          variant="secondary"
                          uppercase={false}
                        >
                          {current.companyAliases.join(' | ')}
                        </MinimalistAnchor>
                      </div>
                      {current.logoUrl && (
                        <div className="minimalist__experience-expanded-field gap-[6px]">
                          <h3>{t('experienceLogoLabel')}</h3>
                          <Image
                            src={current.logoUrl}
                            alt=""
                            width={164}
                            height={50}
                            className="minimalist__experience-logo h-auto w-auto max-w-[164px]"
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
                  {showExpandedTopGradient && (
                    <span
                      className="minimalist__experience-expanded-gradient minimalist__experience-expanded-gradient--top"
                      aria-hidden="true"
                    />
                  )}
                  {showExpandedBottomGradient && (
                    <span
                      className="minimalist__experience-expanded-gradient minimalist__experience-expanded-gradient--bottom"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div className="minimalist__experience-footer flex h-fit items-center">
                  <motion.span
                    className="minimalist__experience-footer-hint"
                    animate={{ opacity: 1 }}
                    transition={minimalistFadeTransition}
                    aria-hidden={false}
                  >
                    <NavigationHint appearance={appearance} />
                  </motion.span>
                  <Button
                    ref={triggerRef}
                    appearance={appearance}
                    variant="secondary"
                    className="minimalist__more minimalist__experience-trigger"
                    label={expanded ? t('collapse') : t('expand')}
                    icon={
                      <Image
                        src={expanded ? chevronsDownUp : chevronsUpDown}
                        alt=""
                        width={16}
                        height={16}
                        aria-hidden="true"
                      />
                    }
                    aria-expanded={expanded}
                    onClick={handleExpandedChange}
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

function projectKey(item: { company: string; projectName: string }): string {
  return `${item.company}-${item.projectName}`;
}

const PROJECT_COVER_FALLBACK = '/portfolios/minimalist/project-cover-placeholder.png';
const PROJECT_PREVIEW_FRAME_HEIGHT = 222;
/** Constant pan speed (not a fixed duration) — a very tall screenshot would otherwise cover the
 * same distance in the same time as a short one and visibly "shoot" past its content. */
const PROJECT_PREVIEW_PAN_SPEED_PX_PER_SECOND = 180;
/**
 * Pans the preview image on hover/focus so a tall cover screenshot can be read start to finish,
 * then drops back to top just as smoothly. Framer animates the `--project-preview-pan` custom
 * property on the frame (a plain motion.div) instead of the `next/image` element itself — Next's
 * own style-prop management on `<Image>` fights Framer's per-frame style updates on wrapped
 * components, freezing the animation partway. The image just reads the inherited variable in CSS.
 * Linear easing (not the shared `MINIMALIST_EASE` curve) is intentional: a constant px/s pan reads
 * as an actual scroll, while an eased curve front-loads most of the movement into the first instant.
 */
const projectPreviewPanVariants = { rest: { '--project-preview-pan': 0 }, pan: { '--project-preview-pan': 1 } };

/** Wraps the preview in a link only when the project has a live URL — an `<a>` with no `href` is
 * not a real link, so an image with nothing to open stays a plain, non-interactive frame. */
function ProjectPreviewFrame({
  href,
  canPan,
  panDurationSeconds,
  children,
}: {
  href?: string;
  canPan: boolean;
  panDurationSeconds: number | null;
  children: ReactNode;
}) {
  const transition = { duration: panDurationSeconds ?? 0, ease: 'linear' as const };
  const whileHover = canPan ? 'pan' : undefined;
  const whileFocus = canPan ? 'pan' : undefined;
  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="minimalist__project-preview-frame minimalist__project-preview-frame--linked"
        initial="rest"
        whileHover={whileHover}
        whileFocus={whileFocus}
        variants={projectPreviewPanVariants}
        transition={transition}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <motion.div
      className="minimalist__project-preview-frame"
      tabIndex={canPan ? 0 : undefined}
      initial="rest"
      whileHover={whileHover}
      whileFocus={whileFocus}
      variants={projectPreviewPanVariants}
      transition={transition}
    >
      {children}
    </motion.div>
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
  const emphasis = useMinimalistCardEmphasis(projectGridRef);
  const hasExpandedProject = expandedProjectId !== null;
  const expandedProject = expandedProjectId
    ? data.projects.find((item) => projectKey(item) === expandedProjectId)
    : undefined;
  const [showProjectGradient, setShowProjectGradient] = useState(false);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const lastExpandedProjectIdRef = useRef<string | null>(null);
  const wasExpandedRef = useRef(hasExpandedProject);
  const [showExpandedTopGradient, setShowExpandedTopGradient] = useState(false);
  const [showExpandedBottomGradient, setShowExpandedBottomGradient] = useState(false);
  const [previewPanDurationSeconds, setPreviewPanDurationSeconds] = useState<number | null>(null);

  const handlePreviewLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const scaledHeight = img.naturalHeight * (img.clientWidth / img.naturalWidth);
    const overflow = scaledHeight - PROJECT_PREVIEW_FRAME_HEIGHT;
    setPreviewPanDurationSeconds(overflow > 0 ? overflow / PROJECT_PREVIEW_PAN_SPEED_PX_PER_SECOND : null);
  };
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
    const grid = projectGridRef.current;
    if (!grid || hasExpandedProject) return;
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
  }, [hasExpandedProject]);
  useEffect(() => {
    const wasExpanded = wasExpandedRef.current;
    wasExpandedRef.current = hasExpandedProject;
    if (hasExpandedProject) {
      const frame = window.requestAnimationFrame(() => triggerRef.current?.focus());
      return () => window.cancelAnimationFrame(frame);
    }
    if (!wasExpanded) return;
    const timeout = window.setTimeout(focusLastExpandTrigger, 250);
    return () => window.clearTimeout(timeout);
  }, [hasExpandedProject]);
  useLayoutEffect(() => {
    if (!hasExpandedProject) {
      setShowExpandedTopGradient(false);
      setShowExpandedBottomGradient(false);
      return;
    }
    let frame = 0;
    let cleanup = () => {};
    const observeContent = () => {
      const content = expandedContentRef.current;
      if (!content) {
        frame = window.requestAnimationFrame(observeContent);
        return;
      }
      const updateGradient = () => {
        const hasOverflow = content.scrollHeight > content.clientHeight + 1;
        const atStart = content.scrollTop <= 1;
        const atEnd = content.scrollTop + content.clientHeight >= content.scrollHeight - 1;
        setShowExpandedTopGradient(hasOverflow && !atStart);
        setShowExpandedBottomGradient(hasOverflow && !atEnd);
      };
      updateGradient();
      content.addEventListener('scroll', updateGradient, { passive: true });
      const resizeObserver = new ResizeObserver(updateGradient);
      resizeObserver.observe(content);
      cleanup = () => {
        content.removeEventListener('scroll', updateGradient);
        resizeObserver.disconnect();
      };
    };
    frame = window.requestAnimationFrame(observeContent);
    return () => {
      window.cancelAnimationFrame(frame);
      cleanup();
    };
  }, [hasExpandedProject, expandedProjectId]);
  const handleViewportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!hasExpandedProject || !expandedProjectId) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      onToggleProject(expandedProjectId);
      return;
    }
    if (expandedContentRef.current && scrollExpandedContent(expandedContentRef.current, event.key)) {
      event.preventDefault();
    }
  };

  if (!data.projects.length) return <EmptyState message={t('empty')} />;
  return (
    <div className="relative h-full min-h-0 w-full" onKeyDown={handleViewportKeyDown}>
      <h1 className="sr-only">{t('titles.projects')}</h1>
      <AnimatePresence mode="wait" initial={false} onExitComplete={focusLastExpandTrigger}>
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
                ref={projectGridRef}
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
                      eyebrow={`// ${item.projectName}`}
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
            <motion.div
              key="expanded"
              className="minimalist__project-expanded-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={minimalistFadeTransition}
            >
              <div
                id="minimalist-project-expanded-content"
                data-expanded="true"
                className="minimalist__project-detail minimalist__project-detail--expanded"
              >
                <div className="minimalist__project-detail-body">
                  <div
                    className="minimalist__project-expanded-content-shell"
                    onWheel={(event) => event.stopPropagation()}
                  >
                    <div
                      ref={expandedContentRef}
                      className="minimalist__project-expanded-fields grid grid-cols-[minmax(0,1fr)_280px] items-start gap-x-[34px] gap-y-[22px]"
                      data-project-expanded-content="true"
                      tabIndex={0}
                      onWheel={(event) => event.stopPropagation()}
                    >
                      <div className="flex min-w-0 flex-col gap-[22px]">
                        <div className="minimalist__project-expanded-field gap-[16px]">
                          <h3>{t('aboutProject')}</h3>
                          <MarkdownText gapClassName="gap-[16px]">{expandedProject.desc}</MarkdownText>
                        </div>
                        <div className="minimalist__project-expanded-field gap-[16px]">
                          <h3>{t('stack')}</h3>
                          <p>{expandedProject.stacks.join(' + ')}</p>
                        </div>
                      </div>
                      <div className="minimalist__project-meta-column flex min-w-0 flex-col gap-[16px] sticky top-0">
                        <div className="minimalist__project-expanded-field gap-[6px]">
                          <h3>{t('projectPreviewLabel')}</h3>
                          <ProjectPreviewFrame
                            href={expandedProject.projectUrl}
                            canPan={Boolean(expandedProject.coverUrl) && previewPanDurationSeconds !== null}
                            panDurationSeconds={previewPanDurationSeconds}
                          >
                            <Image
                              src={expandedProject.coverUrl ?? PROJECT_COVER_FALLBACK}
                              alt=""
                              width={280}
                              height={222}
                              className="minimalist__project-preview-image"
                              onLoad={handlePreviewLoad}
                            />
                          </ProjectPreviewFrame>
                        </div>
                        <div className="minimalist__project-expanded-field gap-[6px]">
                          <h3>{t('nameLabel')}</h3>
                          <p>{expandedProject.projectName}</p>
                        </div>
                        <div className="minimalist__project-expanded-field gap-[6px]">
                          <h3>{t('developmentPeriod')}</h3>
                          <p>
                            {expandedProject.dateNote ??
                              period(expandedProject.startDate, expandedProject.endDate, t('present'))}
                          </p>
                        </div>
                        <div className="minimalist__project-expanded-field gap-[6px]">
                          <h3>{t('servicesFor')}</h3>
                          <MinimalistAnchor
                            appearance={appearance}
                            href={expandedProject.companyUrl ?? ''}
                            disabled={!expandedProject.companyUrl}
                            variant="secondary"
                            uppercase={false}
                          >
                            {expandedProject.company}
                          </MinimalistAnchor>
                        </div>
                        <div className="minimalist__project-expanded-field gap-[6px]">
                          <h3>{t('expertiseAreaLabel')}</h3>
                          <p>{expandedProject.expertiseArea}</p>
                        </div>
                      </div>
                    </div>
                    {showExpandedTopGradient && (
                      <span
                        className="minimalist__project-expanded-gradient minimalist__project-expanded-gradient--top"
                        aria-hidden="true"
                      />
                    )}
                    {showExpandedBottomGradient && (
                      <span
                        className="minimalist__project-expanded-gradient minimalist__project-expanded-gradient--bottom"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="minimalist__project-footer flex h-fit items-center">
                    <motion.span
                      className="minimalist__project-footer-hint"
                      animate={{ opacity: 1 }}
                      transition={minimalistFadeTransition}
                      aria-hidden={false}
                    >
                      <NavigationHint appearance={appearance} />
                    </motion.span>
                    <Button
                      ref={triggerRef}
                      appearance={appearance}
                      variant="secondary"
                      className="minimalist__more minimalist__project-trigger"
                      label={t('collapse')}
                      icon={<Image src={chevronsDownUp} alt="" width={16} height={16} aria-hidden="true" />}
                      aria-expanded={true}
                      onClick={() => onToggleProject(expandedProjectId)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
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
