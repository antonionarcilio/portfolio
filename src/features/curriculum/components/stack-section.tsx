'use client';

import clsx from 'clsx';

import type { CurriculumData } from '@/features/curriculum/types/curriculum';

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

export function StackSection({
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
