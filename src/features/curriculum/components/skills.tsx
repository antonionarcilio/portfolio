'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

import type { CurriculumData } from '@/features/curriculum/types/curriculum';
import { skillRank } from '@/features/curriculum/utils/skills';

import { ScrollList } from './scroll-list';

const RANK_COLORS: Record<string, string> = {
  S: '#ff5da8',
  A: '#2bd6ff',
  B: '#4ed46a',
  C: '#e3d34a',
  D: '#ff8a3d',
  F: '#3b5366',
};

const RANK_LEGEND = [
  { rank: 'S', range: '9–10', title: '9 a 10 anos · Elite' },
  { rank: 'A', range: '7–9', title: '7 a 9 anos · Especialista' },
  { rank: 'B', range: '5–7', title: '5 a 7 anos · Avançado' },
  { rank: 'C', range: '3–5', title: '3 a 5 anos · Intermediário' },
  { rank: 'D', range: '1–3', title: '1 a 3 anos · Iniciante' },
];

export function Skills({
  skills,
  flash,
  onFlashEnd,
}: {
  skills: CurriculumData['skills'];
  flash?: boolean;
  onFlashEnd?: () => void;
}) {
  const sorted = [...skills].sort((a, b) =>
    a.priority !== b.priority ? a.priority - b.priority : a.name.localeCompare(b.name),
  );
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="skills-section">
      <h3
        className={clsx(
          "flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]",
          flash && 'animate-flash-header',
        )}
        onAnimationEnd={onFlashEnd}
      >
        Habilidades
      </h3>
      <div className="flex justify-between items-baseline -mt-2 mb-[10px] text-[10px] tracking-[0.18em] uppercase">
        <span className="text-cv-cyan-dim">
          Escala em anos · <span className="text-cv-cyan">meta 10 = expert</span>
        </span>
        <span className="text-cv-cyan-dim">0 — — 5 — — 10</span>
      </div>
      <div className="flex items-center gap-[10px] mb-[16px] text-[10px] text-cv-text-muted tracking-[0.18em] uppercase flex-wrap">
        <span className="text-cv-cyan">Classificação:</span>
        {RANK_LEGEND.map(({ rank, range, title }) => (
          <span key={rank} className="group inline-flex items-center gap-[5px] cursor-default" title={title}>
            <span
              className="inline-flex items-center justify-center w-[14px] h-[14px] border text-[9px] leading-none"
              style={{ color: RANK_COLORS[rank], borderColor: RANK_COLORS[rank] }}
            >
              {rank}
            </span>
            <span className="text-cv-cyan-dim transition-colors duration-200 group-hover:text-cv-cyan">
              {range}
            </span>
          </span>
        ))}
      </div>
      <ScrollList maxHeight={190}>
        {sorted.map((skill, i) => {
          const rank = skillRank(skill.years);
          const rankColor = RANK_COLORS[rank];
          const pct = Math.min((skill.years / 10) * 100, 100);
          return (
            <div key={skill.name} className="grid grid-cols-[90px_1fr_36px] items-center gap-[14px] mb-[12px]">
              <div className="text-cv-text text-[13px]">{skill.name}</div>
              <div className="h-2 bg-cv-gray-bar rounded-[1px] overflow-hidden relative">
                <div
                  className="h-full transition-[width] duration-[1400ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] shadow-[0_0_8px_currentColor]"
                  style={{
                    width: filled ? `${pct}%` : '0%',
                    background: skill.color,
                    color: skill.color,
                    transitionDelay: `${i * 80}ms`,
                  }}
                />
              </div>
              <div
                className="text-center text-[22px] leading-none font-cv-mono"
                style={{
                  color: rankColor,
                  textShadow: rank !== 'F' ? `0 0 10px ${rankColor}` : 'none',
                }}
              >
                {rank}
              </div>
            </div>
          );
        })}
      </ScrollList>
    </div>
  );
}
