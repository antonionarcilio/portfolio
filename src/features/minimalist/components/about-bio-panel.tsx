'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, type KeyboardEvent } from 'react';

import { MarkdownText } from '@/shared/components/markdown-text';
import type { PortfolioData } from '@/shared/types/portfolio';

import { MINIMALIST_EASE, minimalistFadeTransition } from '../animations';
import { useScrollEdges } from '../hooks/use-scroll-edges';
import type { MinimalistAppearance } from '../types';
import { formatCareerYears } from '../utils/format-career-years';
import { scrollExpandedContent } from '../utils/scroll-expanded-content';
import { ContactLinks } from './contact-links';

type AboutBioPanelProps = {
  appearance: MinimalistAppearance;
  open: boolean;
  data: PortfolioData;
  fullBio: string;
  onClose: () => void;
};

export function AboutBioPanel({ appearance, open, data, fullBio, onClose }: AboutBioPanelProps) {
  const t = useTranslations('minimalist.recruiter');
  const fieldsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const metaColumnRef = useRef<HTMLDivElement>(null);
  // Desktop: each column scrolls (contentEdges / metaEdges). Mobile: the grid scrolls as one
  // (fieldsEdges). Only one side is ever active — the inactive scroller reports no overflow.
  const contentEdges = useScrollEdges(contentRef, open, fullBio);
  const metaEdges = useScrollEdges(metaColumnRef, open, fullBio);
  const fieldsEdges = useScrollEdges(fieldsRef, open, fullBio);
  const showTopOverlay = contentEdges.showTop || fieldsEdges.showTop;
  const showBottomOverlay = contentEdges.showBottom || fieldsEdges.showBottom;
  const { years, approximate } = formatCareerYears(data.careerMonths);
  const educationLine = data.education[0]?.aliases.join(' | ') ?? '';

  // Land focus on the scroll area (not the collapse button) so ArrowUp/Down scroll the bio immediately.
  useEffect(() => {
    if (open) window.requestAnimationFrame(() => fieldsRef.current?.focus({ preventScroll: true }));
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    // Try the grid (mobile scroller) then the bio column (desktop scroller).
    const scrolled =
      (fieldsRef.current && scrollExpandedContent(fieldsRef.current, event.key)) ||
      (contentRef.current && scrollExpandedContent(contentRef.current, event.key));
    if (!scrolled) return;
    event.preventDefault();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          id="minimalist-about-bio-panel"
          className="minimalist__about-bio-panel flex items-center justify-center"
          aria-label={t('pages.about')}
          onWheel={(event) => event.stopPropagation()}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: MINIMALIST_EASE }}
        >
          <div className="minimalist__about-bio-panel__frame flex flex-col gap-8">
            <div className="minimalist__about-bio-panel__content-shell">
              <div
                ref={fieldsRef}
                className="minimalist__about-bio-panel__fields grid grid-cols-[minmax(0,1fr)_280px] items-start gap-x-[34px] gap-y-[22px]"
                data-project-expanded-content="true"
                tabIndex={0}
                onWheel={(event) => event.stopPropagation()}
              >
                <div
                  ref={contentRef}
                  className="minimalist__about-bio-panel__bio-column flex min-w-0 flex-col gap-[22px]"
                >
                  <div className="minimalist__about-bio-panel__field minimalist__about-bio-panel__field--bio gap-[16px]">
                    <h3>{t('aboutBioTitle')}</h3>
                    <MarkdownText gapClassName="gap-[16px]">{fullBio}</MarkdownText>
                  </div>
                </div>
                <div
                  ref={metaColumnRef}
                  className="minimalist__about-bio-panel__meta-column flex min-w-0 flex-col gap-[22px]"
                >
                  {data.avatarUrl && (
                    <div className="minimalist__portrait" aria-hidden="true">
                      <Image src={data.avatarUrl} alt="" width={168} height={168} />
                    </div>
                  )}
                  <div className="minimalist__about-bio-panel__meta-fields grid grid-cols-1 items-start gap-[22px]">
                    <div className="minimalist__about-bio-panel__field gap-[4px]">
                      <h3>{t('nameLabel')}</h3>
                      <p>{data.name}</p>
                    </div>
                    <div className="minimalist__about-bio-panel__field gap-[4px]">
                      <h3>{t('careerExperienceLabel')}</h3>
                      <p>{t(approximate ? 'careerYearsApprox' : 'careerYearsExact', { years })}</p>
                    </div>
                    <div className="minimalist__about-bio-panel__field gap-[4px]">
                      <h3>{t('expertiseAreaLabel')}</h3>
                      <p>{data.role}</p>
                    </div>
                    {data.seniority && (
                      <div className="minimalist__about-bio-panel__field gap-[4px]">
                        <h3>{t('seniorityLabel')}</h3>
                        <p>{t(`seniorityValues.${data.seniority}`)}</p>
                      </div>
                    )}
                    <div className="minimalist__about-bio-panel__field gap-[4px]">
                      <h3>{t('locationLabel')}</h3>
                      <p>{data.location}</p>
                    </div>
                    {educationLine && (
                      <div className="minimalist__about-bio-panel__field minimalist__about-bio-panel__field--education gap-[4px]">
                        <h3>{t('educationLabel')}</h3>
                        <p>{educationLine}</p>
                      </div>
                    )}
                    <div className="minimalist__about-bio-panel__field minimalist__about-bio-panel__field--contacts gap-[4px]">
                      <h3>{t('contactsLabel')}</h3>
                      <ContactLinks data={data} appearance={appearance} />
                    </div>
                  </div>
                </div>
              </div>
              <motion.span
                className="minimalist__about-bio-panel__gradient minimalist__about-bio-panel__gradient--top"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: showTopOverlay ? 1 : 0 }}
                transition={minimalistFadeTransition}
              />
              <motion.span
                className="minimalist__about-bio-panel__gradient minimalist__about-bio-panel__gradient--bottom"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: showBottomOverlay ? 1 : 0 }}
                transition={minimalistFadeTransition}
              />
              <motion.span
                className="minimalist__about-bio-panel__gradient minimalist__about-bio-panel__gradient--meta minimalist__about-bio-panel__gradient--top"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: metaEdges.showTop ? 1 : 0 }}
                transition={minimalistFadeTransition}
              />
              <motion.span
                className="minimalist__about-bio-panel__gradient minimalist__about-bio-panel__gradient--meta minimalist__about-bio-panel__gradient--bottom"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: metaEdges.showBottom ? 1 : 0 }}
                transition={minimalistFadeTransition}
              />
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
