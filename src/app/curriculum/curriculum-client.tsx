'use client';

import clsx from 'clsx';
import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CurriculumData } from '../api/curriculum/data';

const PILL_CLASSES: Record<string, string> = {
  js: 'text-[#e3d34a] border-[#e3d34a] bg-[rgba(227,211,74,0.08)]',
  ts: 'text-[#4ea2ff] border-[#4ea2ff] bg-[rgba(78,162,255,0.08)]',
  rct: 'text-[#2bd6ff] border-[#2bd6ff] bg-[rgba(43,214,255,0.08)]',
  nxt: 'text-[#e0e0e0] border-[#6b7c88] bg-[rgba(255,255,255,0.04)]',
  nd: 'text-[#4ed46a] border-[#4ed46a] bg-[rgba(78,212,106,0.08)]',
  wp: 'text-[#4ed46a] border-[#4ed46a] bg-[rgba(78,212,106,0.06)]',
  html: 'text-[#ff8a3d] border-[#ff8a3d] bg-[rgba(255,138,61,0.08)]',
  css: 'text-[#4ea2ff] border-[#4ea2ff] bg-[rgba(78,162,255,0.08)]',
  git: 'text-[#d967a7] border-[#d967a7] bg-[rgba(217,103,167,0.08)]',
  api: 'text-[#2bd6ff] border-[#2bd6ff] bg-[rgba(43,214,255,0.06)]',
};

function ScrollList({ maxHeight, children }: { maxHeight: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const [overflows, setOverflows] = useState(false);

  const recompute = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setOverflows(el.scrollHeight > el.clientHeight + 2);
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
  }, []);

  useEffect(() => {
    recompute();
  }, [recompute]);

  return (
    <>
      <div
        className={clsx(
          "relative after:content-[''] after:absolute after:left-0 after:right-3 after:bottom-0 after:h-[60px] after:bg-[linear-gradient(to_bottom,transparent,#03060f_95%)] after:pointer-events-none after:z-[2] after:transition-opacity after:duration-[250ms]",
          (atBottom || !overflows) && 'after:opacity-0',
        )}
      >
        <div ref={ref} className="cv-scroll relative pr-2" style={{ maxHeight }} onScroll={recompute}>
          {children}
        </div>
      </div>
      {overflows && (
        <div
          className={clsx(
            'mt-[6px] text-[10px] text-[#a8e8fa] tracking-[0.2em] uppercase text-center opacity-70 flex items-center justify-center gap-[6px]',
            atBottom ? 'invisible' : 'visible',
          )}
          aria-hidden={atBottom}
        >
          <span>Role para ver mais</span>
          <span className="inline-block animate-bob">▼</span>
        </div>
      )}
    </>
  );
}

function Header({ data }: { data: CurriculumData }) {
  const [lvlFill, setLvlFill] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setLvlFill(data.level.fill), 150);
    return () => clearTimeout(t);
  }, [data.level.fill]);

  return (
    <div className="relative border border-cv-cyan bg-[linear-gradient(180deg,rgba(43,214,255,0.04),rgba(43,214,255,0.01))] px-[34px] pt-[28px] pb-[26px] mb-7 shadow-cv-header">
      <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan top-[-5px] left-[-5px] border-r-0 border-b-0" />
      <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan top-[-5px] right-[-5px] border-l-0 border-b-0" />
      <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan bottom-[-5px] left-[-5px] border-r-0 border-t-0" />
      <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan bottom-[-5px] right-[-5px] border-l-0 border-t-0" />
      <div className="flex justify-between items-start gap-[30px] flex-wrap">
        <div className="flex-[1_1_420px] min-w-0">
          <h1 className="text-[44px] text-cv-cyan tracking-[0.18em] mt-0 mb-[14px] cursor-pointer [text-shadow:0_0_12px_rgba(43,214,255,0.4),0_0_30px_rgba(43,214,255,0.2)] max-cv:text-[32px]">
            {'// DEV_01'}
            <span className="inline-block w-[18px] h-[36px] bg-cv-cyan ml-1 align-[-6px] animate-blink shadow-[0_0_10px_#2bd6ff]" />
          </h1>
          <div className="text-cv-text-dim text-[13px] tracking-[0.14em] uppercase flex items-center gap-[14px] flex-wrap">
            <span>{data.name}</span>
            <span className="text-cv-cyan-soft">|</span>
            <strong className="text-cv-text font-normal">{data.role}</strong>
          </div>
          <div className="mt-4 inline-block border border-cv-cyan px-[14px] py-[6px] text-cv-cyan text-[12px] tracking-[0.18em] uppercase bg-[rgba(43,214,255,0.06)]">
            Stack: {data.stack}
          </div>
        </div>
        <div className="text-right min-w-[240px]">
          <div className="text-[11px] text-cv-text-dim tracking-[0.2em] uppercase">{data.level.label}</div>
          <div className="h-2 bg-[rgba(43,214,255,0.08)] border border-cv-border mt-[10px] w-[280px] ml-auto relative overflow-hidden">
            <div
              className="h-full bg-cv-cyan shadow-[0_0_12px_#2bd6ff] transition-[width] duration-[1600ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] delay-200"
              style={{ width: `${lvlFill}%` }}
            />
          </div>
          <div className="text-[12px] text-cv-cyan mt-2 tracking-[0.06em]">{data.level.sub}</div>
        </div>
      </div>
    </div>
  );
}

function Stats({
  items,
  onFirstClick,
  onSecondClick,
}: {
  items: CurriculumData['stats'];
  onFirstClick?: () => void;
  onSecondClick?: () => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-9 max-cv:grid-cols-2">
      {items.map((item, i) => {
        const onClick = i === 0 ? onFirstClick : i === 1 ? onSecondClick : undefined;
        const isClickable = i === 0 || i === 1;
        return (
          <div
            key={item.label}
            className={clsx(
              'border border-cv-border bg-cv-panel px-[18px] pt-[22px] pb-[18px] text-center relative transition-[border-color,transform,box-shadow] duration-[250ms] hover:border-cv-cyan hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(43,214,255,0.12)]',
              isClickable ? 'cursor-pointer' : 'cursor-default',
            )}
            onClick={onClick}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={
              isClickable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onClick?.();
                    }
                  }
                : undefined
            }
          >
            <div className="text-[36px] text-cv-cyan tracking-[0.04em] [text-shadow:0_0_10px_rgba(43,214,255,0.3)]">
              {item.value}
            </div>
            <div className="text-[11px] text-cv-text-dim tracking-[0.18em] uppercase mt-1">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function Skills({
  skills,
  flash,
  onFlashEnd,
}: {
  skills: CurriculumData['skills'];
  flash?: boolean;
  onFlashEnd?: () => void;
}) {
  const sorted = [...skills].sort((a, b) => b.pct - a.pct);
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
      <div className="flex justify-between items-baseline -mt-2 mb-[14px] text-[10px] text-cv-text-muted tracking-[0.18em] uppercase">
        <span>
          Escala em anos · <span className="text-cv-cyan">meta 10 = expert</span>
        </span>
        <span className="text-cv-cyan-dim">0 — — 5 — — 10</span>
      </div>
      <ScrollList maxHeight={190}>
        {sorted.map((skill, i) => (
          <div key={skill.name} className="grid grid-cols-[90px_1fr_64px] items-center gap-[14px] mb-[10px]">
            <div className="text-cv-text text-[13px]">{skill.name}</div>
            <div className="h-2 bg-cv-gray-bar rounded-[1px] overflow-hidden relative">
              <div
                className="h-full transition-[width] duration-[1400ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] shadow-[0_0_8px_currentColor]"
                style={{
                  width: filled ? `${skill.pct}%` : '0%',
                  background: skill.color,
                  color: skill.color,
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
            <div className="text-[11px] text-cv-text-dim text-right tracking-[0.06em] tabular-nums">{skill.label}</div>
          </div>
        ))}
      </ScrollList>
    </div>
  );
}

function StackSection({
  pills,
  onPick,
  flash,
  onFlashEnd,
}: {
  pills: CurriculumData['stackPills'];
  onPick: (label: string) => void;
  flash?: boolean;
  onFlashEnd?: () => void;
}) {
  return (
    <div>
      <h3
        className={clsx(
          "flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]",
          flash && 'animate-flash-header',
        )}
        onAnimationEnd={onFlashEnd}
      >
        Stacks
      </h3>
      <div className="flex flex-wrap gap-[10px]">
        {pills.map((p) => (
          <button
            key={p.label}
            className={clsx(
              'border px-[14px] py-[7px] text-[12px] tracking-[0.12em] cursor-pointer transition-all duration-200 font-cv-mono relative hover:-translate-y-px hover:brightness-[1.2] hover:shadow-[0_0_14px_currentColor]',
              PILL_CLASSES[p.cls],
            )}
            onClick={() => onPick(p.label)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ExperienceModal({
  data,
  show,
  onClose,
}: {
  data: CurriculumData['experience'][0] | null;
  show: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [show, onClose]);

  if (!data) return null;

  return (
    <div
      className={clsx(
        'fixed inset-0 bg-[rgba(3,6,15,0.78)] backdrop-blur-[4px] flex items-center justify-center p-6 z-[300] transition-opacity duration-200',
        show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
      onClick={onClose}
    >
      <div
        className={clsx(
          'relative max-w-[640px] w-full max-h-[86vh] cv-scroll overflow-x-hidden bg-cv-panel border border-cv-cyan px-[30px] pt-[28px] pb-[26px] shadow-[inset_0_0_40px_rgba(43,214,255,0.06),0_0_60px_rgba(43,214,255,0.18)] transition-[transform,opacity] duration-[250ms] ease-[cubic-bezier(0.2,0.7,0.2,1)]',
          show ? 'translate-y-0 scale-100' : 'translate-y-3 scale-[0.98]',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="absolute w-[16px] h-[16px] border-2 border-cv-cyan top-[-5px] left-[-5px] border-r-0 border-b-0" />
        <span className="absolute w-[16px] h-[16px] border-2 border-cv-cyan top-[-5px] right-[-5px] border-l-0 border-b-0" />
        <span className="absolute w-[16px] h-[16px] border-2 border-cv-cyan bottom-[-5px] left-[-5px] border-r-0 border-t-0" />
        <span className="absolute w-[16px] h-[16px] border-2 border-cv-cyan bottom-[-5px] right-[-5px] border-l-0 border-t-0" />
        <button
          className="absolute top-3 right-[14px] bg-transparent border border-cv-border text-cv-cyan font-cv-mono text-[16px] w-7 h-7 flex items-center justify-center cursor-pointer leading-none transition-all duration-200 hover:border-cv-cyan hover:shadow-[0_0_12px_#2bd6ff]"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        <div className="text-cv-cyan text-[10px] tracking-[0.28em] uppercase mb-[14px]">{'// Exp_Record'}</div>
        <h2 className="text-[22px] text-cv-text m-0 mb-1 tracking-[0.04em]">{data.company}</h2>
        <div className="text-[14px] text-cv-cyan tracking-[0.08em]">{data.role}</div>
        <div className="mt-[6px] text-[12px] text-cv-text-dim tracking-[0.14em] uppercase">{data.date}</div>
        <div className="h-px bg-cv-border my-[18px]" />
        <div className="space-y-3">
          {data.details.map((p, i) => (
            <p key={i} className="text-cv-text text-[13px] leading-[1.65] m-0">
              {p}
            </p>
          ))}
        </div>
        <div className="text-cv-cyan text-[11px] tracking-[0.22em] uppercase mt-[18px] mb-[10px]">Stack utilizada</div>
        <div className="flex flex-wrap gap-2">
          {data.stack.map((s) => (
            <span
              key={s}
              className="border border-cv-cyan-dim text-cv-cyan bg-[rgba(43,214,255,0.06)] px-[10px] py-1 text-[11px] tracking-[0.1em]"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExperienceSection({
  items,
  flash,
  onFlashEnd,
}: {
  items: CurriculumData['experience'];
  flash?: boolean;
  onFlashEnd?: () => void;
}) {
  const [open, setOpen] = useState<CurriculumData['experience'][0] | null>(null);
  const lastData = useRef<CurriculumData['experience'][0] | null>(null);
  if (open !== null) lastData.current = open;

  return (
    <div id="experience-section">
      <h3
        className={clsx(
          "flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]",
          flash && 'animate-flash-header',
        )}
        onAnimationEnd={onFlashEnd}
      >
        Experiências
      </h3>
      {items.map((item) => (
        <div
          key={item.company}
          role="button"
          tabIndex={0}
          className="group relative border border-cv-border bg-cv-panel px-5 py-[18px] mb-3 border-l-2 border-l-cv-cyan transition-[border-color,background,transform,box-shadow] duration-[250ms] cursor-pointer hover:bg-cv-panel2 hover:translate-x-[3px] hover:shadow-[0_0_18px_rgba(43,214,255,0.10)]"
          onClick={() => setOpen(item)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(item);
            }
          }}
        >
          <span className="absolute top-[-13px] right-[20px] text-[10px] text-cv-cyan tracking-[0.16em] uppercase opacity-0 transition-opacity duration-200 group-hover:opacity-90 border border-cv-cyan-dim px-[9px] py-[3px] bg-[rgba(43,214,255,0.06)] backdrop-blur-[18px]">
            Expandir ⊞
          </span>
          <div className="flex justify-between items-baseline flex-wrap gap-2">
            <div>
              <div className="text-[16px] text-cv-text">{item.company}</div>
              <div className="text-[13px] text-cv-cyan mt-1 tracking-[0.06em]">{item.role}</div>
            </div>
            <div className="text-cv-cyan text-[11px] tracking-[0.14em] border border-cv-cyan-dim px-[9px] py-[3px] bg-[rgba(43,214,255,0.06)] whitespace-nowrap">
              {item.date}
            </div>
          </div>
          <div className="text-cv-text-dim text-[13px] mt-[10px] pl-3 border-l border-cv-border line-clamp-2">
            {item.description}
          </div>
        </div>
      ))}
      <ExperienceModal data={open ?? lastData.current} show={open !== null} onClose={() => setOpen(null)} />
    </div>
  );
}

function Achievements({ items }: { items: CurriculumData['achievements'] }) {
  return (
    <div>
      <h3 className="flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]">
        Conquistas
      </h3>
      <ScrollList maxHeight={276}>
        {items.map((item) => (
          <div
            key={item.title}
            className="grid grid-cols-[56px_1fr] gap-[14px] items-center border border-cv-border bg-cv-panel px-[18px] py-[14px] mb-3 transition-[border-color,transform] duration-[250ms] cursor-default hover:border-cv-cyan hover:translate-x-[3px]"
          >
            <Image
              src={`/achievements/achievements-${item.badge}.png`}
              alt={item.title}
              width={56}
              height={56}
              className="object-contain"
            />
            <div>
              <div className="text-[13px] text-cv-text">{item.title}</div>
              <div className="text-[12px] text-cv-text-dim mt-[3px]">{item.desc}</div>
            </div>
          </div>
        ))}
      </ScrollList>
    </div>
  );
}

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function ContactSection({ data }: { data: CurriculumData }) {
  const rows: { icon: React.ReactNode; value: string; href?: string }[] = [
    { icon: <Mail size={14} strokeWidth={1.5} />, value: data.email, href: `mailto:${data.email}` },
    { icon: <GithubIcon size={14} />, value: data.github, href: data.githubUrl },
    { icon: <LinkedinIcon size={14} />, value: data.linkedin, href: data.linkedinUrl },
    { icon: <MapPin size={14} strokeWidth={1.5} />, value: data.location },
    { icon: <Phone size={14} strokeWidth={1.5} />, value: data.phone },
  ];

  return (
    <div>
      <h3 className="flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]">
        Contato
      </h3>
      {rows.map((row) => (
        <div key={row.value} className="grid grid-cols-[22px_1fr] gap-[10px] items-center py-[6px]">
          <div className="text-cv-cyan opacity-90 flex items-center justify-center">{row.icon}</div>
          {row.href ? (
            <a
              className="text-cv-text text-[13px] no-underline hover:text-cv-cyan hover:[text-shadow:0_0_8px_#2bd6ff]"
              href={row.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {row.value}
            </a>
          ) : (
            <div className="text-cv-text text-[13px]">{row.value}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function GamesSection({ games }: { games: CurriculumData['games'] }) {
  return (
    <div>
      <h3 className="flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]">
        Jogos Recentes
      </h3>
      <ScrollList maxHeight={196}>
        {games.map((game) => (
          <div
            key={game.title}
            className="grid grid-cols-[44px_1fr] gap-[14px] items-start border border-cv-border bg-cv-panel px-[14px] py-3 mb-[10px] transition-[border-color,background,transform] duration-[250ms] hover:border-cv-cyan hover:bg-cv-panel2 hover:translate-x-[3px]"
          >
            <div className="w-9 h-9 flex items-center justify-center border border-cv-border bg-cv-bg2 overflow-hidden rounded-[6px]">
              <Image src={game.image} alt={game.title} width={36} height={36} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[13px] text-cv-text">{game.title}</div>
              <div className="text-[11px] text-cv-text-dim mt-[2px]">{game.sub}</div>
              <div className="text-[11px] text-cv-orange mt-[6px] flex items-start gap-[6px] before:content-['◆'] before:text-[8px] before:mt-[2px] before:shrink-0">
                {game.tag}
              </div>
            </div>
          </div>
        ))}
      </ScrollList>
    </div>
  );
}

function EducationSection({ items }: { items: CurriculumData['education'] }) {
  return (
    <div>
      <h3 className="flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]">
        Formação
      </h3>
      <ScrollList maxHeight={170}>
        {items.map((item) => (
          <div
            key={item.title}
            className="border border-cv-border bg-cv-panel px-5 py-[18px] mb-3 last:mb-0 border-l-2 border-l-cv-cyan transition-[border-color,background,transform,box-shadow] duration-[250ms] hover:bg-cv-panel2 hover:translate-x-[3px] hover:shadow-[0_0_18px_rgba(43,214,255,0.10)]"
          >
            <div className="text-cv-text text-[14px]">{item.title}</div>
            <div className="text-cv-text-dim text-[12px] mt-1">{item.description}</div>
            <div className="text-cv-cyan text-[12px] mt-1 tracking-[0.08em]">{item.year}</div>
          </div>
        ))}
      </ScrollList>
    </div>
  );
}

// Toggle para status de trabalho: true = aberto a oportunidades
const OPEN_TO_WORK = true;

const WORK_STATUS = OPEN_TO_WORK
  ? { label: 'Procurando uma guilda', textClass: 'text-cv-yellow' }
  : { label: 'Em guilda', textClass: 'text-cv-text-dim' };

type PresenceStatus = {
  label: string;
  dotClass: string;
};

function getPresenceStatus(totalMinutes: number): PresenceStatus {
  const inRange = (start: number, end: number) => totalMinutes >= start && totalMinutes < end;
  const h = (h: number) => h * 60;

  if (inRange(h(8), h(12) + 30) || inRange(h(14), h(17)) || inRange(h(19), h(22))) {
    return {
      label: 'Online',
      dotClass: 'bg-cv-green shadow-[0_0_8px_#4ed46a] animate-pulse-led',
    };
  }
  if (inRange(h(12) + 30, h(14)) || inRange(h(17), h(19))) {
    return {
      label: 'Em Pausa',
      dotClass: 'bg-cv-orange shadow-[0_0_8px_#ff8a3d] animate-pulse-led-orange',
    };
  }
  return {
    label: 'Offline',
    dotClass: 'bg-cv-red shadow-[0_0_4px_#ff4d4d] animate-pulse-led-red',
  };
}

function Footer() {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    setTime(new Date());
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = time ? String(time.getHours()).padStart(2, '0') : '--';
  const mm = time ? String(time.getMinutes()).padStart(2, '0') : '--';
  const ss = time ? String(time.getSeconds()).padStart(2, '0') : '--';
  const year = time?.getFullYear() ?? '----';

  const totalMinutes = time ? time.getHours() * 60 + time.getMinutes() : -1;
  const presence = getPresenceStatus(totalMinutes);

  return (
    <footer className="mt-12 border-t border-cv-border pt-[14px] pb-[14px] px-2 flex justify-between items-center text-[11px] tracking-[0.22em] uppercase text-cv-text-dim flex-wrap gap-3">
      <div className="flex items-center gap-[10px]">
        <span className={`w-2 h-2 rounded-full ${presence.dotClass}`} />
        {presence.label}
      </div>
      <div className="text-cv-text-muted">
        <a
          href="https://github.com/antonionarcilio"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-cv-cyan transition-colors duration-200"
        >
          created by @antonionarcilio
        </a>{' '}
        · Currículo v1.0.0 · {year} · {hh}:{mm}:{ss}
      </div>
      <div className="flex items-center gap-[10px]">
        Status: <span className={WORK_STATUS.textClass}>{WORK_STATUS.label}</span>
      </div>
    </footer>
  );
}

export default function CurriculumClient({ data }: { data: CurriculumData }) {
  const [toast, setToast] = useState<string | null>(null);
  const toastRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [flashExp, setFlashExp] = useState(false);
  const [flashSkills, setFlashSkills] = useState(false);
  const [flashStack, setFlashStack] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 1800);
  }, []);

  const handleScrollToExperience = useCallback(() => {
    document.getElementById('experience-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => setFlashExp(true), 650);
  }, []);

  const handleScrollToSkills = useCallback(() => {
    document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      setFlashSkills(true);
      setFlashStack(true);
    }, 650);
  }, []);

  const statsWithDynamic = data.stats.map((s) =>
    s.label === 'Tecnologias' ? { ...s, value: `${data.skills.length}+` } : s,
  );

  return (
    <div className="cv-wrapper bg-cv-wrapper text-cv-text font-cv-mono text-[14px] leading-[1.5] tracking-[0.02em] min-h-screen">
      <div className="max-w-[1100px] mx-auto px-6 pt-10 pb-10">
        <Header data={data} />
        <Stats items={statsWithDynamic} onFirstClick={handleScrollToExperience} onSecondClick={handleScrollToSkills} />
        <div className="grid grid-cols-[1.4fr_1fr] gap-12 max-cv:grid-cols-1 max-cv:gap-9">
          <div className="space-y-9">
            <Skills skills={data.skills} flash={flashSkills} onFlashEnd={() => setFlashSkills(false)} />
            <StackSection
              pills={data.stackPills}
              onPick={(label) => showToast(`// ${label} selecionado`)}
              flash={flashStack}
              onFlashEnd={() => setFlashStack(false)}
            />
            <ExperienceSection items={data.experience} flash={flashExp} onFlashEnd={() => setFlashExp(false)} />
            <EducationSection items={data.education} />
          </div>
          <div className="space-y-9">
            <ContactSection data={data} />
            <Achievements items={data.achievements} />
            <GamesSection games={data.games} />
          </div>
        </div>
        <Footer />
      </div>
      <div
        className={clsx(
          'fixed right-6 bottom-6 border border-cv-cyan bg-cv-panel text-cv-cyan px-4 py-[10px] text-[12px] tracking-[0.14em] uppercase shadow-[0_0_20px_rgba(43,214,255,0.2)] transition-all duration-300 pointer-events-none z-[200] font-cv-mono',
          toast ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
        )}
      >
        {toast ?? ''}
      </div>
    </div>
  );
}
