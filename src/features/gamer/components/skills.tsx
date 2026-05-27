'use client';

function average(arr: number[]): number {
  const n = arr.length;
  if (n === 0) return 0;
  return arr.reduce((acc, v) => acc + v, 0) / n;
}

function getCategoryAverageScore(items: { score: number }[]): number {
  return average(items.map((i) => i.score));
}

import { animate, motion, useInView, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import type { PortfolioData } from '@/features/gamer/types/portfolio';
import { Tooltip } from './tooltip';

import { FlashHeading } from './flash-heading';

// Geometry from radar.svg (Figma export) — viewBox 0 0 450 450
const W = 450;
const H = 450;
const CX = 220.76;
const CY = 226;
const R = 140;
const MAX = 10;
const LABEL_DIST = R + 33; // distance from center to label anchor (matches SVG design)

// Static grid paths from radar.svg — hexagonal rings (inner → outer)
const RING_PATHS: Array<{ d: string; stroke: string; opacity?: number }> = [
  { d: 'M220.76 198L245.01 212V240L220.76 254L196.51 240V212L220.76 198Z', stroke: '#1A3A52' },
  { d: 'M220.76 170L269.26 198V254L220.76 282L172.26 254V198L220.76 170Z', stroke: '#1A3A52' },
  { d: 'M220.76 142L293.51 184V268L220.76 310L148.01 268V184L220.76 142Z', stroke: '#1A3A52' },
  { d: 'M220.76 114L317.75 170V282L220.76 338L123.77 282V170L220.76 114Z', stroke: '#1A3A52' },
  { d: 'M220.76 86L342 156V296L220.76 366L99.5202 296V156L220.76 86Z', stroke: '#1D8AA8', opacity: 0.5 },
];

// Static axis paths from radar.svg — 6 spokes from center
const AXIS_PATHS = [
  'M220.76 226V86',
  'M220.76 226L342.004 156',
  'M220.76 226L342.004 296',
  'M220.76 226V366',
  'M220.76 226L99.5167 296',
  'M220.76 226L99.5167 156',
];

// Vector tick-mark paths from radar.svg — numerals 2, 4, 6, 8, 10 placed on the top axis
const TICK_PATHS = [
  'M218.862 201V200.489L220.783 198.386C221.008 198.14 221.194 197.926 221.34 197.744C221.486 197.561 221.594 197.388 221.664 197.227C221.736 197.064 221.772 196.894 221.772 196.716C221.772 196.511 221.722 196.334 221.624 196.185C221.527 196.035 221.395 195.92 221.226 195.838C221.058 195.757 220.868 195.716 220.658 195.716C220.434 195.716 220.239 195.762 220.073 195.855C219.908 195.946 219.78 196.074 219.689 196.239C219.6 196.403 219.556 196.597 219.556 196.818H218.885C218.885 196.477 218.964 196.178 219.121 195.92C219.278 195.663 219.492 195.462 219.763 195.318C220.036 195.174 220.342 195.102 220.681 195.102C221.022 195.102 221.324 195.174 221.587 195.318C221.85 195.462 222.057 195.656 222.206 195.901C222.356 196.145 222.431 196.417 222.431 196.716C222.431 196.93 222.392 197.139 222.314 197.344C222.238 197.546 222.106 197.773 221.916 198.023C221.729 198.271 221.469 198.574 221.135 198.932L219.828 200.33V200.375H222.533V201H218.862Z',
  'M218.226 171.807V171.227L220.783 167.182H221.203V168.08H220.919L218.987 171.136V171.182H222.431V171.807H218.226ZM220.965 173V171.631V171.361V167.182H221.635V173H220.965Z',
  'M220.794 145.08C220.556 145.076 220.317 145.03 220.078 144.943C219.84 144.856 219.622 144.709 219.425 144.503C219.228 144.295 219.07 144.013 218.951 143.659C218.831 143.303 218.772 142.856 218.772 142.318C218.772 141.803 218.82 141.347 218.916 140.949C219.013 140.549 219.153 140.213 219.337 139.94C219.521 139.666 219.742 139.457 220.002 139.315C220.263 139.173 220.558 139.102 220.885 139.102C221.211 139.102 221.501 139.168 221.755 139.298C222.01 139.427 222.219 139.607 222.38 139.838C222.541 140.069 222.645 140.335 222.692 140.636H221.999C221.934 140.375 221.809 140.158 221.624 139.986C221.438 139.813 221.192 139.727 220.885 139.727C220.434 139.727 220.079 139.923 219.82 140.315C219.562 140.707 219.433 141.258 219.431 141.966H219.476C219.582 141.805 219.708 141.668 219.854 141.554C220.002 141.438 220.165 141.349 220.343 141.287C220.521 141.224 220.709 141.193 220.908 141.193C221.241 141.193 221.546 141.277 221.823 141.443C222.099 141.608 222.321 141.836 222.487 142.128C222.654 142.418 222.737 142.75 222.737 143.125C222.737 143.485 222.657 143.814 222.496 144.114C222.335 144.411 222.109 144.648 221.817 144.824C221.527 144.998 221.186 145.083 220.794 145.08ZM220.794 144.455C221.033 144.455 221.247 144.395 221.436 144.276C221.628 144.156 221.778 143.996 221.888 143.795C222 143.595 222.056 143.371 222.056 143.125C222.056 142.884 222.002 142.666 221.894 142.469C221.788 142.27 221.641 142.112 221.453 141.994C221.268 141.877 221.056 141.818 220.817 141.818C220.637 141.818 220.47 141.854 220.314 141.926C220.159 141.996 220.023 142.093 219.905 142.216C219.79 142.339 219.699 142.48 219.632 142.639C219.566 142.796 219.533 142.962 219.533 143.136C219.533 143.367 219.587 143.583 219.695 143.784C219.805 143.985 219.954 144.147 220.144 144.27C220.335 144.393 220.552 144.455 220.794 144.455Z',
  'M220.726 117.08C220.336 117.08 219.991 117.01 219.692 116.872C219.395 116.732 219.163 116.54 218.996 116.295C218.829 116.049 218.747 115.769 218.749 115.455C218.747 115.208 218.795 114.981 218.894 114.773C218.992 114.562 219.127 114.387 219.297 114.247C219.47 114.105 219.662 114.015 219.874 113.977V113.943C219.595 113.871 219.374 113.715 219.209 113.474C219.044 113.232 218.963 112.956 218.965 112.648C218.963 112.352 219.038 112.088 219.189 111.855C219.341 111.622 219.549 111.438 219.814 111.304C220.081 111.17 220.385 111.102 220.726 111.102C221.063 111.102 221.364 111.17 221.63 111.304C221.895 111.438 222.103 111.622 222.255 111.855C222.408 112.088 222.486 112.352 222.487 112.648C222.486 112.956 222.401 113.232 222.235 113.474C222.07 113.715 221.851 113.871 221.578 113.943V113.977C221.789 114.015 221.978 114.105 222.147 114.247C222.315 114.387 222.45 114.562 222.55 114.773C222.65 114.981 222.702 115.208 222.703 115.455C222.702 115.769 222.616 116.049 222.448 116.295C222.281 116.54 222.049 116.732 221.752 116.872C221.456 117.01 221.114 117.08 220.726 117.08ZM220.726 116.455C220.989 116.455 221.217 116.412 221.408 116.327C221.599 116.241 221.747 116.121 221.851 115.966C221.955 115.811 222.008 115.629 222.01 115.42C222.008 115.201 221.952 115.007 221.84 114.838C221.728 114.67 221.576 114.537 221.382 114.44C221.191 114.344 220.972 114.295 220.726 114.295C220.478 114.295 220.256 114.344 220.061 114.44C219.868 114.537 219.716 114.67 219.604 114.838C219.494 115.007 219.44 115.201 219.442 115.42C219.44 115.629 219.49 115.811 219.593 115.966C219.697 116.121 219.845 116.241 220.039 116.327C220.232 116.412 220.461 116.455 220.726 116.455ZM220.726 113.693C220.934 113.693 221.119 113.652 221.28 113.568C221.443 113.485 221.571 113.368 221.664 113.219C221.756 113.069 221.804 112.894 221.806 112.693C221.804 112.496 221.757 112.325 221.666 112.179C221.576 112.031 221.45 111.918 221.289 111.838C221.128 111.757 220.94 111.716 220.726 111.716C220.508 111.716 220.318 111.757 220.155 111.838C219.992 111.918 219.866 112.031 219.777 112.179C219.688 112.325 219.645 112.496 219.647 112.693C219.645 112.894 219.689 113.069 219.78 113.219C219.873 113.368 220.001 113.485 220.164 113.568C220.327 113.652 220.514 113.693 220.726 113.693Z',
  'M219.108 90.1818V96H218.403V90.9205H218.369L216.949 91.8636V91.1477L218.403 90.1818H219.108ZM222.679 96.0795C222.251 96.0795 221.886 95.9631 221.585 95.7301C221.284 95.4953 221.054 95.1553 220.895 94.7102C220.736 94.2633 220.656 93.7235 220.656 93.0909C220.656 92.4621 220.736 91.9252 220.895 91.4801C221.056 91.0331 221.287 90.6922 221.588 90.4574C221.891 90.2206 222.255 90.1023 222.679 90.1023C223.103 90.1023 223.466 90.2206 223.767 90.4574C224.07 90.6922 224.301 91.0331 224.46 91.4801C224.621 91.9252 224.702 92.4621 224.702 93.0909C224.702 93.7235 224.622 94.2633 224.463 94.7102C224.304 95.1553 224.074 95.4953 223.773 95.7301C223.472 95.9631 223.107 96.0795 222.679 96.0795ZM222.679 95.4545C223.103 95.4545 223.433 95.25 223.668 94.8409C223.902 94.4318 224.02 93.8485 224.02 93.0909C224.02 92.5871 223.966 92.1581 223.858 91.804C223.752 91.4498 223.598 91.1799 223.398 90.9943C223.199 90.8087 222.959 90.7159 222.679 90.7159C222.259 90.7159 221.93 90.9233 221.693 91.3381C221.456 91.7509 221.338 92.3352 221.338 93.0909C221.338 93.5947 221.391 94.0227 221.497 94.375C221.603 94.7273 221.756 94.9953 221.955 95.179C222.155 95.3627 222.397 95.4545 222.679 95.4545Z',
];

function angleFor(i: number, n: number) {
  return -Math.PI / 2 + (i * 2 * Math.PI) / n;
}

function polarPt(i: number, ratio: number, n: number): [number, number] {
  const a = angleFor(i, n);
  return [CX + Math.cos(a) * R * ratio, CY + Math.sin(a) * R * ratio];
}

type SkillCategory = PortfolioData['skillCategories'][number];

/**
 * Animates a sonar sweep line using RAF-driven angle state,
 * computing SVG x2/y2 directly to avoid transform-origin issues.
 */
function SonarBeam({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const angle = useMotionValue(-Math.PI / 2);
  const [pt, setPt] = useState({ x2: cx, y2: cy - r });

  useEffect(() => {
    const unsub = angle.on('change', (a) => {
      setPt({ x2: cx + Math.cos(a) * r, y2: cy + Math.sin(a) * r });
    });
    const controls = animate(angle, -Math.PI / 2 + 2 * Math.PI, {
      duration: 8,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
      onRepeat: () => angle.set(-Math.PI / 2),
    });
    return () => {
      unsub();
      controls.stop();
    };
  }, [angle, cx, cy, r]);

  return (
    <line
      x1={cx}
      y1={cy}
      x2={pt.x2}
      y2={pt.y2}
      stroke="rgba(43,214,255,0.35)"
      strokeWidth={1}
      strokeDasharray="3 4"
      opacity={0.5}
    />
  );
}

function RadarChart({ categories }: { categories: SkillCategory[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '0px 0px -60px 0px' });
  const n = categories.length;

  const dataPts = categories.map((cat, i) => polarPt(i, getCategoryAverageScore(cat.items) / MAX, n));
  const dataPath =
    dataPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + ' Z';

  const labelPos = categories.map((_, i) => {
    const a = angleFor(i, n);
    const lx = CX + Math.cos(a) * LABEL_DIST;
    const ly = CY + Math.sin(a) * LABEL_DIST;
    let anchor: 'middle' | 'start' | 'end' = 'middle';
    if (Math.cos(a) > 0.2) anchor = 'start';
    else if (Math.cos(a) < -0.2) anchor = 'end';
    return { x: lx, y: ly, anchor };
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[450px] mx-auto select-none"
      style={{ aspectRatio: '1 / 1' }}
    >
      <svg className="w-full h-full block overflow-visible" viewBox={`0 0 ${W} ${H}`} aria-label="Radar de habilidades">
        {/* Static hexagonal grid from radar.svg */}
        {RING_PATHS.map((ring, i) => (
          <path
            key={`ring${i}`}
            d={ring.d}
            fill="none"
            stroke={ring.stroke}
            strokeWidth={1}
            opacity={ring.opacity ?? 1}
          />
        ))}
        {AXIS_PATHS.map((d, i) => (
          <path key={`ax${i}`} d={d} stroke="#1A3A52" strokeWidth={1} />
        ))}
        {/* Vector tick numerals from radar.svg */}
        {TICK_PATHS.map((d, i) => (
          <path key={`tick${i}`} d={d} fill="#3B5366" />
        ))}
        {/* Sonar sweep */}
        <SonarBeam cx={CX} cy={CY} r={R} />
        {/* Dynamic data polygon — computed from categories */}
        <motion.path
          d={dataPath}
          fill="rgba(43,214,255,0.18)"
          stroke="#2bd6ff"
          strokeWidth={1.5}
          style={{
            filter: 'drop-shadow(0 0 6px rgba(43,214,255,0.6))',
            transformBox: 'fill-box',
            transformOrigin: 'center',
          }}
          initial={{ scale: 0.05 }}
          animate={{ scale: isInView ? 1 : 0.05 }}
          transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1], delay: 0.15 }}
        />
        {/* Dynamic vertex dots */}
        {dataPts.map((p, i) => (
          <motion.circle
            key={`v${i}`}
            cx={p[0]}
            cy={p[1]}
            r={3.5}
            fill="#2bd6ff"
            stroke="#03060f"
            strokeWidth={1.5}
            style={{ filter: 'drop-shadow(0 0 4px #2bd6ff)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.45 + i * 0.06 }}
          />
        ))}
        {/* Dynamic labels — category name + value */}
        {categories.map((cat, i) => (
          <motion.g
            key={`label${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.6 + i * 0.15 }}
          >
            <text
              x={labelPos[i].x}
              y={labelPos[i].y - 6}
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
              y={labelPos[i].y + 7}
              textAnchor={labelPos[i].anchor}
              dominantBaseline="middle"
              fill="#2bd6ff"
              fontSize={11}
              letterSpacing="0.04em"
              fontFamily='"Share Tech Mono", monospace'
            >
              {getCategoryAverageScore(cat.items).toFixed(1).replace('.', ',')}/10
            </text>
          </motion.g>
        ))}
        <circle cx={CX} cy={CY} r={2.5} fill="#2bd6ff" />
      </svg>

      {/* HTML overlays for tooltips — SVG is square (W=H=450), coords map directly to % */}
      {categories.map((cat, i) => {
        const { x, y, anchor } = labelPos[i];
        const left = `${(x / W) * 100}%`;
        const top = `${(y / H) * 100}%`;
        const tx = anchor === 'start' ? '0%' : anchor === 'end' ? '-100%' : '-50%';
        return (
          <div
            key={`tip${i}`}
            style={{ position: 'absolute', left, top, transform: `translateX(${tx}) translateY(-50%)` }}
          >
            <Tooltip
              title={cat.name}
              description={`${getCategoryAverageScore(cat.items).toFixed(1).replace('.', ',')}/10`}
            >
              <span
                className="w-auto min-[480px]:w-[90px] cursor-gamer-help"
                style={{ display: 'block', height: '28px' }}
              />
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}

function CategoryCard({ cat }: { cat: SkillCategory }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '0px 0px -20px 0px' });

  return (
    <motion.div
      ref={cardRef}
      className="bg-cv-panel h-full box-border border border-cv-border"
      whileHover={{ borderColor: '#2bd6ff', boxShadow: '0 0 24px rgba(43,214,255,0.12)' }}
      transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
      style={{ padding: '9px 10px 7px', minWidth: 0 }}
    >
      <div className="flex items-baseline justify-between gap-[6px] mb-[6px]">
        <div className="text-cv-cyan text-[10px] tracking-[0.18em] uppercase min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
          {cat.name}
        </div>
        <div
          className="text-cv-cyan text-[11px] tracking-[0.04em] tabular-nums whitespace-nowrap"
          style={{ textShadow: '0 0 8px rgba(43,214,255,0.4)' }}
        >
          {getCategoryAverageScore(cat.items).toFixed(1).replace('.', ',')}
          <div className="text-cv-text-muted text-[9px] inline">/10</div>
        </div>
      </div>
      {cat.items.map((item) => {
        const color = '#2bd6ff';
        return (
          <div key={item.name} className="grid grid-cols-[minmax(0,1fr)_50px_18px] items-center gap-[6px] py-[2px]">
            <div className="text-cv-text text-[11px] tracking-[0.02em] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
              {item.name}
            </div>
            <div className="h-[4px] bg-cv-gray-bar relative overflow-hidden">
              <motion.div
                className="block h-full"
                style={{ background: color, boxShadow: `0 0 6px ${color}`, transformOrigin: 'left center' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isInView ? item.score / 10 : 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1], delay: 0.15 }}
              />
            </div>
            <div className="text-cv-text-dim text-[10px] text-right tabular-nums">{item.score}</div>
          </div>
        );
      })}
    </motion.div>
  );
}

const AUTOPLAY_DELAY = 6000;

function Carousel({ categories }: { categories: SkillCategory[] }) {
  const [perPage, setPerPage] = useState(2);
  const pages = Math.ceil(categories.length / perPage);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackX = useMotionValue(0);

  // Rastreia o início do ponteiro para calcular delta de swipe
  const pointerStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 40;

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

  // Garante que o track começa em x=0 ao montar (evita valor residual do HMR)
  useEffect(() => {
    trackX.set(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Anima o track em pixels quando a página muda.
  // Subtrai 2px do offsetWidth para compensar o px-px do container (1px de cada lado),
  // garantindo que os cards nunca fiquem em x=0 e tenham borda visível.
  useEffect(() => {
    const width = (containerRef.current?.offsetWidth ?? 0) - 2;
    animate(trackX, -page * width, { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] });
    // trackX é estável (useMotionValue), não precisa estar nas deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage]);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setPage((p) => (p + 1) % pages);
    }, AUTOPLAY_DELAY);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, pages]);

  function onPointerDown(e: React.PointerEvent) {
    pointerStartX.current = e.clientX;
    setIsDragging(true);
    // Captura o ponteiro para receber todos os eventos seguintes no elemento,
    // mesmo que o dedo/mouse saia dos seus limites durante o arrastar.
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerUp(e: React.PointerEvent) {
    setIsDragging(false);
    if (pointerStartX.current === null) return;
    const dx = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (dx < -SWIPE_THRESHOLD) setPage((p) => Math.min(p + 1, pages - 1));
    else if (dx > SWIPE_THRESHOLD) setPage((p) => Math.max(p - 1, 0));
  }

  function onPointerCancel() {
    setIsDragging(false);
    pointerStartX.current = null;
  }

  return (
    <div
      className="flex flex-col min-w-0 w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        pointerStartX.current = null;
      }}
    >
      <div
        ref={containerRef}
        className={`overflow-hidden select-none px-px touch-pan-y ${isDragging ? 'cursor-gamer-grabbing' : 'cursor-gamer-grab'}`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={() => {
          setIsDragging(false);
          pointerStartX.current = null;
        }}
      >
        <motion.div style={{ display: 'flex', x: trackX }}>
          {categories.map((cat, i) => {
            const catPage = Math.floor(i / perPage);
            const isVisible = catPage === page;
            const posInPage = i % perPage;
            return (
              <motion.div
                key={cat.name}
                aria-hidden={!isVisible}
                style={{
                  flex: `0 0 ${100 / perPage}%`,
                  minWidth: 0,
                  paddingLeft: perPage > 1 && posInPage !== 0 ? '4px' : '0',
                  paddingRight: perPage > 1 && posInPage === 0 ? '4px' : '0',
                  boxSizing: 'border-box',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{
                  duration: 0.35,
                  ease: 'easeOut',
                  delay: isVisible ? posInPage * 0.12 : 0,
                }}
              >
                <CategoryCard cat={cat} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* dots — one per page */}
      <div className="flex gap-[6px] items-center justify-center mt-[10px]">
        {Array.from({ length: pages }).map((_, i) => (
          <motion.button
            key={i}
            className="h-[3px] border-none cursor-gamer-pointer p-0"
            animate={{
              width: i === page ? '28px' : '20px',
              backgroundColor: i === page ? '#2bd6ff' : '#1a3a52',
              boxShadow: i === page ? '0 0 8px #2bd6ff' : '0 0 0px #2bd6ff',
            }}
            transition={{ duration: 0.2 }}
            onClick={() => setPage(i)}
            aria-label={`Página ${i + 1}`}
          />
        ))}
      </div>

      <motion.div
        className="mt-[14px] px-[12px] py-[8px] border border-dashed border-cv-border text-[10px] tracking-[0.1em] text-cv-text-muted leading-[1.7] cursor-default"
        whileHover={{ color: '#cfeaf5' }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-cv-cyan inline">Critério · </div>
        <Tooltip title="1–3 Básico" description="Já usei, sei o básico, precisaria de consulta constante">
          <div className="cursor-gamer-help max-[520px]:text-[var(--color-cv-text)] inline">1–3 Básico</div>
        </Tooltip>
        {' · '}
        <Tooltip title="4–6 Intermediário" description="Trabalho bem, resolvo a maioria dos problemas sozinho">
          <div className="cursor-gamer-help max-[520px]:text-[var(--color-cv-text)] inline">4–6 Intermediário</div>
        </Tooltip>
        {' · '}
        <Tooltip title="7–8 Avançado" description="Domínio sólido, consigo ensinar, referência no time">
          <div className="cursor-gamer-help max-[520px]:text-[var(--color-cv-text)] inline">7–8 Avançado</div>
        </Tooltip>
        {' · '}
        <Tooltip title="9–10 Especialista" description="Contribuo com o ecossistema, profundidade técnica rara">
          <div className="cursor-gamer-help max-[520px]:text-[var(--color-cv-text)] inline">9–10 Especialista</div>
        </Tooltip>
      </motion.div>
    </div>
  );
}

export function Skills({
  skillCategories,
  flash,
  onFlashEnd,
}: {
  skillCategories: PortfolioData['skillCategories'];
  flash?: boolean;
  onFlashEnd?: () => void;
}) {
  return (
    <div id="skills-section">
      <FlashHeading flash={flash} onFlashEnd={onFlashEnd}>
        Habilidades
      </FlashHeading>
      <motion.div
        className="flex justify-between text-[10px] text-cv-text-muted tracking-[0.2em] uppercase mt-[6px] mb-[20px] cursor-default"
        whileHover={{ color: '#cfeaf5' }}
        transition={{ duration: 0.2 }}
      >
        <span>Escala 0 — 10</span>
        <Tooltip content="Meta 10 = Expert">
          <span className="text-cv-cyan cursor-gamer-help">Meta 10 = Expert</span>
        </Tooltip>
      </motion.div>
      <div className="flex flex-col gap-[28px] items-stretch">
        <RadarChart categories={skillCategories} />
        <Carousel categories={skillCategories} />
      </div>
    </div>
  );
}
