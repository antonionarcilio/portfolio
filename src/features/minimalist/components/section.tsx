'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type RefObject, type UIEvent } from 'react';

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
                    <div className="minimalist__experience-meta-column flex min-w-0 flex-col gap-[22px] sticky top-0">
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
                      <div className="minimalist__experience-expanded-field gap-[6px]">
                        <h3>{t('nameLabel')}</h3>
                        <MinimalistAnchor
                          appearance={appearance}
                          href={current.companyUrl ?? ''}
                          disabled={!current.companyUrl}
                          variant="secondary"
                        >
                          {current.companyAliases.join(' | ')}
                        </MinimalistAnchor>
                      </div>
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
    const focusedCard = (event.target as Element).closest<HTMLElement>('[data-project-card]');
    const content =
      (insideExpandedContent as HTMLElement | null) ??
      focusedCard?.querySelector<HTMLElement>('[data-project-expanded-content]') ??
      projectGridRef.current?.querySelector<HTMLElement>('[data-project-expanded-content]');
    if (content && scrollExpandedContent(content, event.key)) event.preventDefault();
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
                        {item.stacks.length <= 2
                          ? item.stacks.join(', ')
                          : `${item.stacks[0]}, ${item.stacks[1]} +${item.stacks.length - 2}`}
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
