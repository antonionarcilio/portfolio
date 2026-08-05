'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type WheelEvent } from 'react';

import dividerV1 from '@/_assets/icons/divider-v1.svg';

import { usePathname, useRouter } from '@/i18n/navigation';
import { MarkdownText } from '@/shared/components/markdown-text';
import type { ExperienceEntry, PortfolioData } from '@/shared/types/portfolio';

import type { MinimalistAppearance } from '../types';
import { circularIndex } from '../utils/circular-index';
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

function period(start: string, end: string | null | undefined, locale: string, present: string): string {
  const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
  const from = new Intl.DateTimeFormat(locale, options).format(new Date(start));
  const to = end ? new Intl.DateTimeFormat(locale, options).format(new Date(end)) : present;
  return `${from} — ${to}`;
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
  locale,
  appearance,
  t,
}: {
  data: PortfolioData;
  locale: string;
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
        <time>{period(current.startDate, current.endDate, locale, t('present'))}</time>
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
}: {
  data: PortfolioData;
  appearance: MinimalistAppearance;
  t: (key: string) => string;
}) {
  return (
    <div className="minimalist__listing">
      <h1 className="sr-only">{t('titles.projects')}</h1>
      <div className="minimalist__project-grid">
        {data.projects.length ? (
          data.projects.map((item) => (
            <MinimalistCard
              key={`${item.company}-${item.projectName}`}
              appearance={appearance}
              eyebrow={`// ${item.projectName}`}
              title={item.company}
              footer={
                <>
                  {item.companyUrl ? (
                    <MinimalistAnchor appearance={appearance} href={item.companyUrl}>
                      {t('visit')}
                    </MinimalistAnchor>
                  ) : (
                    <span className="minimalist__project-status">{t('private')}</span>
                  )}
                  <Button appearance={appearance} className="minimalist__more" label={t('expand')} disabled />
                </>
              }
            >
              <MarkdownText inline>{item.excerpt}</MarkdownText>
            </MinimalistCard>
          ))
        ) : (
          <EmptyState message={t('empty')} />
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
  const router = useRouter();
  const pathname = usePathname();
  const [appearance, setAppearance] = useState<MinimalistAppearance>('light');
  const [activeIndex, setActiveIndex] = useState(0);
  const [a11yOpen, setA11yOpen] = useState(false);
  const navigationLock = useRef(false);
  const footerTrackRef = useRef<HTMLDivElement>(null);
  const footerFocusPending = useRef(false);
  const [footerPosition, setFooterPosition] = useState(2);
  const [footerTranslate, setFooterTranslate] = useState(0);
  const [footerTransitionEnabled, setFooterTransitionEnabled] = useState(true);
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
    if (!acquireNavigationLock()) return false;
    const nextIndex = circularIndex(index, pages.length);
    setActiveIndex(nextIndex);
    setFooterPosition(2 + nextIndex);
    return true;
  };
  const movePage = (delta: number) => {
    if (delta === 0 || !acquireNavigationLock()) return false;
    const nextPosition = footerPosition + delta;
    setFooterPosition(nextPosition);
    setActiveIndex(circularIndex(nextPosition - 2, pages.length));
    return true;
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
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    footerFocusPending.current = true;
    if (movePage(event.key === 'ArrowRight' ? 1 : -1)) scheduleFooterItemFocus();
  };
  const handleFooterItemClick = (event: MouseEvent<HTMLButtonElement>, index: number) => {
    if (!selectPage(index)) return;
    footerFocusPending.current = true;
    event.currentTarget.focus({ preventScroll: true });
    window.setTimeout(
      () => footerTrackRef.current?.querySelector<HTMLButtonElement>('.minimalist-switch-btn--current')?.focus(),
      700,
    );
  };
  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 20) return;
    movePage(event.deltaY > 0 ? 1 : -1);
  };
  const changeLocale = (nextLocale: 'en' | 'pt-BR') => router.replace(pathname, { locale: nextLocale });
  const logo = appearance === 'light' ? '/logo-light.svg' : '/logo-dark.svg';

  return (
    <main className={`minimalist-theme minimalist-theme--${appearance}`} id="main-content">
      <header className="minimalist__header">
        <div className="minimalist__header-tools">
          <I18nToggle appearance={appearance} locale={locale} onChange={changeLocale} />
          <Divider appearance={appearance} variant="v2" orientation="vertical" />
          <ThemeToggle appearance={appearance} onChange={setAppearance} />
        </div>
        <Image className="minimalist__logo" src={logo} alt={data.name} width={73} height={21} />
        <div className="minimalist__header-tools minimalist__header-tools--right">
          <MinimalistA11yTrigger
            appearance={appearance}
            opened={a11yOpen}
            onClick={() => setA11yOpen((open) => !open)}
          />
          <Divider appearance={appearance} variant="v2" orientation="vertical" />
          <ModeToggle appearance={appearance} current="R" />
        </div>
      </header>
      <div className="minimalist__main" onWheel={handleWheel}>
        <div className="minimalist__side-pagination">
          <StepPagination
            appearance={appearance}
            currentStep={activeIndex + 1}
            totalSteps={pages.length}
            onStepChange={selectPage}
          />
        </div>
        <div className="minimalist__content" aria-live="polite">
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
                  {page.id === 'experience' && (
                    <ExperiencePage data={data} locale={locale} appearance={appearance} t={t} />
                  )}
                  {page.id === 'projects' && <ProjectsPage data={data} appearance={appearance} t={t} />}
                  {page.id === 'education' && <EducationPage data={data} t={t} />}
                </div>
              </section>
            ))}
          </motion.div>
        </div>
      </div>
      <footer className="minimalist__footer">
        <PaginationButton appearance={appearance} direction="previous" onClick={() => movePage(-1)} />
        <div className="minimalist__footer-viewport" role="group" aria-label={t('footerNavigation')}>
          <motion.div
            ref={footerTrackRef}
            className={`minimalist__footer-track${footerTransitionEnabled ? ' minimalist__footer-track--ready' : ''}`}
            animate={{ x: footerTranslate }}
            transition={footerTransitionEnabled ? { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] } : { duration: 0 }}
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
      </footer>
    </main>
  );
}
