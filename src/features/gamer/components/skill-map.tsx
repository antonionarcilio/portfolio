'use client';

import { motion, useInView } from 'framer-motion';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { useA11y } from '@/features/gamer/contexts/a11y-context';
import { FUTURE_PROJECTS, SKILL_MAP_CORES, type SkillCore } from '@/features/gamer/data/skill-map';

import { useSnapScroll } from '@/features/gamer/hooks/use-snap-scroll';
import { FlashHeading } from './flash-heading';
import { ScrollList } from './scroll-list';
import { ShimmerStatus } from './shimmer-text';
import { SkillListItem, type SkillListItemData } from './skill-list';
import { Tooltip } from './tooltip';

const TECH_TREE = SKILL_MAP_CORES;

// ============================================================================
//  Constellation geometry — pure helpers, decoupled from React
// ============================================================================
const SC_W = 720;
const SC_H = 560;
const SC_CX = SC_W / 2;
const SC_CY = SC_H / 2;
const SC_HEX_R = 185; // radius of the 7 core hexagon (overview)
const SC_TARGET_R = 108; // outer radius of an expanded constellation
const SC_GOLD = Math.PI * (3 - Math.sqrt(5)); // golden angle → organic spread

interface ConNode {
  id: string;
  name: string;
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

function scHexAngle(i: number) {
  return ((-90 + (i * 360) / TECH_TREE.length) * Math.PI) / 180;
}
function scHexPos(i: number): [number, number] {
  const a = scHexAngle(i);
  return [SC_CX + Math.cos(a) * SC_HEX_R, SC_CY + Math.sin(a) * SC_HEX_R];
}
function scCorePos(i: number, focusIdx: number | null) {
  const [x, y] = scHexPos(i);
  if (focusIdx === null) return { x, y, s: 1, dim: false };
  if (i === focusIdx) return { x, y, s: 1.22, dim: false };
  return { x, y, s: 0.8, dim: true };
}

// Sunflower spread + nearest-neighbour spanning tree → organic, branching
// constellation that grows outward from the core. Deterministic per category.
function scBuildConstellation(cat: SkillCore, catIndex: number): Constellation {
  const techs = cat.techs;
  const M = techs.length;
  const seed = catIndex * 1.7 + 0.6;
  const raw: Array<{ ux: number; uy: number; rr: number }> = [];
  for (let j = 0; j < M; j++) {
    const ang = j * SC_GOLD + seed;
    const rr = Math.sqrt(j + 1);
    raw.push({ ux: Math.cos(ang) * rr, uy: Math.sin(ang) * rr, rr });
  }
  const scale = SC_TARGET_R / Math.sqrt(M);
  const nodes: ConNode[] = raw.map((p, j) => ({
    id: cat.id + '::' + j,
    name: techs[j],
    x: SC_CX + p.ux * scale,
    y: SC_CY + p.uy * scale,
    dist: p.rr * scale,
    seq: 0,
  }));
  const order = nodes.map((_, j) => j).sort((a, b) => nodes[a].dist - nodes[b].dist);
  const placed: Array<{ x: number; y: number }> = [{ x: SC_CX, y: SC_CY }];
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
  _drawOrbIcon(ctx, id);
  ctx.restore();
}

const _eoc = (t: number) => 1 - (1 - t) * (1 - t) * (1 - t);
const _eoq = (t: number) => 1 - (1 - t) * (1 - t);

// ============================================================================
//  Small presentational pieces
// ============================================================================
function SkillIcon({ id, size = 14 }: { id: string; size?: number }) {
  const s = size;
  const base = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const icons: Record<string, React.ReactElement> = {
    frontend: (
      <svg width={s} height={s} viewBox="0 0 24 24" {...base}>
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </svg>
    ),
    backend: (
      <svg width={s} height={s} viewBox="0 0 24 24" {...base}>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5V19A9 3 0 0 0 21 19V5" />
        <path d="M3 12A9 3 0 0 0 21 12" />
      </svg>
    ),
    motion: (
      <svg width={s} height={s} viewBox="0 0 24 24" {...base}>
        <path d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284" />
        <path d="M3 21h18" />
      </svg>
    ),
    web: (
      <svg width={s} height={s} viewBox="0 0 24 24" {...base}>
        <path d="M12 2C8 2 4 8 4 14a8 8 0 0 0 16 0c0-6-4-12-8-12" />
      </svg>
    ),
    devops: (
      <svg width={s} height={s} viewBox="0 0 24 24" {...base}>
        <path d="M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z" />
        <path d="M10 21.9V14L2.1 9.1" />
        <path d="m10 14 11.9-6.9" />
        <path d="M14 19.8v-8.1" />
        <path d="M18 17.5V9.4" />
      </svg>
    ),
    ai: (
      <svg width={s} height={s} viewBox="0 0 24 24" {...base}>
        <path d="M12 18V5" />
        <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
        <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
        <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
        <path d="M18 18a4 4 0 0 0 2-7.464" />
        <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
        <path d="M6 18a4 4 0 0 1-2-7.464" />
        <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
      </svg>
    ),
    testing: (
      <svg width={s} height={s} viewBox="0 0 24 24" {...base}>
        <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
        <path d="M6.453 15h11.094" />
        <path d="M8.5 2h7" />
      </svg>
    ),
  };
  return icons[id] || null;
}

const FUTURE_PROJECT_ITEMS: SkillListItemData[] = FUTURE_PROJECTS.map((b) => ({
  kind: 'project' as const,
  id: b,
  label: b,
}));

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
}

const PANEL_LS_KEY = 'gamer:skillmap:panel';

export function SkillMap({
  onPanelChange,
  flash,
  onFlashEnd,
}: {
  onPanelChange?: (open: boolean) => void;
  flash?: boolean;
  onFlashEnd?: () => void;
}) {
  const { opts } = useA11y();
  const noMotion = opts.reduceMotion;

  const [panelOpen, setPanelOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (panelOpen) {
      // Step 1+2 simultaneously: panel collapses AND frame narrows right→left
      setPanelOpen(false);
      const col1 = document.querySelector('.sm-col1') as HTMLElement | null;
      const frame = document.querySelector('.sc-frame') as HTMLElement | null;
      if (col1 && frame) {
        const curW = frame.getBoundingClientRect().width;
        const tgtW = col1.getBoundingClientRect().width;
        frame.style.width = curW + 'px';
        frame.style.transition = 'width .55s cubic-bezier(0.65,0,0.35,1)';
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            frame.style.width = tgtW + 'px';
          }),
        );
      }

      // Step 3: snap layout to 1-column after both animations finish
      setTimeout(() => {
        onPanelChange?.(false);
        setTimeout(() => {
          const f = document.querySelector('.sc-frame') as HTMLElement | null;
          if (f) {
            f.style.transition = '';
            f.style.width = '';
          }
        }, 80);
      }, 620);
    } else {
      // Oculta hint antes de expandir, aguarda fade-out e só então expande
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      if (hintFadeRef.current) clearTimeout(hintFadeRef.current);
      setHintVisible(false);
      hintFadeRef.current = setTimeout(() => setShowHint(false), 350);

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
              if (frame && curW && tgtW && tgtW > curW) {
                frame.style.transition = 'width .55s cubic-bezier(0.65,0,0.35,1)';
                frame.style.width = tgtW + 'px';
              }
              if (stageWrap && stageTgtW && stageW && stageTgtW > stageW) {
                stageWrap.style.transition = 'width .55s cubic-bezier(0.65,0,0.35,1)';
                stageWrap.style.width = stageTgtW + 'px';
              }
              setPanelOpen(true);
            });

            // Limpeza após animação concluída
            setTimeout(() => {
              if (frame) {
                frame.style.transition = '';
                frame.style.width = '';
              }
              if (stageWrap) {
                stageWrap.style.transition = '';
                stageWrap.style.width = '';
                stageWrap.style.flex = '';
              }
              if (panelWrap) panelWrap.style.marginLeft = '';
            }, 700);
          }, 120);
        });
      }, 360); // aguarda hint fade-out antes de expandir
    }
  };

  const [focus, setFocus] = useState<number | null>(null); // expanded orb index | null
  const [pinFocus, setPinFocus] = useState(0); // persistently focused orb (default = frontend)
  const [tech, setTech] = useState<string | null>(null); // tech node id | null
  const [hover, setHover] = useState<string | null>(null); // "cat-<i>" | tech id | null

  // ── canvas refs ───────────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
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
    orbScales: TECH_TREE.map(() => 1),
    orbAlphas: TECH_TREE.map(() => 1),
  });
  const _st = useRef<StateRef>({ focus: null, pinFocus: 0, tech: null, hover: null });
  _st.current = { focus, pinFocus, tech, hover };
  const _reduce = useRef(noMotion);
  _reduce.current = noMotion;

  const focusCat = focus === null ? null : TECH_TREE[focus];
  const constellation = useMemo<Constellation | null>(
    () => (focusCat ? scBuildConstellation(focusCat, focus as number) : null),
    [focus, focusCat],
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

  // Sync constellation to canvas when focus changes
  useEffect(() => {
    const a = _anim.current;
    if (focus !== null) {
      a.con = scBuildConstellation(TECH_TREE[focus], focus);
      a.focusTime = performance.now();
    } else {
      a.con = null;
      a.focusTime = null;
    }
  }, [focus]);

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
      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      if (!cw || !ch) return;
      const pw = (cw * dpr) | 0;
      const ph = (ch * dpr) | 0;
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, pw, ph);
      ctx.save();
      ctx.scale(pw / SC_W, ph / SC_H);
      ctx.translate(0, 20);
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
      const dispCat = TECH_TREE[dispIdx];
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
        ctx.arc(SC_CX, SC_CY, SC_HEX_R, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = a.ovFade * 0.5;
        ctx.beginPath();
        ctx.arc(SC_CX, SC_CY, SC_HEX_R * 0.55, 0, Math.PI * 2);
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
        ctx.arc(SC_CX, SC_CY, 10.5, 0, Math.PI * 2);
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
          const _pxCY = (SC_CY + 20) * (ch / SC_H);
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
      const N = TECH_TREE.length;
      TECH_TREE.forEach((c, i) => {
        const pos = scCorePos(i, st.focus);
        const sel = st.focus === i;
        const hovP = a.hov['cat-' + i] || 0;
        const hl = hovP > 0.1;
        const focused = !sel && !pos.dim && dispIdx === i && hovCatIdx === null;
        const orbDelay = i * 95;
        const orbDur = (0.8 - i * (0.45 / (N - 1))) * 1000;
        const orbP = _eoc(Math.max(0, Math.min(1, (introAge - orbDelay) / orbDur)));
        if (orbP <= 0) return;
        // Smooth scale + opacity transitions when focus changes
        const spd = reduce ? 1 : Math.min(1, dt / 320);
        a.orbScales[i] += (pos.s - a.orbScales[i]) * spd;
        a.orbAlphas[i] += ((pos.dim ? 0.55 : 1) - a.orbAlphas[i]) * spd;
        const ix = SC_CX + (pos.x - SC_CX) * orbP;
        const iy = SC_CY + (pos.y - SC_CY) * orbP;
        const is = 0.1 + (a.orbScales[i] - 0.1) * orbP;
        ctx.save();
        ctx.translate(ix, iy);
        ctx.scale(is, is);
        ctx.globalAlpha = orbP * a.orbAlphas[i];
        _drawOrbBody(ctx, c.id, sel, pos.dim, hl, focused, hovP, a.rotAngle);
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
    const sx = (e.clientX - rect.left) * (SC_W / rect.width);
    const sy = (e.clientY - rect.top) * (SC_H / rect.height) - 20;
    const a = _anim.current;
    if (a.con && focus !== null && a.focusTime !== null) {
      const elapsed = performance.now() - a.focusTime;
      for (const n of a.con.nodes) {
        if (!noMotion && elapsed < n.seq * 70 + 180) continue;
        if (Math.hypot(sx - n.x, sy - n.y) < 14) return { type: 'tech', id: n.id };
      }
    }
    for (let i = 0; i < TECH_TREE.length; i++) {
      const pos = scCorePos(i, focus);
      if (Math.hypot(sx - pos.x, sy - pos.y) < 36 * pos.s) return { type: 'cat', idx: i };
    }
    return null;
  };

  const _onCanvasMove = (e: React.MouseEvent) => {
    const hit = _hitTest(e);
    const id = hit ? (hit.type === 'cat' ? 'cat-' + hit.idx : hit.id) : null;
    if (hover !== id) {
      setHover(id);
      if (hit && hit.type === 'cat') setPinFocus(hit.idx);
    }
  };
  const _onCanvasClick = (e: React.MouseEvent) => {
    const hit = _hitTest(e);
    if (!hit) return;
    if (hit.type === 'cat') openCat(hit.idx);
    else {
      if (tech === hit.id) {
        setTech(null);
        setHover(null);
      } else setTech(hit.id);
    }
  };

  const totalTechs = TECH_TREE.reduce((acc, c) => acc + c.techs.length, 0);

  const categoryItems = useMemo<SkillListItemData[]>(
    () =>
      TECH_TREE.map((c, i) => ({
        kind: 'category' as const,
        id: 'cat-' + i,
        icon: <SkillIcon id={c.id} size={15} />,
        label: c.name,
        value: c.techs.length,
      })),
    [],
  );

  const { containerRef: projectsListRef, getCardRef: getProjectCardRef } = useSnapScroll(FUTURE_PROJECT_ITEMS.length);

  // ---------- side panel ----------
  let panel: React.ReactElement;
  if (tech && constellation) {
    const node = constellation.nodes.find((n) => n.id === tech);
    const cat = focusCat!;
    panel = (
      <aside className="sc-panel sc-p-sel">
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
                className="v"
                style={{
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  color: 'var(--cyan)',
                }}
              >
                <SkillIcon id={cat.id} size={20} />
              </div>
              <div className="l" style={{ color: 'rgb(171, 198, 215)' }}>
                {cat.name}
              </div>
            </div>
            <div className="sc-metric">
              <div className="v">{cat.techs.length}</div>
              <div className="l" style={{ color: 'rgb(171, 198, 215)' }}>
                no núcleo
              </div>
            </div>
          </div>
        </div>
        <div className="sc-scroll">
          <div className="sc-future">
            <div className="sc-p-label">PROJETOS</div>
            <ScrollList
              ref={projectsListRef}
              maxHeight={133}
              itemCount={FUTURE_PROJECT_ITEMS.length}
              overlayGradient="linear-gradient(#0000, #07121fba 95%)"
              className="mr-[-5px]"
            >
              <div className="sc-cat-list">
                {FUTURE_PROJECT_ITEMS.map((item, i) => (
                  <div key={item.id} ref={getProjectCardRef(i)}>
                    <SkillListItem item={item} index={i} />
                  </div>
                ))}
              </div>
            </ScrollList>
          </div>
          <div className="sc-p-label">Outras no núcleo</div>
          <ScrollList maxHeight={70} overlayGradient="linear-gradient(#0000, #07121fba 95%)" className="mr-[-5px]">
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
        <button className="sc-p-back" onClick={() => setTech(null)}>
          voltar
        </button>
      </aside>
    );
  } else if (focusCat) {
    panel = (
      <aside className="sc-panel sc-p-sel">
        <div className="sc-p-info">
          <div className="sc-p-head">
            <h3 className="sc-p-title">
              {focusCat.label
                ? focusCat.label.map((l, i) => (
                    <Fragment key={i}>
                      {l}
                      {i < focusCat.label!.length - 1 && <br />}
                    </Fragment>
                  ))
                : focusCat.name}
            </h3>
          </div>
          <div className="sc-p-desc" style={{ color: 'rgb(171, 198, 215)' }}>
            {focusCat.desc}
          </div>
          <div className="sc-p-metrics">
            <div className="sc-metric">
              <div className="v">{focusCat.techs.length}</div>
              <div className="l" style={{ color: 'rgb(171, 198, 215)' }}>
                Tecnologias
              </div>
            </div>
            <div className="sc-metric">
              <div className="v">
                {(focus as number) + 1}
                <small style={{ color: 'rgb(171, 198, 215)' }}>/{TECH_TREE.length}</small>
              </div>
              <div className="l" style={{ color: 'rgb(171, 198, 215)' }}>
                Núcleo
              </div>
            </div>
          </div>
        </div>
        <div className="sc-scroll">
          <div className="sc-future">
            <div className="sc-p-label">Tecnologias</div>
            <ScrollList maxHeight={70} overlayGradient="linear-gradient(#0000, #07121fba 95%)" className="mr-[-5px]">
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
          <div className="sc-future">
            <div className="sc-p-label">PROJETOS</div>
            <ScrollList
              ref={projectsListRef}
              maxHeight={133}
              itemCount={FUTURE_PROJECT_ITEMS.length}
              overlayGradient="linear-gradient(#0000, #07121fba 95%)"
              className="mr-[-5px]"
            >
              <div className="sc-cat-list">
                {FUTURE_PROJECT_ITEMS.map((item, i) => (
                  <div key={item.id} ref={getProjectCardRef(i)}>
                    <SkillListItem item={item} index={i} />
                  </div>
                ))}
              </div>
            </ScrollList>
          </div>
        </div>
        <button className="sc-p-back" onClick={goHome}>
          voltar
        </button>
      </aside>
    );
  } else {
    panel = (
      <aside className="sc-panel">
        <div className="sc-p-info">
          <h3 className="sc-p-title">Mapa de Habilidades</h3>
          <div className="sc-p-desc" style={{ color: 'rgb(171, 198, 215)' }}>
            Selecione um núcleo para revelar sua constelação de tecnologias.
          </div>
          <div className="sc-p-metrics">
            <div className="sc-metric">
              <div className="v">{TECH_TREE.length}</div>
              <div className="l" style={{ color: 'rgba(207, 234, 245, 0.85)' }}>
                Núcleos
              </div>
            </div>
            <div className="sc-metric">
              <div className="v">{totalTechs}</div>
              <div className="l" style={{ color: 'rgb(171, 198, 215)' }}>
                Tecnologias
              </div>
            </div>
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
      </aside>
    );
  }

  // ---------- canvas + panel ----------
  return (
    <div id="skills-section" className="section sc-section" ref={sectionRef}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <FlashHeading flash={flash} onFlashEnd={onFlashEnd}>
          Habilidades
        </FlashHeading>
        {showHint && (
          <Tooltip content="Clique em › para abrir o painel lateral" placement="bottom">
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                marginBottom: '18px',
                opacity: hintVisible ? 1 : 0,
                transition: 'opacity 0.7s ease',
                pointerEvents: hintVisible ? 'auto' : 'none',
              }}
            >
              <ShimmerStatus
                text="Expanda para ver mais detalhes"
                className="cv-shimmer-hint text-[8px] cursor-gamer-help"
              />
            </div>
          </Tooltip>
        )}
      </div>
      <motion.div
        className={'sc-frame' + (panelOpen ? '' : ' sc-frame--panel-collapsed')}
        style={{ borderStyle: 'dashed' }}
        initial={{ opacity: 0 }}
        animate={noMotion ? { opacity: 1 } : { opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <span className="corner tl"></span>
        <span className="corner tr"></span>
        <span className="corner bl"></span>
        <span className="corner br"></span>
        <button
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
        <div className="sc-stage-wrap">
          <div className="sc-stage">
            {/* ---- breadcrumb bar ---- */}
            <div className="sc-bar" aria-label="breadcrumb">
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
                      color: 'var(--text-muted)',
                      padding: 0,
                      transition: 'color .15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
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
                          color: 'var(--text-muted)',
                          padding: 0,
                          transition: 'color .15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
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
            </div>
            <canvas
              ref={canvasRef}
              className="sc-svg"
              aria-label="Mapa de Habilidades"
              style={{ cursor: hover ? 'pointer' : 'default' }}
              onMouseMove={_onCanvasMove}
              onMouseLeave={() => setHover(null)}
              onClick={_onCanvasClick}
            />
          </div>
        </div>
        <div
          className="sc-panel-wrapper"
          style={{
            maxWidth: panelOpen ? '340px' : '0',
            opacity: panelOpen ? 1 : 0,
            pointerEvents: panelOpen ? 'auto' : 'none',
            transition: 'max-width .55s cubic-bezier(0.65, 0, 0.35, 1), opacity .4s ease',
          }}
        >
          {panel}
        </div>
      </motion.div>
    </div>
  );
}
