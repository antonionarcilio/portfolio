'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useMemo, useRef, type KeyboardEvent, type ReactNode } from 'react';

import { MarkdownText } from '@/shared/components/markdown-text';
import type { PortfolioData } from '@/shared/types/portfolio';

import { MINIMALIST_EASE } from '../animations';
import { useScrollEdges } from '../hooks/use-scroll-edges';
import type { MinimalistAppearance } from '../types';
import { formatCareerYears } from '../utils/format-career-years';
import { scrollExpandedContent } from '../utils/scroll-expanded-content';
import { ContactLinks } from './contact-links';
import { ScrollFade } from './scroll-fade';

type AboutBioPanelProps = {
  appearance: MinimalistAppearance;
  open: boolean;
  data: PortfolioData;
  onClose: () => void;
};

const ABOUT_GRADIENT_BLOCK = 'minimalist__about-bio-panel__gradient';

function TextField({ label, value }: { label: string; value: string }) {
  return (
    <div className="minimalist__about-bio-panel__field gap-[4px]">
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  );
}

function QuestionField({ question, response }: { question: string; response: string }) {
  return (
    <div className="minimalist__about-bio-panel__field gap-[16px]">
      <h3>{question}</h3>
      <MarkdownText gapClassName="gap-[16px]">{response}</MarkdownText>
    </div>
  );
}

export function AboutBioPanel({ appearance, open, data, onClose }: AboutBioPanelProps) {
  const t = useTranslations('minimalist.recruiter');
  const locale = useLocale();
  const fieldsRef = useRef<HTMLDivElement>(null);
  const metaColumnRef = useRef<HTMLDivElement>(null);
  const primaryColumnRef = useRef<HTMLDivElement>(null);
  const asideColumnRef = useRef<HTMLDivElement>(null);
  // Só um scroller está ativo por vez (grid no mobile de coluna única, colunas no desktop);
  // o inativo não transborda e reporta showBottom=false, então o overlay certo aparece sozinho.
  // `locale` no lugar de `data.name`: os rótulos traduzidos (senioridade, experiência,
  // formação) mudam de tamanho ao trocar de idioma sem que `data` em si mude.
  const fieldsEdges = useScrollEdges(fieldsRef, open, locale);
  const metaEdges = useScrollEdges(metaColumnRef, open, locale);
  const primaryEdges = useScrollEdges(primaryColumnRef, open, data.bio?.questionTwo);
  const asideEdges = useScrollEdges(asideColumnRef, open, data.bio?.questionOne);
  const { years, approximate } = formatCareerYears(data.careerMonths);
  const educationLine = data.education[0]?.aliases.join(' | ') ?? '';
  const skillsLine = useMemo(
    () =>
      [...data.skills]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((skill) => skill.name)
        .join(', '),
    [data.skills],
  );

  // Land focus on the scroll area (not the collapse button) so ArrowUp/Down scroll the content immediately.
  useEffect(() => {
    if (open) window.requestAnimationFrame(() => fieldsRef.current?.focus({ preventScroll: true }));
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    // Try the grid (mobile scroller) then the primary column (desktop scroller).
    const scrolled =
      (fieldsRef.current && scrollExpandedContent(fieldsRef.current, event.key)) ||
      (primaryColumnRef.current && scrollExpandedContent(primaryColumnRef.current, event.key));
    if (!scrolled) return;
    event.preventDefault();
  };

  const metaFields: ReactNode[] = [
    <TextField key="name" label={t('nameLabel')} value={data.name} />,
    <TextField key="expertise" label={t('expertiseAreaLabel')} value={data.role} />,
    <TextField key="location" label={t('locationLabel')} value={data.location} />,
    <TextField
      key="experience"
      label={t('careerExperienceLabel')}
      value={t(approximate ? 'careerYearsApprox' : 'careerYearsExact', { years })}
    />,
  ];
  if (data.seniority) {
    metaFields.push(
      <TextField key="seniority" label={t('seniorityLabel')} value={t(`seniorityValues.${data.seniority}`)} />,
    );
  }
  if (educationLine) {
    metaFields.push(
      <div
        key="education"
        className="minimalist__about-bio-panel__field minimalist__about-bio-panel__field--education gap-[4px]"
      >
        <h3>{t('educationLabel')}</h3>
        <p>{educationLine}</p>
      </div>,
    );
  }

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
                className="minimalist__about-bio-panel__fields"
                data-project-expanded-content="true"
                tabIndex={0}
                onWheel={(event) => event.stopPropagation()}
              >
                {/* position: sticky precisa nascer como 1º filho do grid pra já ficar grudado no
                    topo (modo 1 coluna — nos outros o --grid fica display:none). */}
                <ScrollFade block={ABOUT_GRADIENT_BLOCK} edge="top" scroller="grid" visible={fieldsEdges.showTop} />

                <div
                  ref={metaColumnRef}
                  className="minimalist__about-bio-panel__column minimalist__about-bio-panel__column--meta"
                >
                  <ScrollFade block={ABOUT_GRADIENT_BLOCK} edge="top" scroller="meta" visible={metaEdges.showTop} />
                  {data.avatarUrl && (
                    <div
                      className="minimalist__about-bio-panel__portrait relative h-[220px] w-[220px] shrink-0"
                      aria-hidden="true"
                    >
                      <div className="relative h-full w-full overflow-hidden">
                        <Image src={data.avatarUrl} alt="" fill className="object-cover" />
                      </div>
                    </div>
                  )}
                  <div className="minimalist__about-bio-panel__meta-fields">{metaFields}</div>
                  <div className="minimalist__about-bio-panel__field minimalist__about-bio-panel__field--contacts gap-[4px]">
                    <h3>{t('contactsLabel')}</h3>
                    <ContactLinks data={data} appearance={appearance} />
                  </div>
                  <ScrollFade
                    block={ABOUT_GRADIENT_BLOCK}
                    edge="bottom"
                    scroller="meta"
                    visible={metaEdges.showBottom}
                  />
                </div>

                <div
                  ref={primaryColumnRef}
                  className="minimalist__about-bio-panel__column minimalist__about-bio-panel__column--primary"
                >
                  <ScrollFade
                    block={ABOUT_GRADIENT_BLOCK}
                    edge="top"
                    scroller="primary"
                    visible={primaryEdges.showTop}
                  />
                  {data.bio?.questionTwo && data.bio.responseTwo && (
                    <QuestionField question={data.bio.questionTwo} response={data.bio.responseTwo} />
                  )}
                  <ScrollFade
                    block={ABOUT_GRADIENT_BLOCK}
                    edge="bottom"
                    scroller="primary"
                    visible={primaryEdges.showBottom}
                  />
                </div>

                <div
                  ref={asideColumnRef}
                  className="minimalist__about-bio-panel__column minimalist__about-bio-panel__column--aside"
                >
                  <ScrollFade block={ABOUT_GRADIENT_BLOCK} edge="top" scroller="aside" visible={asideEdges.showTop} />
                  {data.bio?.questionOne && data.bio.responseOne && (
                    <QuestionField question={data.bio.questionOne} response={data.bio.responseOne} />
                  )}
                  {skillsLine && <TextField label={t('skillsLabel')} value={skillsLine} />}
                  <ScrollFade
                    block={ABOUT_GRADIENT_BLOCK}
                    edge="bottom"
                    scroller="aside"
                    visible={asideEdges.showBottom}
                  />
                </div>

                {/* Idem, mas como último filho — sticky "bottom: 0" precisa nascer grudado no fim. */}
                <ScrollFade
                  block={ABOUT_GRADIENT_BLOCK}
                  edge="bottom"
                  scroller="grid"
                  visible={fieldsEdges.showBottom}
                />
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
