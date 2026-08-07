'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { MarkdownText } from '@/shared/components/markdown-text';
import type { PortfolioData } from '@/shared/types/portfolio';

import type { MinimalistAppearance } from '../types';
import { Button } from './button';
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

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          id="minimalist-about-bio-panel"
          className="minimalist__about-bio-panel"
          aria-label={t('pages.about')}
          onWheel={(event) => event.stopPropagation()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="minimalist__about-bio-panel__frame">
            <p className="minimalist__about-bio-panel__kicker">{t('aboutKicker')}</p>
            <div className="minimalist__about-bio-panel__fields">
              <p className="minimalist__about-bio-panel__field minimalist__about-bio-panel__field--name">
                <span>
                  <strong>{t('nameLabel')}</strong> {data.name}
                </span>
                <span>{data.role}</span>
              </p>
              <p className="minimalist__about-bio-panel__field">
                <strong>{t('cityLabel')}</strong> {data.location}
              </p>
              <p className="minimalist__about-bio-panel__field">
                <strong>{t('bioLabel')}</strong>
              </p>
              <div ref={contentRef} className="minimalist__about-bio-panel__content" tabIndex={0}>
                <MarkdownText>{fullBio}</MarkdownText>
              </div>
              {showGradient && <span className="minimalist__about-bio-panel__gradient" aria-hidden="true" />}
            </div>
            <div className="minimalist__about-bio-panel__footer">
              <NavigationHint appearance={appearance} />
              <Button ref={collapseRef} appearance={appearance} label={t('collapse')} onClick={onClose} />
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
