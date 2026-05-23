'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { Tooltip } from '@/components/tooltip';
import type { CurriculumData } from '@/features/curriculum/types/curriculum';

const W = 500;
const H = 460;
const CX = W / 2;
const CY = H / 2 + 6;
const R = 140;
const MAX = 10;
const RINGS = 5;

function angleFor(i: number, n: number) {
  return -Math.PI / 2 + (i * 2 * Math.PI) / n;
}

function polarPt(i: number, ratio: number, n: number): [number, number] {
  const a = angleFor(i, n);
  return [CX + Math.cos(a) * R * ratio, CY + Math.sin(a) * R * ratio];
}

const LEVEL_COLOR: Record<string, string> = {
  elite: '#ff5da8',
  high: '#2bd6ff',
  mid: '#e3d34a',
  low: '#ff8a3d',
};

function itemLevel(s: number) {
  if (s >= 9) return 'elite';
  if (s >= 7) return 'high';
  if (s >= 4) return 'mid';
  return 'low';
}

type SkillCategory = CurriculumData['skillCategories'][number];

function RadarChart({ categories, animated }: { categories: SkillCategory[]; animated: boolean }) {
  const n = categories.length;

  const rings = Array.from({ length: RINGS }, (_, ri) => {
    const ratio = (ri + 1) / RINGS;
    return Array.from({ length: n }, (__, i) => polarPt(i, ratio, n))
      .map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`)
      .join(' ');
  });

  const dataPts = categories.map((cat, i) => polarPt(i, cat.value / MAX, n));
  const dataPath =
    dataPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + ' Z';

  const labelPos = categories.map((_, i) => {
    const a = angleFor(i, n);
    const lx = CX + Math.cos(a) * (R + 26);
    const ly = CY + Math.sin(a) * (R + 26);
    let anchor: 'middle' | 'start' | 'end' = 'middle';
    if (Math.cos(a) > 0.2) anchor = 'start';
    else if (Math.cos(a) < -0.2) anchor = 'end';
    return { x: lx, y: ly, anchor };
  });

  return (
    <div className="relative w-full max-w-[460px] mx-auto select-none" style={{ aspectRatio: '1 / 0.95' }}>
      <svg className="w-full h-full block overflow-visible" viewBox={`0 0 ${W} ${H}`} aria-label="Radar de habilidades">
        {rings.map((pts, i) => (
          <polygon
            key={`ring${i}`}
            points={pts}
            fill="none"
            stroke={i === rings.length - 1 ? '#1d8aa8' : '#1a3a52'}
            strokeWidth={1}
            opacity={i === rings.length - 1 ? 0.5 : 1}
          />
        ))}
        {categories.map((_, i) => {
          const [x, y] = polarPt(i, 1, n);
          return <line key={`ax${i}`} x1={CX} y1={CY} x2={x} y2={y} stroke="#1a3a52" strokeWidth={1} />;
        })}
        {[2, 4, 6, 8, 10].map((v) => (
          <text
            key={`tick${v}`}
            x={CX + 4}
            y={CY - (v / MAX) * R + 3}
            fill="#3b5366"
            fontSize={8}
            fontFamily='"Share Tech Mono", monospace'
          >
            {v}
          </text>
        ))}
        <g style={{ transformOrigin: 'center', animation: 'radarBeam 8s linear infinite', opacity: 0.5 }}>
          <line
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY - R}
            stroke="rgba(43,214,255,0.35)"
            strokeWidth={1}
            strokeDasharray="3 4"
          />
        </g>
        <path
          d={dataPath}
          fill="rgba(43,214,255,0.18)"
          stroke="#2bd6ff"
          strokeWidth={1.5}
          style={{
            filter: 'drop-shadow(0 0 6px rgba(43,214,255,0.6))',
            transformOrigin: 'center',
            transformBox: 'fill-box',
            transform: animated ? 'scale(1)' : 'scale(0.05)',
            transition: 'transform 1.2s cubic-bezier(.2,.7,.2,1)',
          }}
        />
        {dataPts.map((p, i) => (
          <circle
            key={`v${i}`}
            cx={p[0]}
            cy={p[1]}
            r={3.5}
            fill="#2bd6ff"
            stroke="#03060f"
            strokeWidth={1.5}
            style={{
              filter: 'drop-shadow(0 0 4px #2bd6ff)',
              opacity: animated ? 1 : 0,
              transition: `opacity .4s ease ${300 + i * 60}ms`,
            }}
          />
        ))}
        {categories.map((cat, i) => (
          <g key={`label${i}`}>
            <text
              x={labelPos[i].x}
              y={labelPos[i].y}
              textAnchor={labelPos[i].anchor}
              dominantBaseline="middle"
              fill="#cfeaf5"
              fontSize={10}
              letterSpacing="0.16em"
              fontFamily='"Share Tech Mono", monospace'
            >
              {cat.name.toUpperCase()}
            </text>
            <text
              x={labelPos[i].x}
              y={labelPos[i].y + 13}
              textAnchor={labelPos[i].anchor}
              dominantBaseline="middle"
              fill="#2bd6ff"
              fontSize={11}
              letterSpacing="0.04em"
              fontFamily='"Share Tech Mono", monospace'
            >
              {cat.value.toFixed(1).replace('.', ',')}/10
            </text>
          </g>
        ))}
        <circle cx={CX} cy={CY} r={2.5} fill="#2bd6ff" />
      </svg>

      {/* HTML overlays: convert SVG coords → CSS %. Scale = W_c/W (width-constrained).
          Vertical offset = 0.015×W_c (SVG 0.92h centred in 0.95h container).
          The outer div must be the absolutely-positioned element so floating-ui reads the correct anchor rect. */}
      {categories.map((cat, i) => {
        const { x, y, anchor } = labelPos[i];
        const left = `${(x / W) * 100}%`;
        const top = `${((0.015 + (y + 6.5) / W) / 0.95) * 100}%`;
        const tx = anchor === 'start' ? '0%' : anchor === 'end' ? '-100%' : '-50%';
        return (
          <div
            key={`tip${i}`}
            style={{ position: 'absolute', left, top, transform: `translateX(${tx}) translateY(-50%)` }}
          >
            <Tooltip title={cat.name} description={`${cat.value.toFixed(1).replace('.', ',')}/10`}>
              <span className="w-auto min-[480px]:w-[90px]" style={{ display: 'block', height: '28px' }} />
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}

function CategoryCard({ cat, animated }: { cat: SkillCategory; animated: boolean }) {
  return (
    <div
      className="bg-cv-panel h-full box-border border border-cv-border hover:border-cv-cyan transition-[border-color] duration-[250ms]"
      style={{ padding: '9px 10px 7px', minWidth: 0 }}
    >
      <div className="flex items-baseline justify-between gap-[6px] mb-[6px]">
        <span className="text-cv-cyan text-[10px] tracking-[0.18em] uppercase min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
          {cat.name}
        </span>
        <span
          className="text-cv-cyan text-[11px] tracking-[0.04em] tabular-nums whitespace-nowrap"
          style={{ textShadow: '0 0 8px rgba(43,214,255,0.4)' }}
        >
          {cat.value.toFixed(1).replace('.', ',')}
          <span className="text-cv-text-muted text-[9px]">/10</span>
        </span>
      </div>
      {cat.items.map((item) => {
        const color = LEVEL_COLOR[itemLevel(item.score)];
        return (
          <div key={item.name} className="grid grid-cols-[minmax(0,1fr)_50px_18px] items-center gap-[6px] py-[2px]">
            <span className="text-cv-text text-[11px] tracking-[0.02em] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
              {item.name}
            </span>
            <div className="h-[4px] bg-cv-gray-bar relative overflow-hidden">
              <span
                className="block h-full"
                style={{
                  background: color,
                  boxShadow: `0 0 6px ${color}`,
                  transformOrigin: 'left center',
                  transform: animated ? `scaleX(${item.score / 10})` : 'scaleX(0)',
                  transition: 'transform .9s cubic-bezier(.2,.7,.2,1)',
                }}
              />
            </div>
            <span className="text-cv-text-dim text-[10px] text-right tabular-nums">{item.score}</span>
          </div>
        );
      })}
    </div>
  );
}

const AUTOPLAY_DELAY = 6000;

function Carousel({ categories, animated }: { categories: SkillCategory[]; animated: boolean }) {
  const [perPage, setPerPage] = useState(2);
  const pages = Math.ceil(categories.length / perPage);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 520px)');
    const update = () => setPerPage(mq.matches ? 1 : 2);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setPage(0);
  }, [perPage]);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setPage((p) => (p + 1) % pages);
    }, AUTOPLAY_DELAY);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, pages]);

  return (
    <div
      className="flex flex-col min-w-0 w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* padding:1px exposes the right card's border before overflow clip */}
      <div className="overflow-hidden" style={{ padding: '1px' }}>
        <div
          style={{
            display: 'flex',
            transform: `translateX(${-page * 100}%)`,
            transition: 'transform .35s cubic-bezier(.2,.7,.2,1)',
            willChange: 'transform',
          }}
        >
          {categories.map((cat, i) => {
            const catPage = Math.floor(i / perPage);
            return (
              <div
                key={cat.name}
                aria-hidden={catPage !== page}
                style={{
                  flex: `0 0 ${100 / perPage}%`,
                  minWidth: 0,
                  paddingRight: perPage > 1 && i % perPage === 0 ? '8px' : '0',
                  boxSizing: 'border-box',
                }}
              >
                <CategoryCard cat={cat} animated={animated} />
              </div>
            );
          })}
        </div>
      </div>

      {/* dots — one per page */}
      <div className="flex gap-[6px] items-center justify-center mt-[10px]">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            className={clsx(
              'h-[3px] border-none cursor-pointer p-0 transition-all duration-200',
              i === page ? 'w-[28px] bg-cv-cyan' : 'w-[20px] bg-cv-border',
            )}
            style={i === page ? { boxShadow: '0 0 8px #2bd6ff' } : undefined}
            onClick={() => setPage(i)}
            aria-label={`Página ${i + 1}`}
          />
        ))}
      </div>

      <div className="mt-[14px] px-[12px] py-[8px] border border-dashed border-cv-border text-[10px] tracking-[0.1em] text-cv-text-muted leading-[1.7] hover:text-cv-text transition-colors duration-200">
        <span className="text-cv-cyan">Critério · </span>
        <Tooltip title="1–3 Básico" description="conhecimento superficial ou uso com apoio">
          <span className="cursor-help">1–3 Básico</span>
        </Tooltip>
        {' · '}
        <Tooltip title="4–6 Intermediário" description="uso regular com autonomia">
          <span className="cursor-help">4–6 Intermediário</span>
        </Tooltip>
        {' · '}
        <Tooltip title="7–8 Avançado" description="domínio sólido, resolve problemas complexos">
          <span className="cursor-help">7–8 Avançado</span>
        </Tooltip>
        {' · '}
        <Tooltip title="9–10 Especialista" description="referência na tecnologia">
          <span className="cursor-help">9–10 Especialista</span>
        </Tooltip>
      </div>
    </div>
  );
}

export function Skills({
  skillCategories,
  flash,
  onFlashEnd,
}: {
  skillCategories: CurriculumData['skillCategories'];
  flash?: boolean;
  onFlashEnd?: () => void;
}) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
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
      <div className="flex justify-between text-[10px] text-cv-text-muted tracking-[0.2em] uppercase mt-[6px] mb-[20px] hover:text-cv-text transition-colors duration-200 cursor-default">
        <span>Escala 0 — 10</span>
        <Tooltip content="Meta 10 = Expert">
          <span className="text-cv-cyan">Meta 10 = Expert</span>
        </Tooltip>
      </div>
      <div className="flex flex-col gap-[28px] items-stretch">
        <RadarChart categories={skillCategories} animated={animated} />
        <Carousel categories={skillCategories} animated={animated} />
      </div>
    </div>
  );
}
