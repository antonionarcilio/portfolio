'use client';

import { motion } from 'framer-motion';
import { useCallback, useRef, type ReactNode, type RefObject } from 'react';

import { MarkdownText } from '@/shared/components/markdown-text';
import type { ProjectEntry } from '@/shared/types/portfolio';

import { minimalistFadeTransition } from '../animations';
import { useScrollEdges } from '../hooks/use-scroll-edges';
import type { MinimalistAppearance } from '../types';
import { padGalleryImages } from '../utils/gallery-images';
import { MinimalistAnchor } from './anchor';
import { ProjectCarousel } from './project-carousel';
import { ScrollFade } from './scroll-fade';

type Translate = (key: string, values?: Record<string, string | number>) => string;

function TextField({ label, value }: { label: string; value: string }) {
  return (
    <div className="minimalist__project-expanded-field gap-[4px]">
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  );
}

function MarkdownField({ label, value }: { label: string; value: string }) {
  return (
    <div className="minimalist__project-expanded-field gap-[4px]">
      <h3>{label}</h3>
      <MarkdownText gapClassName="gap-[12px]">{value}</MarkdownText>
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
      <MarkdownField key="objective" label={t('projectFields.objective')} value={project.objective} />,
    );
  if (project.whatIBuilt)
    primaryFields.push(
      <MarkdownField key="whatIBuilt" label={t('projectFields.whatIBuilt')} value={project.whatIBuilt} />,
    );

  const asideFields: ReactNode[] = [];
  if (project.challenge)
    asideFields.push(<MarkdownField key="challenge" label={t('projectFields.challenge')} value={project.challenge} />);
  if (project.result)
    asideFields.push(<MarkdownField key="result" label={t('projectFields.result')} value={project.result} />);
  if (project.stacks.length > 0) {
    asideFields.push(<TextField key="stack" label={t('projectFields.stack')} value={project.stacks.join(' + ')} />);
  }

  return (
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
          <ProjectCarousel images={padGalleryImages(project.carrouselImages)} projectName={project.projectName} />

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
              <TextField label={t('projectFields.name')} value={project.projectName} />
              <TextField label={t('projectFields.period')} value={period} />
              <div className="minimalist__project-expanded-field gap-[4px]">
                <h3>{t('projectFields.client')}</h3>
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
              <TextField label={t('projectFields.expertiseArea')} value={project.expertiseArea} />
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
