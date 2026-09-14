'use client';

import { motion } from 'framer-motion';
import { useCallback, useRef, type ReactNode, type RefObject } from 'react';

import { MarkdownText } from '@/shared/components/markdown-text';
import type { ProjectEntry } from '@/shared/types/portfolio';

import { minimalistFadeTransition } from '../animations';
import { useScrollEdges } from '../hooks/use-scroll-edges';
import type { MinimalistAppearance } from '../types';
import { padGalleryImages } from '../utils/gallery-images';
import { fieldHeadingClass, fieldValueClass } from '../variants';
import { MinimalistAnchor } from './anchor';
import { ProjectCarousel } from './project-carousel';
import { ScrollFade } from './scroll-fade';

type Translate = (key: string, values?: Record<string, string | number>) => string;

function TextField({ appearance, label, value }: { appearance: MinimalistAppearance; label: string; value: string }) {
  return (
    <div className="minimalist__project-expanded-field gap-[4px]">
      <h3 className={fieldHeadingClass(appearance)}>{label}</h3>
      <p className={fieldValueClass(appearance)}>{value}</p>
    </div>
  );
}

function MarkdownField({
  appearance,
  label,
  value,
}: {
  appearance: MinimalistAppearance;
  label: string;
  value: string;
}) {
  return (
    <div className="minimalist__project-expanded-field gap-[4px]">
      <h3 className={fieldHeadingClass(appearance)}>{label}</h3>
      <MarkdownText gapClassName="gap-[12px]" className={fieldValueClass(appearance)}>
        {value}
      </MarkdownText>
    </div>
  );
}

export function ProjectExpandedPanel({
  project,
  period,
  appearance,
  t,
  fieldsRef,
  primaryColumnRef,
}: {
  project: ProjectEntry;
  period: string;
  appearance: MinimalistAppearance;
  t: Translate;
  /** Callback ref: foca o grid ao montar (scroll por teclado no mobile — coluna única). */
  fieldsRef: (node: HTMLDivElement | null) => void;
  /** Scroller da coluna principal (scroll por teclado no desktop). */
  primaryColumnRef: RefObject<HTMLDivElement | null>;
}) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const asideColumnRef = useRef<HTMLDivElement | null>(null);
  const setGrid = useCallback(
    (node: HTMLDivElement | null) => {
      gridRef.current = node;
      fieldsRef(node);
    },
    [fieldsRef],
  );

  // Só um dos scrollers está ativo por vez (grid no mobile de coluna única, colunas no desktop);
  // o inativo não transborda e reporta showBottom=false, então o overlay certo aparece sozinho.
  const gridEdges = useScrollEdges(gridRef, true, project.projectName);
  const primaryEdges = useScrollEdges(primaryColumnRef, true, project.projectName);
  const asideEdges = useScrollEdges(asideColumnRef, true, project.projectName);

  const primaryFields: ReactNode[] = [];
  if (project.objective)
    primaryFields.push(
      <MarkdownField
        key="objective"
        appearance={appearance}
        label={t('projectFields.objective')}
        value={project.objective}
      />,
    );
  if (project.whatIBuilt)
    primaryFields.push(
      <MarkdownField
        key="whatIBuilt"
        appearance={appearance}
        label={t('projectFields.whatIBuilt')}
        value={project.whatIBuilt}
      />,
    );

  const asideFields: ReactNode[] = [];
  if (project.challenge)
    asideFields.push(
      <MarkdownField
        key="challenge"
        appearance={appearance}
        label={t('projectFields.challenge')}
        value={project.challenge}
      />,
    );
  if (project.result)
    asideFields.push(
      <MarkdownField key="result" appearance={appearance} label={t('projectFields.result')} value={project.result} />,
    );
  if (project.stacks.length > 0) {
    asideFields.push(
      <TextField
        key="stack"
        appearance={appearance}
        label={t('projectFields.stack')}
        value={project.stacks.join(' + ')}
      />,
    );
  }

  return (
    <motion.div
      key="expanded"
      className="h-full w-full min-h-[340px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={minimalistFadeTransition}
    >
      <div
        id="minimalist-project-expanded-content"
        data-expanded="true"
        className="flex h-full min-h-0 w-full flex-col minimalist__project-detail--expanded"
      >
        <div className="minimalist__project-detail-body">
          <ProjectCarousel
            images={padGalleryImages(project.carrouselImages)}
            projectName={project.projectName}
            appearance={appearance}
          />

          <div
            ref={setGrid}
            className="minimalist__project-expanded-fields"
            data-project-expanded-content="true"
            tabIndex={0}
            onWheel={(event) => event.stopPropagation()}
          >
            {/* position: sticky precisa nascer como 1º filho do grid pra já ficar grudado no
                topo (modo 1 coluna — nos outros o --grid fica display:none). */}
            <ScrollFade block="minimalist__project-fade" edge="top" scroller="grid" visible={gridEdges.showTop} />

            <div className="minimalist__project-column minimalist__project-column--about">
              <TextField appearance={appearance} label={t('projectFields.name')} value={project.projectName} />
              <TextField appearance={appearance} label={t('projectFields.period')} value={period} />
              <div className="minimalist__project-expanded-field gap-[4px]">
                <h3 className={fieldHeadingClass(appearance)}>{t('projectFields.client')}</h3>
                <MinimalistAnchor
                  appearance={appearance}
                  href={project.companyUrl ?? ''}
                  disabled={!project.companyUrl}
                  variant="secondary"
                  uppercase={false}
                >
                  {project.company}
                </MinimalistAnchor>
              </div>
              <TextField
                appearance={appearance}
                label={t('projectFields.expertiseArea')}
                value={project.expertiseArea}
              />
            </div>

            <div ref={primaryColumnRef} className="minimalist__project-column minimalist__project-column--primary">
              <ScrollFade
                block="minimalist__project-fade"
                edge="top"
                scroller="primary"
                visible={primaryEdges.showTop}
              />
              {primaryFields}
              <ScrollFade
                block="minimalist__project-fade"
                edge="bottom"
                scroller="primary"
                visible={primaryEdges.showBottom}
              />
            </div>

            <div ref={asideColumnRef} className="minimalist__project-column minimalist__project-column--aside">
              <ScrollFade block="minimalist__project-fade" edge="top" scroller="aside" visible={asideEdges.showTop} />
              {asideFields}
              <ScrollFade
                block="minimalist__project-fade"
                edge="bottom"
                scroller="aside"
                visible={asideEdges.showBottom}
              />
            </div>

            {/* Idem, mas como último filho — sticky "bottom: 0" precisa nascer grudado no fim. */}
            <ScrollFade block="minimalist__project-fade" edge="bottom" scroller="grid" visible={gridEdges.showBottom} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
