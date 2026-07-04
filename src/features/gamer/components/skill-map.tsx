'use client';

import confetti from 'canvas-confetti';
import { AnimatePresence, animate, motion, useInView } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import type { SkillProject } from '@/features/gamer/actions/get-skill-projects';
import { CARD_STAGGER_STEP, cardVariants } from '@/features/gamer/animations';
import { useA11y } from '@/features/gamer/contexts/a11y-context';
import { useSkillProjects } from '@/features/gamer/hooks/use-skill-projects';
import { SnakeGame } from '@/features/minigame/snake';
import { OverlayBase } from '@/shared/components/overlay-base';
import { SvgIcon, preloadSvgForCanvas } from '@/shared/components/svg-icon';
import type { PortfolioData } from '@/shared/types/portfolio';

import { CornerBrackets } from './corner-brackets';
import { CvButton } from './cv-button';
import { EmptyState } from './empty-state';
import { ProjectModal } from './project-modal';
import { ScrollList } from './scroll-list';
import { SectionHeading } from './section-heading';
import { ShimmerStatus } from './shimmer-text';
import { SkillListItem, type SkillListItemData } from './skill-list';
import { Tooltip } from './tooltip';

// Normalized shape the canvas renderer works with — derived from the
// GraphQL-backed `PortfolioData['skillCategories']` passed in via props.
interface SkillCoreNode {
  id: string;
  name: string;
  desc: string;
  techs: Array<{ name: string; documentId: string }>;
  iconUrl?: string;
}

// ============================================================================
//  Constellation geometry — pure helpers, decoupled from React
// ============================================================================
const SC_W = 720;
const SC_H = 560;
const SC_CX = SC_W / 2;
const SC_CY = SC_H / 2;
const SC_HEX_R = 185; // radius of the 7 core hexagon (overview)
const SC_TARGET_R = 108; // outer radius of an expanded constellation
const SC_TRANSLATE_Y = 20; // clears the breadcrumb bar overlaid on top of the canvas

// ≤860px: the stage stacks above the panel (see .sc-frame media query in
// styles.css) and its own aspect-ratio grows taller (18/19) to match — the
// hex ring's overview state was leaving huge gutters (~18% of the width on
// every side) at the old 720×560 proportions, since the ring only needs to
// clear a fixed-height breadcrumb bar, not scale with the logical canvas.
// A separate, taller logical space + bigger radii let the constellation
// fill most of the box instead, while SC_W/SC_CX stay shared so hit-testing
// (which only ever converts through SC_W) doesn't need its own branch.
const SC_H_NARROW = 760;
const SC_CY_NARROW = SC_H_NARROW / 2;
const SC_HEX_R_NARROW = 280;
const SC_TARGET_R_NARROW = 163;
const SC_TRANSLATE_Y_NARROW = 34;
// Extra multiplier on top of the orb's normal focus/dim scale (1 / 1.22 / 0.8)
// — the bigger hex ring already gives the orbs more breathing room, so they
// can afford to be visually bigger too instead of looking sparse against it.
// Applied in scCorePos so hit-test radius (36 * pos.s) grows in lockstep with
// the drawn radius (which is also driven by pos.s, via a.orbScales).
const SC_ORB_BOOST_NARROW = 1.4;
const SC_GOLD = Math.PI * (3 - Math.sqrt(5)); // golden angle → organic spread

interface ConNode {
  id: string;
  name: string;
  documentId: string;
  x: number;
  y: number;
  dist: number;
  seq: number;
}
interface ConEdge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  len: number;
  seq: number;
}
interface Constellation {
  nodes: ConNode[];
  edges: ConEdge[];
}

function scHexAngle(i: number, total: number) {
  return ((-90 + (i * 360) / total) * Math.PI) / 180;
}
function scHexPos(i: number, total: number, isNarrow: boolean): [number, number] {
  const a = scHexAngle(i, total);
  const cy = isNarrow ? SC_CY_NARROW : SC_CY;
  const hexR = isNarrow ? SC_HEX_R_NARROW : SC_HEX_R;
  return [SC_CX + Math.cos(a) * hexR, cy + Math.sin(a) * hexR];
}
function scCorePos(i: number, focusIdx: number | null, total: number, isNarrow: boolean) {
  const [x, y] = scHexPos(i, total, isNarrow);
  const boost = isNarrow ? SC_ORB_BOOST_NARROW : 1;
  if (focusIdx === null) return { x, y, s: 1 * boost, dim: false };
  if (i === focusIdx) return { x, y, s: 1.22 * boost, dim: false };
  return { x, y, s: 0.8 * boost, dim: true };
}

// Sunflower spread + nearest-neighbour spanning tree → organic, branching
// constellation that grows outward from the core. Deterministic per category.
function scBuildConstellation(cat: SkillCoreNode, catIndex: number, isNarrow: boolean): Constellation {
  const techs = cat.techs;
  const M = techs.length;
  const seed = catIndex * 1.7 + 0.6;
  const cy = isNarrow ? SC_CY_NARROW : SC_CY;
  const targetR = isNarrow ? SC_TARGET_R_NARROW : SC_TARGET_R;
  const raw: Array<{ ux: number; uy: number; rr: number }> = [];
  for (let j = 0; j < M; j++) {
    const ang = j * SC_GOLD + seed;
    const rr = Math.sqrt(j + 1);
    raw.push({ ux: Math.cos(ang) * rr, uy: Math.sin(ang) * rr, rr });
  }
  const scale = targetR / Math.sqrt(M);
  const nodes: ConNode[] = raw.map((p, j) => ({
    id: cat.id + '::' + j,
    name: techs[j].name,
    documentId: techs[j].documentId,
    x: SC_CX + p.ux * scale,
    y: cy + p.uy * scale,
    dist: p.rr * scale,
    seq: 0,
  }));
  const order = nodes.map((_, j) => j).sort((a, b) => nodes[a].dist - nodes[b].dist);
  const placed: Array<{ x: number; y: number }> = [{ x: SC_CX, y: cy }];
  const edges: ConEdge[] = [];
  order.forEach((j, k) => {
    const n = nodes[j];
    n.seq = k;
    let best = placed[0];
    let bd = Infinity;
    for (const p of placed) {
      const d = Math.hypot(p.x - n.x, p.y - n.y);
      if (d < bd) {
        bd = d;
        best = p;
      }
    }
    edges.push({ x1: best.x, y1: best.y, x2: n.x, y2: n.y, len: bd, seq: k });
    placed.push(n);
  });
  return { nodes, edges };
}

// ============================================================================
//  Canvas renderer helpers
// ============================================================================
const _SC_C = {
  cyan: '#2bd6ff',
  cyanDim: '#1d8aa8',
  border: '#1a3a52',
  bg: '#03060f',
  text: '#cfeaf5',
  textMuted: '#3b5366',
  textDim: '#5d7a8c',
  borderBright: '#2bd6ff',
};

type OrbIcon = Path2D[] | { isBackend: true; p1: Path2D; p2: Path2D };

const _ip = (() => {
  const cache: Record<string, OrbIcon> = {};
  return (id: string): OrbIcon => {
    if (id in cache) return cache[id];
    const d: Record<string, string[]> = {
      frontend: ['m18 16 4-4-4-4', 'm6 8-4 4 4 4', 'm14.5 4-5 16'],
      motion: [
        'm21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284',
        'M3 21h18',
      ],
      web: ['M12 2C8 2 4 8 4 14a8 8 0 0 0 16 0c0-6-4-12-8-12'],
      devops: [
        'M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z',
        'M10 21.9V14L2.1 9.1',
        'm10 14 11.9-6.9',
        'M14 19.8v-8.1',
        'M18 17.5V9.4',
      ],
      ai: [
        'M12 18V5',
        'M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4',
        'M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5',
        'M17.997 5.125a4 4 0 0 1 2.526 5.77',
        'M18 18a4 4 0 0 0 2-7.464',
        'M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517',
        'M6 18a4 4 0 0 1-2-7.464',
        'M6.003 5.125a4 4 0 0 0-2.526 5.77',
      ],
      testing: [
        'M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2',
        'M6.453 15h11.094',
        'M8.5 2h7',
      ],
    };
    if (id === 'backend') {
      cache[id] = {
        isBackend: true,
        p1: new Path2D('M3 5V19A9 3 0 0 0 21 19V5'),
        p2: new Path2D('M3 12A9 3 0 0 0 21 12'),
      };
    } else {
      cache[id] = (d[id] || []).map((s) => new Path2D(s));
    }
    return cache[id];
  };
})();

function _drawOrbIcon(ctx: CanvasRenderingContext2D, id: string) {
  ctx.save();
  ctx.translate(-10, -10);
  ctx.scale(0.833, 0.833);
  ctx.strokeStyle = _SC_C.cyan;
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const ps = _ip(id);
  if ('isBackend' in ps) {
    ctx.beginPath();
    ctx.ellipse(12, 5, 9, 3, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.stroke(ps.p1);
    ctx.stroke(ps.p2);
  } else {
    ps.forEach((p) => ctx.stroke(p));
  }
  ctx.restore();
}

function _drawOrbBody(
  ctx: CanvasRenderingContext2D,
  id: string,
  sel: boolean,
  dim: boolean,
  hl: boolean,
  focused: boolean,
  hovP: number,
  rotAngle: number,
  img?: HTMLCanvasElement | null,
) {
  const eff = sel || hl;
  ctx.beginPath();
  ctx.arc(0, 0, 42, 0, Math.PI * 2);
  ctx.fillStyle =
    'rgba(43,214,255,' + (sel ? 0.13 : dim ? 0.01 : focused ? 0.08 : (0.04 + hovP * 0.09).toFixed(3)) + ')';
  ctx.fill();
  if (sel || focused) {
    ctx.save();
    ctx.rotate(rotAngle);
    ctx.beginPath();
    ctx.arc(0, 0, 38, 0, Math.PI * 2);
    ctx.strokeStyle = '#2bd6ff';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 9]);
    ctx.globalAlpha *= sel ? 0.9 : 0.4;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
  {
    ctx.save();
    if (sel || focused || hl) ctx.rotate(-rotAngle * 0.28);
    ctx.strokeStyle = eff ? _SC_C.cyan : dim ? _SC_C.border : _SC_C.cyanDim;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha *= eff ? 1 : dim ? 0.2 : 0.5 + hovP * 0.5;
    ctx.beginPath();
    for (let k = 0; k < 22; k++) {
      const a = (k / 22) * Math.PI * 2;
      ctx.moveTo(Math.cos(a) * 27, Math.sin(a) * 27);
      ctx.lineTo(Math.cos(a) * 33, Math.sin(a) * 33);
    }
    ctx.stroke();
    ctx.restore();
  }
  {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.strokeStyle = eff ? _SC_C.cyan : dim ? _SC_C.border : _SC_C.cyanDim;
    ctx.lineWidth = 1.8;
    if (eff) {
      ctx.shadowColor = _SC_C.cyan;
      ctx.shadowBlur = 10;
    } else if (focused) {
      ctx.shadowColor = _SC_C.cyan;
      ctx.shadowBlur = 7;
    } else if (hovP > 0.05) {
      ctx.shadowColor = _SC_C.cyan;
      ctx.shadowBlur = hovP * 10;
    }
    ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 19, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(43,214,255,' + (sel ? 0.45 : 0.12) + ')';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 17, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(3,6,15,0.95)';
  ctx.fill();
  ctx.save();
  ctx.globalAlpha *= 0.9;
  if (img) {
    ctx.drawImage(img, -10, -10, 20, 20);
  } else {
    _drawOrbIcon(ctx, id);
  }
  ctx.restore();
}

const _eoc = (t: number) => 1 - (1 - t) * (1 - t) * (1 - t);
const _eoq = (t: number) => 1 - (1 - t) * (1 - t);

// Render resolution multiplier: native devicePixelRatio plus a supersampling
// margin so strokes/text stay crisp even on displays with fractional OS-level
// scaling (common on Linux), where dpr alone still looks soft. Capped to keep
// the backing-store size (and per-frame shadowBlur cost) reasonable on
// already-hidpi screens.
function _canvasScale() {
  const dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  return Math.min(3, dpr * 1.5);
}

// Plain CSS-transition width tween — deliberately NOT Framer Motion's
// standalone animate(), because the target here (.sc-frame) is itself a
// motion.div. Framer's animate() attaches to that element's existing
// VisualElement and starts tracking "width" as one of its own motion values;
// on every later React re-render of that component (hover, hint timers,
// anything), Framer re-syncs all values it owns back onto the DOM using the
// last value it remembers — silently overwriting a plain `el.style.width=''`
// reset done afterward outside Framer's knowledge. That reappearance could
// happen many renders later, long after the toggle animation itself finished,
// pinning the frame at a stale pixel width and breaking responsiveness on the
// next viewport resize. A native CSS transition never touches Framer's
// VisualElement, so nothing "remembers" the value once we clear it.
function _animateWidth(el: HTMLElement, from: number, to: number, skip: boolean): Promise<void> {
  return new Promise((resolve) => {
    if (skip || from === to) {
      el.style.width = to + 'px';
      resolve();
      return;
    }
    el.style.transition = 'none';
    el.style.width = from + 'px';
    void el.offsetWidth; // force reflow so the browser registers `from` before the transition turns on
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName !== 'width' || e.target !== el) return;
      el.removeEventListener('transitionend', onEnd);
      el.style.transition = '';
      resolve();
    };
    el.addEventListener('transitionend', onEnd);
    requestAnimationFrame(() => {
      el.style.transition = 'width 0.55s cubic-bezier(0.65, 0, 0.35, 1)';
      el.style.width = to + 'px';
    });
  });
}

// ============================================================================
//  SkillMap — canvas renderer + side panel
// ============================================================================
interface AnimState {
  rotAngle: number;
  lastTime: number | null;
  introStartTime: number | null;
  focusTime: number | null;
  con: Constellation | null;
  ovFade: number;
  lblKey: number;
  lblFade: number;
  hov: Record<string, number>;
  orbScales: number[];
  orbAlphas: number[];
}

interface StateRef {
  focus: number | null;
  pinFocus: number;
  tech: string | null;
  hover: string | null;
  keyboardFocus: number | null;
}

const PANEL_LS_KEY = 'gamer:skillmap:panel';

// Slide direction for the side panel's drill-down steps (overview → category →
// tech): 1 = progressive (deeper), -1 = regressive (back), 0 = lateral move
// (e.g. switching categories directly) or initial mount — crossfade only, no
// horizontal shift, since it isn't a hierarchy change.
const panelSlideVariants = {
  enter: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.32, ease: [0.2, 0.7, 0.2, 1] as const },
  },
  exit: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? '-100%' : '100%',
    opacity: 0,
    transition: { duration: 0.32, ease: [0.2, 0.7, 0.2, 1] as const },
  }),
};

export function SkillMap({
  onPanelChange,
  flash,
  onFlashEnd,
  skills,
}: {
  onPanelChange?: (open: boolean) => void;
  flash?: boolean;
  onFlashEnd?: () => void;
  skills: PortfolioData['skillCategories'];
}) {
  const { opts, toggle } = useA11y();
  const noMotion = opts.reduceMotion;

  const wasReduceMotionOnRef = useRef(opts.reduceMotion);

  // ≤860px geometry switch (see SC_*_NARROW above). `isNarrow` is reactive
  // (drives useMemo/useEffect recomputation of the constellation layout);
  // `isNarrowGeomRef` mirrors it for the persistent RAF draw loop below,
  // which never re-subscribes on render and so can't close over state.
  const [isNarrow, setIsNarrow] = useState(false);
  const isNarrowGeomRef = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)');
    const update = () => {
      isNarrowGeomRef.current = mq.matches;
      setIsNarrow(mq.matches);
    };
    mq.addEventListener('change', update);
    update();
    return () => mq.removeEventListener('change', update);
  }, []);

  const techTree = useMemo<SkillCoreNode[]>(
    () =>
      skills.map((cat) => ({
        id: cat.id,
        name: cat.name,
        desc: cat.description,
        techs: cat.items.map((item) => ({ name: item.name, documentId: item.documentId })),
        iconUrl: cat.iconUrl,
      })),
    [skills],
  );

  const techTreeRef = useRef<SkillCoreNode[]>(techTree);
  techTreeRef.current = techTree;

  const imgCacheRef = useRef<Record<string, HTMLCanvasElement>>({});

  const [panelOpen, setPanelOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [eggOpen, setEggOpen] = useState(false);

  // Projeto aberto no modal (mesma estrutura/dados do modal da seção Projetos).
  const [openProject, setOpenProject] = useState<SkillProject | null>(null);
  const lastProjectData = useRef<SkillProject | null>(null);
  if (openProject !== null) lastProjectData.current = openProject;

  const onPanelChangeRef = useRef(onPanelChange);
  onPanelChangeRef.current = onPanelChange;

  // Restaura estado do painel do localStorage na montagem (sem animação)
  useEffect(() => {
    try {
      if (localStorage.getItem(PANEL_LS_KEY) === '1') {
        setPanelOpen(true);
        onPanelChangeRef.current?.(true);
      }
    } catch {}
  }, []);

  // Persiste estado expandido/recolhido (ignora render inicial para não sobrescrever o valor salvo)
  const panelMountedRef = useRef(false);
  useEffect(() => {
    if (!panelMountedRef.current) {
      panelMountedRef.current = true;
      return;
    }
    try {
      localStorage.setItem(PANEL_LS_KEY, panelOpen ? '1' : '0');
    } catch {}
  }, [panelOpen]);
  const [hintVisible, setHintVisible] = useState(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (panelOpen) {
      // oculta antes de expandir: fade-out rápido, depois desmonta
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      if (hintFadeRef.current) clearTimeout(hintFadeRef.current);
      setHintVisible(false);
      hintFadeRef.current = setTimeout(() => setShowHint(false), 350);
    } else {
      // mostra após 3s com fade-in suave
      hintTimerRef.current = setTimeout(() => {
        setShowHint(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setHintVisible(true)));
      }, 2000);
    }
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      if (hintFadeRef.current) clearTimeout(hintFadeRef.current);
    };
  }, [panelOpen]);

  const handleToggle = () => {
    // ≤860px: layout empilhado (frame em coluna) — o canvas fica estático,
    // sem a coreografia de largura abaixo (pensada para o frame crescer
    // lateralmente no layout em linha). Só o painel anima, via CSS
    // (transição de height em .sc-panel-wrapper, ver styles.css).
    //
    // Lê isNarrowGeomRef (não o estado `isNarrow`) de propósito: o estado só
    // é atualizado no próximo render, então um clique disparado logo após
    // cruzar o breakpoint (resize seguido de clique quase imediato) podia ler
    // o valor antigo e rodar a coreografia de desktop com a viewport já em
    // modo coluna — misturando largura calculada via JS com o layout CSS
    // empilhado e quebrando o encaixe (canvas/painel ficavam fora de
    // sincronia com o resto da página). O ref é atualizado de forma síncrona
    // no mesmo listener, então nunca fica desatualizado no momento do clique.
    if (panelOpen) {
      setPanelOpen(false);
      if (isNarrowGeomRef.current) {
        onPanelChange?.(false);
        return;
      }
      // Step 1+2 simultaneously: panel collapses AND frame narrows right→left
      const col1 = document.querySelector('.sm-col1') as HTMLElement | null;
      const frame = document.querySelector('.sc-frame') as HTMLElement | null;

      const finishCollapse = () => {
        // flushSync (como no expand abaixo): o grid precisa estar commitado em
        // sm-collapsed antes do rAF limpar o width inline — sem isso o rAF pode
        // rodar com o grid ainda expandido e o frame salta para a largura da
        // linha inteira por alguns frames.
        flushSync(() => {
          onPanelChange?.(false);
        });
        requestAnimationFrame(() => {
          if (frame) frame.style.width = '';
        });
      };

      if (col1 && frame) {
        const curW = frame.getBoundingClientRect().width;
        const tgtW = col1.getBoundingClientRect().width;
        _animateWidth(frame, curW, tgtW, noMotion).then(finishCollapse);
      } else {
        finishCollapse();
      }
    } else {
      // Oculta hint antes de expandir, aguarda fade-out e só então expande
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      if (hintFadeRef.current) clearTimeout(hintFadeRef.current);
      setHintVisible(false);
      hintFadeRef.current = setTimeout(() => setShowHint(false), 350);

      if (isNarrowGeomRef.current) {
        setTimeout(() => {
          onPanelChange?.(true);
          setPanelOpen(true);
        }, 360);
        return;
      }

      setTimeout(() => {
        // Expand — animação sequencial em 3 fases:
        // Fase 1: canvas congela na largura atual (col1 / Experiências)
        // Fase 2: container cresce + painel desliza da direita (canvas fica parado)
        // Fase 3: canvas expande até sua largura máxima permitida
        const frame = document.querySelector('.sc-frame') as HTMLElement | null;
        const stageWrap = document.querySelector('.sc-stage-wrap') as HTMLElement | null;
        const panelWrap = document.querySelector('.sc-panel-wrapper') as HTMLElement | null;
        const curW = frame ? frame.getBoundingClientRect().width : null;
        const stageW = stageWrap ? stageWrap.getBoundingClientRect().width : null;

        // ── Fase 1: congela frame e canvas ──────────────────────────────────
        if (frame && curW) {
          frame.style.transition = 'none';
          frame.style.width = curW + 'px';
        }
        if (stageWrap && stageW) {
          stageWrap.style.flex = 'none';
          stageWrap.style.width = stageW + 'px';
        }
        // Painel fica fixo na borda direita do frame enquanto ele cresce
        if (panelWrap) panelWrap.style.marginLeft = 'auto';

        // Restaura grid de 2 colunas sincronamente
        flushSync(() => {
          onPanelChange?.(true);
        });

        // ── Fase 2: frame + painel crescem juntos ────────────────────────────
        requestAnimationFrame(() => {
          const skillmap = document.querySelector('.sm-skillmap') as HTMLElement | null;
          const tgtW = skillmap ? skillmap.getBoundingClientRect().width : null;

          setTimeout(() => {
            const PANEL_W = 340;
            // tgtW é largura externa do frame (inclui 2 bordas de 1px cada).
            // stageTgtW precisa descontar essas bordas para coincidir com
            // o valor que flex:1 adotaria — evita o micro-recuo no final.
            const FRAME_BORDERS = 2;
            const stageTgtW = tgtW ? Math.round(tgtW - PANEL_W - FRAME_BORDERS) : null;

            // ── Fase 2: frame cresce + painel entra + canvas expande — tudo junto ──
            requestAnimationFrame(() => {
              const growTransition = { duration: 0.55, ease: [0.65, 0, 0.35, 1] as const, skipAnimations: noMotion };
              const grows: Array<Promise<unknown>> = [];
              // `!==` (not `>`) on purpose: in narrower viewports the frame's target
              // width can end up equal to or even narrower than the canvas's own
              // target (e.g. once the grid is already single-column, growing the
              // frame doesn't add room — the new side panel has to eat into the
              // canvas instead). Gating on ">" skipped that element's animate()
              // call entirely, leaving it frozen at its pinned width until
              // Promise.all resolved, so it only "jumped" once the other element's
              // animation finished — canvas and frame must always move together.
              // frame uses _animateWidth (plain CSS transition), not Framer's
              // animate() — see that helper's comment: .sc-frame is a motion.div,
              // and animate() attaches "width" to its VisualElement as an owned
              // motion value that gets silently re-applied on any later React
              // re-render of this component, long after this animation and its
              // cleanup have finished. stageWrap is a plain div (no VisualElement),
              // so Framer's animate() is fine there and left as-is.
              if (frame && curW && tgtW && tgtW !== curW) {
                grows.push(_animateWidth(frame, curW, tgtW, noMotion));
              }
              if (stageWrap && stageTgtW && stageW && stageTgtW !== stageW) {
                grows.push(Promise.resolve(animate(stageWrap, { width: [stageW, stageTgtW] }, growTransition)));
              }
              setPanelOpen(true);

              // Limpeza após animação concluída
              Promise.all(grows).then(() => {
                if (frame) frame.style.width = '';
                if (stageWrap) {
                  stageWrap.style.width = '';
                  stageWrap.style.flex = '';
                }
                if (panelWrap) panelWrap.style.marginLeft = '';
              });
            });
          }, 120);
        });
      }, 360); // aguarda hint fade-out antes de expandir
    }
  };

  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'pt-BR';

  const [focus, setFocus] = useState<number | null>(null); // expanded orb index | null
  const [pinFocus, setPinFocus] = useState(0); // persistently focused orb (default = frontend)
  const [tech, setTech] = useState<string | null>(null); // tech node id | null
  const [hover, setHover] = useState<string | null>(null); // "cat-<i>" | tech id | null
  const [keyboardFocusIdx, setKeyboardFocusIdx] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [canvasFocused, setCanvasFocused] = useState(false);

  // ── panel step direction: 0 overview, 1 category, 2 tech ───────────────────
  const panelLevel = tech ? 2 : focus !== null ? 1 : 0;
  // Keyed by level only (not by the specific tech/category id) so lateral
  // moves within the same level (category↔category, tech↔tech) reconcile
  // in place instead of remounting — this keeps ScrollList containers (and
  // their scroll position) mounted; only their content re-renders. Level
  // changes still get a fresh key, since those genuinely swap structure and
  // should keep sliding.
  const panelStepKey = panelLevel === 2 ? 'tech' : panelLevel === 1 ? 'category' : 'overview';
  const prevPanelLevelRef = useRef(panelLevel);
  const panelDirection = panelLevel === prevPanelLevelRef.current ? 0 : panelLevel > prevPanelLevelRef.current ? 1 : -1;
  useEffect(() => {
    prevPanelLevelRef.current = panelLevel;
  }, [panelLevel]);

  // SkillListItem plays a hidden→visible entrance stagger on mount. Without
  // this, every level change or data refetch mounts fresh list items and
  // replays that animation; it should only ever play once, for the initial
  // "Categorias" list. Flipping this on a plain mount effect would fire
  // almost immediately (before the user scrolls the list into view),
  // suppressing that very first reveal — so instead it only flips the first
  // time the user actually changes focus/tech (i.e. once real navigation
  // has happened), leaving the initial reveal-on-scroll untouched no matter
  // how long it takes the user to scroll it into view.
  const hasAnimatedListsOnceRef = useRef(false);
  const isFirstSelectionEffectRef = useRef(true);
  useEffect(() => {
    if (isFirstSelectionEffectRef.current) {
      isFirstSelectionEffectRef.current = false;
      return;
    }
    hasAnimatedListsOnceRef.current = true;
  }, [focus, tech]);

  // panelOpen always starts false and only becomes true once (either via the
  // localStorage restore effect below or the toggle button), so the panel's
  // own max-width/opacity expand transition always plays at least once. The
  // "Categorias" entrance stagger must not start until that expand has fully
  // finished — otherwise it plays while the panel is still width:0/opacity:0
  // (invisible) and looks like it never ran at all.
  const [panelExpandComplete, setPanelExpandComplete] = useState(false);
  // Fires when the panel wrapper's own Framer Motion expand animation (below)
  // finishes. Framer Motion still calls this even when the transition prop is
  // { duration: 0 } (reduceMotion), so no separate bypass is needed for that
  // case — unlike a native CSS transition, which never fires `transitionend`
  // when disabled entirely.
  const handlePanelAnimationComplete = () => {
    if (panelOpen) setPanelExpandComplete(true);
  };

  // ── canvas refs ───────────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageWrapRef = useRef<HTMLDivElement>(null);
  const floatBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // ≤860px: o botão de expandir/recolher flutua sobre a costura entre o
  // canvas e o painel (position: absolute, sem reservar espaço no fluxo).
  // Como o layout empilha em coluna, essa costura é a borda inferior do
  // canvas — que muda de altura com a largura da viewport (aspect-ratio) —
  // por isso ela é medida via ResizeObserver em vez de um valor fixo em CSS.
  useEffect(() => {
    const stageWrap = stageWrapRef.current;
    const btn = floatBtnRef.current;
    if (!stageWrap || !btn) return;
    const mq = window.matchMedia('(max-width: 860px)');
    const update = () => {
      btn.style.top = mq.matches ? stageWrap.offsetHeight + 'px' : '';
    };
    const ro = new ResizeObserver(update);
    ro.observe(stageWrap);
    mq.addEventListener('change', update);
    update();
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', update);
    };
  }, []);
  const isInView = useInView(sectionRef, { once: true, margin: '0px 0px -80px 0px' });
  const _anim = useRef<AnimState>({
    rotAngle: 0,
    lastTime: null,
    introStartTime: null,
    focusTime: null,
    con: null,
    ovFade: 0,
    lblKey: -1,
    lblFade: 0,
    hov: {},
    orbScales: techTree.map(() => 1),
    orbAlphas: techTree.map(() => 1),
  });
  const _st = useRef<StateRef>({ focus: null, pinFocus: 0, tech: null, hover: null, keyboardFocus: null });
  _st.current = { focus, pinFocus, tech, hover, keyboardFocus: keyboardFocusIdx };
  const _reduce = useRef(noMotion);
  _reduce.current = noMotion;

  const focusCat = focus === null ? null : techTree[focus];
  const constellation = useMemo<Constellation | null>(
    () => (focusCat ? scBuildConstellation(focusCat, focus as number, isNarrow) : null),
    [focus, focusCat, isNarrow],
  );

  const openCat = (i: number) => {
    if (i === focus) {
      setFocus(null);
      setTech(null);
    } else {
      setFocus(i);
      setPinFocus(i);
      setTech(null);
    }
  };
  const goHome = () => {
    setFocus(null);
    setTech(null);
    setHover(null);
  };

  /**
   * Easter-egg trigger: fires confetti, then opens the minigame overlay after
   * a short delay so the burst is visible before the modal covers the screen.
   * Also force-enables `reduceMotion` (restored on modal close) to freeze the
   * skill-map canvas animation while the egg flow plays — a side effect, not
   * an accessibility preference change. Full flow documented in docs/easter-egg.md.
   */
  function handleEggClick() {
    wasReduceMotionOnRef.current = opts.reduceMotion;
    if (!opts.reduceMotion) toggle('reduceMotion');
    confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 }, scalar: 1.4 });
    setTimeout(() => setEggOpen(true), 600);
  }

  useEffect(() => {
    const cache = imgCacheRef.current;
    // Rasterize at the same supersampled resolution as the canvas itself —
    // otherwise this bitmap (cached once, fixed size) gets upscaled and
    // blurs out once the canvas backing store grows past 20px per icon.
    const iconPx = Math.round(20 * _canvasScale());
    techTree.forEach((cat) => {
      if (!cat.iconUrl || cache[cat.id]) return;
      preloadSvgForCanvas(cat.iconUrl, '#2bd6ff', iconPx)
        .then((oc) => {
          cache[cat.id] = oc;
        })
        .catch(() => {}); // falls back to _drawOrbIcon on failure
    });
  }, [techTree]);

  // Sync constellation to canvas when focus changes
  useEffect(() => {
    const a = _anim.current;
    if (focus !== null) {
      a.con = scBuildConstellation(techTreeRef.current[focus], focus, isNarrow);
      a.focusTime = performance.now();
    } else {
      a.con = null;
      a.focusTime = null;
    }
  }, [focus, isNarrow]);

  // Persistent RAF draw loop (reads state from refs — never restarts on render)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf: number;
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      const a = _anim.current;
      const st = _st.current;
      const reduce = _reduce.current;
      const dpr = _canvasScale();
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      if (!cw || !ch) return;
      const pw = Math.round(cw * dpr);
      const ph = Math.round(ch * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const isNarrowFrame = isNarrowGeomRef.current;
      const H = isNarrowFrame ? SC_H_NARROW : SC_H;
      const cy = isNarrowFrame ? SC_CY_NARROW : SC_CY;
      const hexR = isNarrowFrame ? SC_HEX_R_NARROW : SC_HEX_R;
      const translateY = isNarrowFrame ? SC_TRANSLATE_Y_NARROW : SC_TRANSLATE_Y;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, pw, ph);
      ctx.save();
      ctx.scale(pw / SC_W, ph / H);
      ctx.translate(0, translateY);
      const dt = a.lastTime ? Math.min(ts - a.lastTime, 50) : 16;
      a.lastTime = ts;
      if (!a.introStartTime) a.introStartTime = ts;
      // Reduce-motion: snap intro / focus reveals to their final frame and freeze
      // the continuous rotation, while keeping hover/focus interactions instant.
      const introAge = reduce ? 99999 : ts - a.introStartTime;
      if (!reduce) a.rotAngle += dt * ((Math.PI * 2) / 9000);
      // Hover transitions
      const hovSpd = reduce ? 1 : Math.min(1, dt / 100);
      if (st.hover && !(st.hover in a.hov)) a.hov[st.hover] = 0;
      for (const hid of Object.keys(a.hov)) {
        const tgt = st.hover === hid ? 1 : 0;
        a.hov[hid] = a.hov[hid] + (tgt - a.hov[hid]) * hovSpd;
      }
      // Overview fade
      const ovTgt = st.focus === null ? 1 : 0;
      a.ovFade = a.ovFade + (ovTgt - a.ovFade) * (reduce ? 1 : Math.min(1, dt / 250));
      // Display index (mirrors React JSX logic)
      const hovCatIdx = st.hover && st.hover.startsWith('cat-') ? +st.hover.slice(4) : null;
      const dispIdx = hovCatIdx !== null ? hovCatIdx : st.focus !== null ? st.focus : st.pinFocus;
      const tree = techTreeRef.current;
      const dispCat = tree[dispIdx];
      // Center label fade on category change
      if (dispIdx !== a.lblKey) {
        a.lblKey = dispIdx;
        a.lblFade = 0;
      }
      if (a.lblFade < 1) a.lblFade = reduce ? 1 : Math.min(1, a.lblFade + dt / 420);

      // ─── DRAW ────────────────────────────────────────────────────────────

      // 1. Overview guide rings
      if (a.ovFade > 0.01) {
        ctx.save();
        ctx.strokeStyle = _SC_C.border;
        ctx.lineWidth = 1;
        ctx.globalAlpha = a.ovFade * 0.85;
        ctx.beginPath();
        ctx.arc(SC_CX, cy, hexR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = a.ovFade * 0.5;
        ctx.beginPath();
        ctx.arc(SC_CX, cy, hexR * 0.55, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      // 2. Constellation edges (draw-on animation)
      if (a.con && st.focus !== null && a.focusTime !== null) {
        const elapsed = reduce ? 99999 : ts - a.focusTime;
        ctx.save();
        ctx.strokeStyle = _SC_C.cyan;
        ctx.lineWidth = 1.2;
        ctx.shadowColor = _SC_C.cyan;
        ctx.shadowBlur = 3;
        ctx.globalAlpha = 0.55;
        a.con.edges.forEach((e) => {
          const p = _eoc(Math.max(0, Math.min(1, (elapsed - (e.seq * 70 + 120)) / 620)));
          if (p <= 0) return;
          ctx.beginPath();
          ctx.moveTo(e.x1, e.y1);
          ctx.lineTo(e.x1 + (e.x2 - e.x1) * p, e.y1 + (e.y2 - e.y1) * p);
          ctx.stroke();
        });
        ctx.restore();
      }
      // 3. Center: hub orb OR info disc
      if (st.focus !== null) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(SC_CX, cy, 10.5, 0, Math.PI * 2);
        ctx.fillStyle = _SC_C.cyan;
        ctx.shadowColor = _SC_C.cyan;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.strokeStyle = _SC_C.bg;
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 0;
        ctx.stroke();
        ctx.restore();
      } else if (dispCat) {
        const iAlpha = a.ovFade * Math.min(1, (introAge - 200) / 700);
        if (iAlpha > 0.01) {
          // Render central text in pixel space so font size never scales with canvas
          const _pxCX = SC_CX * (cw / SC_W);
          const _pxCY = (cy + translateY) * (ch / H);
          ctx.save();
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // reset to physical pixels
          ctx.translate(_pxCX, _pxCY);
          ctx.scale(0.9, 0.9);
          ctx.translate(-_pxCX, -_pxCY);
          ctx.globalAlpha = iAlpha * a.lblFade;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          // Layout: título + 6px + descrição + 6px + tag — centrado em _pxCY
          ctx.font = '13.5px "Share Tech Mono",monospace';
          {
            const _dw = 172;
            const _dh = 15;
            const _gap = 6;
            const _titleH = 17;
            const _tagH = 24;
            const _dwords = dispCat.desc.split(' ');
            const _dlines: string[] = [];
            let _dl = '';
            for (const w of _dwords) {
              const tt = _dl + (_dl ? ' ' : '') + w;
              if (ctx.measureText(tt).width > _dw && _dl) {
                _dlines.push(_dl);
                _dl = w;
              } else _dl = tt;
            }
            if (_dl) _dlines.push(_dl);
            const _descH = _dlines.length * _dh;
            const _totalH = _titleH + _gap + _descH + _gap + _tagH;
            const _startY = _pxCY - _totalH / 2;
            // Título
            ctx.font = '500 16.2px "Share Tech Mono",monospace';
            ctx.fillStyle = _SC_C.cyan;
            ctx.fillText(dispCat.name.toUpperCase(), _pxCX, _startY + _titleH / 2);
            // Descrição
            ctx.font = '12.8px "Share Tech Mono",monospace';
            ctx.fillStyle = '#abc6d7';
            const _descY0 = _startY + _titleH + _gap;
            _dlines.forEach((ln, li) => ctx.fillText(ln, _pxCX, _descY0 + li * _dh + _dh / 2));
            // Tag
            const _tagTxt = dispCat.techs.length + ' techs';
            ctx.font = '12.4px "Share Tech Mono",monospace';
            const _tagW = ctx.measureText(_tagTxt).width + 24;
            const _tagX = _pxCX - _tagW / 2;
            const _tagY = _startY + _titleH + _gap + _descH + _gap;
            ctx.strokeStyle = _SC_C.border;
            ctx.lineWidth = 1;
            ctx.strokeRect(_tagX, _tagY, _tagW, _tagH);
            ctx.fillStyle = _SC_C.text;
            ctx.fillText(_tagTxt, _pxCX, _tagY + _tagH / 2);
          }
          ctx.restore();
        }
      }
      // 4. Tech nodes (pop-in animation)
      if (a.con && st.focus !== null && a.focusTime !== null) {
        const elapsed = reduce ? 99999 : ts - a.focusTime;
        a.con.nodes.forEach((n) => {
          const p = _eoq(Math.max(0, Math.min(1, (elapsed - (n.seq * 70 + 180)) / 500)));
          if (p <= 0) return;
          const isSel = st.tech === n.id;
          const hovP = a.hov[n.id] || 0;
          ctx.save();
          ctx.translate(n.x, n.y);
          ctx.scale(p, p);
          ctx.globalAlpha = p;
          ctx.beginPath();
          ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
          const filled = isSel || hovP > 0.5;
          ctx.fillStyle = filled ? _SC_C.cyan : 'rgba(3,6,15,0.85)';
          if (filled) {
            ctx.shadowColor = _SC_C.cyan;
            ctx.shadowBlur = 8;
          }
          ctx.fill();
          ctx.strokeStyle = _SC_C.cyan;
          ctx.lineWidth = 1.2;
          ctx.shadowBlur = 0;
          ctx.stroke();
          ctx.font = '10px "Share Tech Mono",monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = filled ? _SC_C.cyan : _SC_C.textDim;
          ctx.fillText(n.name, 0, -13);
          ctx.restore();
        });
      }
      // 5. Core orbs (sequential fly-in from center)
      const N = tree.length;
      tree.forEach((c, i) => {
        const pos = scCorePos(i, st.focus, N, isNarrowFrame);
        const sel = st.focus === i;
        const hovP = a.hov['cat-' + i] || 0;
        const hl = hovP > 0.1;
        const isKbFocused = (st.keyboardFocus ?? -1) === i;
        const focused =
          isKbFocused || (!sel && !pos.dim && dispIdx === i && hovCatIdx === null && st.keyboardFocus === null);
        const orbDelay = i * 95;
        const orbDur = (0.8 - i * (0.45 / (N - 1))) * 1000;
        const orbP = _eoc(Math.max(0, Math.min(1, (introAge - orbDelay) / orbDur)));
        if (orbP <= 0) return;
        // Smooth scale + opacity transitions when focus changes
        const spd = reduce ? 1 : Math.min(1, dt / 320);
        a.orbScales[i] = (a.orbScales[i] ?? 1) + (pos.s - (a.orbScales[i] ?? 1)) * spd;
        a.orbAlphas[i] = (a.orbAlphas[i] ?? 1) + ((pos.dim ? 0.55 : 1) - (a.orbAlphas[i] ?? 1)) * spd;
        const ix = SC_CX + (pos.x - SC_CX) * orbP;
        const iy = cy + (pos.y - cy) * orbP;
        const is = 0.1 + (a.orbScales[i] - 0.1) * orbP;
        ctx.save();
        ctx.translate(ix, iy);
        ctx.scale(is, is);
        ctx.globalAlpha = orbP * a.orbAlphas[i];
        const orbImg = imgCacheRef.current[c.id] ?? null;
        _drawOrbBody(ctx, c.id, sel, pos.dim, hl, focused, hovP, a.rotAngle, orbImg);
        ctx.restore();
      });

      ctx.restore();
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const _hitTest = (e: React.MouseEvent): { type: 'cat'; idx: number } | { type: 'tech'; id: string } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    // isNarrowGeomRef (not the `isNarrow` state) — must match exactly what the
    // RAF loop just drew this frame, which also reads the ref; the state can
    // lag a render behind right after crossing the breakpoint.
    const isNarrowNow = isNarrowGeomRef.current;
    const H = isNarrowNow ? SC_H_NARROW : SC_H;
    const translateY = isNarrowNow ? SC_TRANSLATE_Y_NARROW : SC_TRANSLATE_Y;
    const sx = (e.clientX - rect.left) * (SC_W / rect.width);
    const sy = (e.clientY - rect.top) * (H / rect.height) - translateY;
    const a = _anim.current;
    if (a.con && focus !== null && a.focusTime !== null) {
      const elapsed = performance.now() - a.focusTime;
      for (const n of a.con.nodes) {
        if (!noMotion && elapsed < n.seq * 70 + 180) continue;
        if (Math.hypot(sx - n.x, sy - n.y) < 14) return { type: 'tech', id: n.id };
      }
    }
    const tree = techTreeRef.current;
    for (let i = 0; i < tree.length; i++) {
      const pos = scCorePos(i, focus, tree.length, isNarrowNow);
      if (Math.hypot(sx - pos.x, sy - pos.y) < 36 * pos.s) return { type: 'cat', idx: i };
    }
    return null;
  };

  const _onCanvasMove = (e: React.MouseEvent) => {
    if (keyboardFocusIdx !== null) setKeyboardFocusIdx(null);
    const hit = _hitTest(e);
    const id = hit ? (hit.type === 'cat' ? 'cat-' + hit.idx : hit.id) : null;
    if (hover !== id) {
      setHover(id);
      if (hit && hit.type === 'cat') setPinFocus(hit.idx);
    }
  };
  const _onCanvasClick = (e: React.MouseEvent) => {
    if (keyboardFocusIdx !== null) setKeyboardFocusIdx(null);
    const hit = _hitTest(e);
    if (!hit) return;
    if (hit.type === 'cat') {
      openCat(hit.idx);
      setTimeout(() => {
        const btn = panelRef.current?.querySelector('button, [tabindex="0"]');
        if (btn instanceof HTMLElement) btn.focus();
      }, 0);
    } else {
      if (tech === hit.id) {
        setTech(null);
        setHover(null);
      } else setTech(hit.id);
    }
  };

  const focusPanel = () => {
    setTimeout(() => {
      const btn = panelRef.current?.querySelector('button, [tabindex="0"]');
      if (btn instanceof HTMLElement) btn.focus();
    }, 0);
  };

  const _onKeyDown = (e: React.KeyboardEvent) => {
    const N = techTree.length;
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp': {
        e.preventDefault();
        const next = keyboardFocusIdx === null ? 0 : (keyboardFocusIdx - 1 + N) % N;
        setKeyboardFocusIdx(next);
        setPinFocus(next);
        setHover('cat-' + next);
        const catName = techTree[next]?.name;
        if (catName) setAnnouncement(`${catName}, categoria ${next + 1} de ${N}`);
        break;
      }
      case 'ArrowRight':
      case 'ArrowDown': {
        e.preventDefault();
        const next = keyboardFocusIdx === null ? 0 : (keyboardFocusIdx + 1) % N;
        setKeyboardFocusIdx(next);
        setPinFocus(next);
        setHover('cat-' + next);
        const catName = techTree[next]?.name;
        if (catName) setAnnouncement(`${catName}, categoria ${next + 1} de ${N}`);
        break;
      }
      case 'Enter':
      case ' ': {
        if (keyboardFocusIdx !== null) {
          e.preventDefault();
          openCat(keyboardFocusIdx);
          setHover(null);
          const catName = techTree[keyboardFocusIdx]?.name;
          if (catName) setAnnouncement(`Categoria ${catName} selecionada. Painel com detalhes aberto.`);
          focusPanel();
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        if (tech) {
          setTech(null);
          setHover(null);
          setAnnouncement('Voltou para visão geral da categoria.');
        } else if (focus !== null) {
          goHome();
          setAnnouncement('Voltou para visão geral de todas as categorias.');
        } else if (panelOpen) {
          handleToggle();
          setAnnouncement('Painel recolhido.');
        }
        setTimeout(() => canvasRef.current?.focus(), 0);
        break;
      }
      case 'Home': {
        e.preventDefault();
        setKeyboardFocusIdx(0);
        setPinFocus(0);
        setHover('cat-0');
        const catName = techTree[0]?.name;
        if (catName) setAnnouncement(`${catName}, categoria 1 de ${N}`);
        break;
      }
      case 'End': {
        e.preventDefault();
        setKeyboardFocusIdx(N - 1);
        setPinFocus(N - 1);
        setHover('cat-' + (N - 1));
        const catName = techTree[N - 1]?.name;
        if (catName) setAnnouncement(`${catName}, categoria ${N} de ${N}`);
        break;
      }
    }
  };

  const totalTechs = techTree.reduce((acc, c) => acc + c.techs.length, 0);

  // documentIds de todas as tecnologias da skill focada → usados como filtro da query Projects
  const focusTechIds = useMemo(() => (focusCat ? focusCat.techs.map((t) => t.documentId) : []), [focusCat]);
  const { projects: skillProjects, loading: skillProjectsLoading } = useSkillProjects(focusTechIds, locale);

  // documentId da tecnologia individual selecionada → filtro exclusivo para o painel de tech
  const selectedNode = tech && constellation ? constellation.nodes.find((n) => n.id === tech) : null;
  const selectedTechDocumentId = selectedNode?.documentId ?? '';
  const { projects: techProjects, loading: techProjectsLoading } = useSkillProjects(
    selectedTechDocumentId ? [selectedTechDocumentId] : [],
    locale,
  );

  const categoryItems = useMemo<SkillListItemData[]>(
    () =>
      techTree.map((c, i) => {
        const isEgg = Boolean(c.iconUrl?.toLowerCase().includes('egg'));
        const icon = c.iconUrl ? (
          <SvgIcon src={c.iconUrl} size={15} color="var(--cyan)" className={isEgg ? '!cursor-gamer-help' : undefined} />
        ) : undefined;
        return {
          kind: 'category' as const,
          id: 'cat-' + i,
          icon:
            icon && isEgg ? (
              <Tooltip content="Hmmm...">
                <span className="inline-flex">{icon}</span>
              </Tooltip>
            ) : (
              icon
            ),
          label: c.name,
          value: c.techs.length,
        };
      }),
    [techTree],
  );

  // ---------- side panel ----------
  let panel: React.ReactElement;
  if (tech && constellation) {
    const node = constellation.nodes.find((n) => n.id === tech);
    const cat = focusCat!;
    panel = (
      <>
        <div className="sc-p-info">
          <div className="sc-p-head">
            <h3 className="sc-p-title">{node ? node.name : ''}</h3>
          </div>
          <div className="sc-p-desc" style={{ color: 'rgb(171, 198, 215)' }}>
            Parte do núcleo <b>{cat.name}</b>
            <span style={{ color: '#abc6d7' }}>.</span>
          </div>
          <div className="sc-p-metrics">
            <div className="sc-metric">
              <div
                className="value"
                style={{
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  color: 'var(--cyan)',
                }}
              >
                {cat.iconUrl &&
                  (() => {
                    // isEgg depends entirely on the icon asset assigned to this skill
                    // group in the CMS (see src/shared/data/map-portfolio.ts) — there is
                    // no client-side randomization. See docs/easter-egg.md for the flow.
                    const isEgg = cat.iconUrl.toLowerCase().includes('egg');
                    const icon = (
                      <SvgIcon
                        src={cat.iconUrl}
                        size={20}
                        color="var(--cyan)"
                        strokeWidth={1.5}
                        className={isEgg ? 'lucide-egg' : ''}
                        onClick={isEgg ? handleEggClick : undefined}
                      />
                    );
                    return isEgg ? (
                      <Tooltip content="Hmmm, que estranho">
                        <motion.span
                          className="inline-flex"
                          whileHover={
                            eggOpen
                              ? undefined
                              : {
                                  x: [0, -3, 3, -3, 3, -2, 2, 0],
                                  transition: { duration: 0.4, repeat: Infinity, repeatDelay: 3 },
                                }
                          }
                          whileFocus={
                            eggOpen
                              ? undefined
                              : {
                                  x: [0, -3, 3, -3, 3, -2, 2, 0],
                                  transition: { duration: 0.4, repeat: Infinity, repeatDelay: 3 },
                                }
                          }
                        >
                          {icon}
                        </motion.span>
                      </Tooltip>
                    ) : (
                      icon
                    );
                  })()}
              </div>
              <div className="label" style={{ color: 'rgb(171, 198, 215)' }}>
                {cat.name}
              </div>
            </div>
            <div className="sc-metric">
              <div className="value">{cat.techs.length}</div>
              <div className="label" style={{ color: 'rgb(171, 198, 215)' }}>
                no núcleo
              </div>
            </div>
          </div>
        </div>
        <div className="sc-scroll">
          <div className="sc-future min-h-[185px]">
            <div className="sc-p-label mb-4">PROJETOS</div>
            <ScrollList maxHeight={133} overlayGradient="linear-gradient(#0000, #07121fba 95%)">
              {techProjectsLoading ? (
                <div className="sc-fblock">
                  <span className="title" style={{ color: 'rgb(171, 198, 215)' }}>
                    Carregando...
                  </span>
                </div>
              ) : techProjects.length === 0 ? (
                <EmptyState className="pt-[16px] pb-[16px]" />
              ) : (
                <div className="sc-cat-list">
                  {techProjects.map((p, i) => (
                    <SkillListItem
                      key={p.id}
                      index={i}
                      skipEnterAnimation={hasAnimatedListsOnceRef.current}
                      item={{
                        kind: 'project',
                        id: p.id,
                        label: p.projectName,
                        onView: () => setOpenProject(p),
                        active: openProject?.id === p.id,
                      }}
                    />
                  ))}
                </div>
              )}
            </ScrollList>
          </div>
          <div className="sc-future min-h-[122px]">
            <div className="sc-p-label">Outras no núcleo</div>
            <ScrollList maxHeight={70} overlayGradient="linear-gradient(#0000, #07121fba 95%)">
              <div className="sc-chips">
                {constellation.nodes.map((n) => (
                  <button
                    key={n.id}
                    className={'sc-chip' + (n.id === tech ? ' sel' : '') + (hover === n.id ? ' hl' : '')}
                    onClick={() => {
                      if (tech === n.id) {
                        setTech(null);
                        setHover(null);
                      } else setTech(n.id);
                    }}
                    onMouseEnter={() => setHover(n.id)}
                    onMouseLeave={() => setHover(null)}
                  >
                    {n.name}
                  </button>
                ))}
              </div>
            </ScrollList>
          </div>
        </div>
        <CvButton className="sc-p-back" onClick={() => setTech(null)}>
          voltar
        </CvButton>
      </>
    );
  } else if (focusCat) {
    panel = (
      <>
        <div className="sc-p-info">
          <div className="sc-p-head">
            <h3 className="sc-p-title">{focusCat.name}</h3>
          </div>
          <div className="sc-p-desc" style={{ color: 'rgb(171, 198, 215)' }}>
            {focusCat.desc}
          </div>
          <div className="sc-p-metrics">
            <div className="sc-metric">
              <div className="value">{focusCat.techs.length}</div>
              <div className="label" style={{ color: 'rgb(171, 198, 215)' }}>
                Tecnologias
              </div>
            </div>
            <div className="sc-metric">
              <div className="value">
                {(focus as number) + 1}
                <small style={{ color: 'rgb(171, 198, 215)' }}>/{techTree.length}</small>
              </div>
              <div className="label" style={{ color: 'rgb(171, 198, 215)' }}>
                Núcleo
              </div>
            </div>
          </div>
        </div>
        <div className="sc-scroll">
          <div className="sc-future min-h-[122px]">
            <div className="sc-p-label mb-4">Tecnologias</div>
            <ScrollList maxHeight={70} overlayGradient="linear-gradient(#0000, #07121fba 95%)">
              <div className="sc-chips">
                {(constellation ? constellation.nodes : []).map((n) => (
                  <button
                    key={n.id}
                    className={'sc-chip' + (n.id === tech ? ' sel' : '') + (hover === n.id ? ' hl' : '')}
                    onClick={() => {
                      if (tech === n.id) {
                        setTech(null);
                        setHover(null);
                      } else setTech(n.id);
                    }}
                    onMouseEnter={() => setHover(n.id)}
                    onMouseLeave={() => setHover(null)}
                  >
                    {n.name}
                  </button>
                ))}
              </div>
            </ScrollList>
          </div>
          <div className="sc-future min-h-[185px]">
            <div className="sc-p-label mb-4">PROJETOS</div>
            <ScrollList maxHeight={133} overlayGradient="linear-gradient(#0000, #07121fba 95%)">
              {skillProjectsLoading ? (
                <div className="sc-fblock">
                  <span className="title" style={{ color: 'rgb(171, 198, 215)' }}>
                    Carregando...
                  </span>
                </div>
              ) : skillProjects.length === 0 ? (
                <EmptyState className="pt-[16px] pb-[16px]" />
              ) : (
                <div className="sc-cat-list">
                  {skillProjects.map((p, i) => (
                    <SkillListItem
                      key={p.id}
                      index={i}
                      skipEnterAnimation={hasAnimatedListsOnceRef.current}
                      item={{
                        kind: 'project',
                        id: p.id,
                        label: p.projectName,
                        onView: () => setOpenProject(p),
                        active: openProject?.id === p.id,
                      }}
                    />
                  ))}
                </div>
              )}
            </ScrollList>
          </div>
        </div>
        <CvButton className="sc-p-back" onClick={goHome}>
          voltar
        </CvButton>
      </>
    );
  } else {
    panel = (
      <>
        <div className="sc-p-info">
          <h3 className="sc-p-title">Mapa de Habilidades</h3>
          <div className="sc-p-desc" style={{ color: 'rgb(171, 198, 215)' }}>
            Selecione um núcleo para revelar sua constelação de tecnologias.
          </div>
          <div className="sc-p-metrics">
            <motion.div
              className="sc-metric"
              custom={0 * CARD_STAGGER_STEP}
              variants={cardVariants}
              initial={hasAnimatedListsOnceRef.current ? { opacity: 1, scale: 1, y: 0 } : 'hidden'}
              animate={
                hasAnimatedListsOnceRef.current
                  ? { opacity: 1, scale: 1, y: 0 }
                  : panelExpandComplete
                    ? 'visible'
                    : 'hidden'
              }
            >
              <div className="value">{techTree.length}</div>
              <div className="label" style={{ color: 'rgba(207, 234, 245, 0.85)' }}>
                Núcleos
              </div>
            </motion.div>
            <motion.div
              className="sc-metric"
              custom={1 * CARD_STAGGER_STEP}
              variants={cardVariants}
              initial={hasAnimatedListsOnceRef.current ? { opacity: 1, scale: 1, y: 0 } : 'hidden'}
              animate={
                hasAnimatedListsOnceRef.current
                  ? { opacity: 1, scale: 1, y: 0 }
                  : panelExpandComplete
                    ? 'visible'
                    : 'hidden'
              }
            >
              <div className="value">{totalTechs}</div>
              <div className="label" style={{ color: 'rgb(171, 198, 215)' }}>
                Tecnologias
              </div>
            </motion.div>
          </div>
        </div>
        <div className="sc-scroll">
          <div className="sc-p-label">Categorias</div>
          <div className="sc-cat-list">
            {categoryItems.map((item, i) => (
              <div key={item.id}>
                <SkillListItem
                  item={item}
                  index={i}
                  skipEnterAnimation={hasAnimatedListsOnceRef.current}
                  holdUntilReady={!panelExpandComplete}
                  highlighted={hover === item.id}
                  onSelect={(id) => openCat(parseInt(id.slice(4)))}
                  onMouseEnter={(id) => {
                    setHover(id);
                    setPinFocus(parseInt(id.slice(4)));
                  }}
                  onMouseLeave={() => setHover(null)}
                />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  const panelSelActive = Boolean(tech || focusCat);

  // ---------- canvas + panel ----------
  return (
    <div id="skills-section" className="section sc-section cv-scroll-anchor" ref={sectionRef}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <SectionHeading flash={flash} onFlashEnd={onFlashEnd}>
          Habilidades
        </SectionHeading>
        {showHint && (
          <Tooltip content="Clique em › para abrir o painel lateral" placement="bottom">
            <motion.div
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                marginBottom: '18px',
                pointerEvents: hintVisible ? 'auto' : 'none',
              }}
              animate={{ opacity: hintVisible ? 1 : 0 }}
              transition={noMotion ? { duration: 0 } : { duration: 0.7, ease: 'easeOut' }}
            >
              <ShimmerStatus
                text="Conteúdo extra disponível"
                className="cv-shimmer-hint text-[10px] cursor-gamer-help normal-case"
              />
            </motion.div>
          </Tooltip>
        )}
      </div>
      <motion.div
        className={
          'sc-frame' +
          (panelOpen ? '' : ' sc-frame--panel-collapsed') +
          (canvasFocused ? ' sc-frame--canvas-focused' : '')
        }
        style={{ borderStyle: 'dashed' }}
        initial={{ opacity: 0 }}
        animate={noMotion ? { opacity: 1 } : { opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <span className="sc-frame-corner-brackets">
          <CornerBrackets zIndex={4} />
        </span>
        <button
          ref={floatBtnRef}
          className={'sc-float-btn' + (!panelOpen ? ' collapsed' : '')}
          onClick={handleToggle}
          aria-label={panelOpen ? 'Recolher painel' : 'Expandir painel'}
        >
          {panelOpen ? (
            '‹'
          ) : (
            // Pulso do chevron quando o painel está recolhido — antes feito pelo
            // `@keyframes sc-icon-pulse` (1.8s ease-in-out infinite). Migrado para
            // Framer Motion (AGENTS.md); pausa com o reduceMotion global. O text-shadow
            // `none` do keyframe vira uma sombra transparente (spread 0) para permitir
            // a interpolação. var(--cyan) === #2bd6ff.
            <motion.span
              className="sc-chevron"
              style={{ display: 'inline-block' }}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.3, 1],
                textShadow: [
                  '0 0 0px rgba(43, 214, 255, 0)',
                  '0 0 10px #2bd6ff, 0 0 22px rgba(43, 214, 255, 0.5)',
                  '0 0 0px rgba(43, 214, 255, 0)',
                ],
              }}
              transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
            >
              ›
            </motion.span>
          )}
        </button>
        <div className="sc-stage-wrap" ref={stageWrapRef}>
          <span className="sc-stage-corner-brackets">
            <CornerBrackets zIndex={4} size="sm" />
          </span>
          <div className="sc-stage">
            {/* ---- breadcrumb bar ---- */}
            <nav className="sc-bar" aria-label="Breadcrumb">
              <div className="sc-crumb">
                {/* root: Visão geral */}
                {focusCat ? (
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      font: 'inherit',
                      letterSpacing: 'inherit',
                      textTransform: 'inherit',
                      cursor: 'pointer',
                      color: 'var(--color-cv-text-dim)',
                      padding: 0,
                      transition: 'color .15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-cv-text-dim)')}
                    onClick={goHome}
                  >
                    Visão geral
                  </button>
                ) : (
                  <b style={{ color: 'var(--cyan)' }}>Visão geral</b>
                )}

                {/* level 2: skill category */}
                {focusCat && (
                  <>
                    <span className="arr">›</span>
                    {tech && constellation ? (
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          font: 'inherit',
                          letterSpacing: 'inherit',
                          textTransform: 'inherit',
                          cursor: 'pointer',
                          color: 'var(--color-cv-text-dim)',
                          padding: 0,
                          transition: 'color .15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-cv-text-dim)')}
                        onClick={() => setTech(null)}
                      >
                        {focusCat.name}
                      </button>
                    ) : (
                      <b>{focusCat.name}</b>
                    )}
                  </>
                )}

                {/* level 3: tech */}
                {tech && constellation && (
                  <>
                    <span className="arr">›</span>
                    <b>{constellation.nodes.find((n) => n.id === tech)?.name}</b>
                  </>
                )}
              </div>
            </nav>
            <canvas
              ref={canvasRef}
              className="sc-svg outline-none focus-visible:outline-none"
              role="application"
              aria-label="Mapa de habilidades interativo. Use as setas do teclado para navegar entre as categorias e Enter para selecionar."
              aria-expanded={panelOpen}
              aria-controls="sc-panel"
              tabIndex={0}
              style={{ cursor: hover ? 'pointer' : 'default' }}
              onMouseMove={_onCanvasMove}
              onMouseLeave={() => {
                setHover(null);
                setKeyboardFocusIdx(null);
              }}
              onFocus={() => setCanvasFocused(true)}
              onBlur={() => {
                setCanvasFocused(false);
                setKeyboardFocusIdx(null);
                setHover(null);
              }}
              onClick={_onCanvasClick}
              onKeyDown={_onKeyDown}
            />
            <p className="sc-nav-hint">Use as setas do teclado para navegar entre as habilidades</p>
          </div>
        </div>
        <motion.div
          className="sc-panel-wrapper"
          // inert: o wrapper colapsa via maxWidth/opacity, então o conteúdo
          // continua no DOM — sem inert ele permanece alcançável via Tab
          inert={!panelOpen}
          style={{ pointerEvents: panelOpen ? 'auto' : 'none' }}
          animate={{ maxWidth: panelOpen ? 340 : 0, opacity: panelOpen ? 1 : 0 }}
          transition={
            noMotion
              ? { duration: 0 }
              : {
                  maxWidth: { duration: 0.55, ease: [0.65, 0, 0.35, 1] },
                  opacity: { duration: 0.4, ease: 'easeOut' },
                }
          }
          onAnimationComplete={handlePanelAnimationComplete}
        >
          <aside
            ref={panelRef}
            id="sc-panel"
            tabIndex={-1}
            className={'sc-panel' + (panelSelActive ? ' sc-p-sel' : '')}
          >
            <AnimatePresence initial={false} custom={panelDirection}>
              <motion.div
                key={panelStepKey}
                className="sc-panel-slide m-4 max-[860px]:mt-7"
                custom={panelDirection}
                variants={panelSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {panel}
              </motion.div>
            </AnimatePresence>
          </aside>
        </motion.div>
      </motion.div>
      <ProjectModal
        data={openProject ?? lastProjectData.current}
        show={openProject !== null}
        onClose={() => setOpenProject(null)}
      />

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Easter-egg minigame modal — currently hardcoded to SnakeGame, no
          registry or random selection between games yet (see docs/easter-egg.md). */}
      <OverlayBase
        open={eggOpen}
        onClose={() => {
          if (!wasReduceMotionOnRef.current) toggle('reduceMotion');
          setEggOpen(false);
        }}
        closeOnBackdropClick={false}
      >
        <SnakeGame
          locale={locale}
          onClose={() => {
            if (!wasReduceMotionOnRef.current) toggle('reduceMotion');
            setEggOpen(false);
          }}
        />
      </OverlayBase>
    </div>
  );
}
