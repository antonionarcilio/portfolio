'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import chevronsDownUp from '@/_assets/icons/chevrons-down-up.svg';
import { MarkdownText } from '@/shared/components/markdown-text';
import type { PortfolioData } from '@/shared/types/portfolio';

import { MINIMALIST_EASE } from '../animations';
import type { MinimalistAppearance } from '../types';
import { formatCareerYears } from '../utils/format-career-years';
import { scrollExpandedContent } from '../utils/scroll-expanded-content';
import { Button } from './button';
import { ContactLinks } from './contact-links';
import { NavigationHint } from './navigation';

type AboutBioPanelProps = {
  appearance: MinimalistAppearance;
  open: boolean;
  data: PortfolioData;
  fullBio: string;
  onClose: () => void;
};

export function AboutBioPanel({ appearance, open, data, fullBio, onClose }: AboutBioPanelProps) {
  const t = useTranslations('minimalist.recruiter');
  const collapseRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(false);
  const { years, approximate } = formatCareerYears(data.careerMonths);
  const educationLine = data.education[0]?.aliases.join(' | ') ?? '';

  useEffect(() => {
    if (open) window.requestAnimationFrame(() => collapseRef.current?.focus());
  }, [open]);

  useEffect(() => {
    const content = contentRef.current;
    if (!open || !content) {
      setShowGradient(false);
      return;
    }
    const updateGradient = () => {
      const hasOverflow = content.scrollHeight > content.clientHeight + 1;
      const atEnd = content.scrollTop + content.clientHeight >= content.scrollHeight - 1;
      setShowGradient(hasOverflow && !atEnd);
    };
    updateGradient();
    content.addEventListener('scroll', updateGradient, { passive: true });
    const resizeObserver = new ResizeObserver(updateGradient);
    resizeObserver.observe(content);
    return () => {
      content.removeEventListener('scroll', updateGradient);
      resizeObserver.disconnect();
    };
  }, [open, fullBio]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!contentRef.current || !scrollExpandedContent(contentRef.current, event.key)) return;
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
                ref={contentRef}
                className="minimalist__about-bio-panel__fields grid grid-cols-[minmax(0,1fr)_280px] items-start gap-x-[34px] gap-y-[22px]"
                data-project-expanded-content="true"
                tabIndex={0}
                onWheel={(event) => event.stopPropagation()}
              >
                <div className="minimalist__about-bio-panel__bio-column flex min-w-0 flex-col gap-[22px]">
                  <div className="minimalist__about-bio-panel__field minimalist__about-bio-panel__field--bio gap-[16px]">
                    <h3>{t('aboutBioTitle')}</h3>
                    <MarkdownText gapClassName="gap-[16px]">{fullBio}</MarkdownText>
                  </div>
                </div>
                <div className="minimalist__about-bio-panel__meta-column flex min-w-0 flex-col gap-[22px] sticky top-0">
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
              {showGradient && <span className="minimalist__about-bio-panel__gradient" aria-hidden="true" />}
            </div>
            <div className="minimalist__about-bio-panel__footer flex items-center justify-between">
              <NavigationHint appearance={appearance} />
              <Button
                ref={collapseRef}
                appearance={appearance}
                variant="secondary"
                label={t('collapse')}
                icon={<Image src={chevronsDownUp} alt="" width={16} height={16} aria-hidden="true" />}
                onClick={onClose}
              />
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
