'use client';

import { useEffect, useState } from 'react';

import type { CurriculumData } from '@/features/curriculum/types/curriculum';

export function CvHeader({ data }: { data: CurriculumData }) {
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
      <div className="flex justify-between items-start gap-[30px] flex-wrap max-[847px]:flex-col max-[847px]:items-center">
        <div className="flex-[1_1_420px] min-w-0 max-[847px]:text-center max-[847px]:flex-none max-[847px]:w-full">
          <h1 className="text-[44px] text-cv-cyan tracking-[0.18em] mt-0 mb-[14px] cursor-pointer [text-shadow:0_0_12px_rgba(43,214,255,0.4),0_0_30px_rgba(43,214,255,0.2)] max-cv:text-[32px]">
            {'// DEV_01'}
            <span className="inline-block w-[18px] h-[36px] bg-cv-cyan ml-1 align-[-6px] animate-blink shadow-[0_0_10px_#2bd6ff]" />
          </h1>
          <div className="text-cv-text-dim text-[13px] tracking-[0.14em] uppercase flex items-center gap-[14px] flex-wrap max-[847px]:justify-center">
            <span>{data.name}</span>
            <span className="text-cv-cyan-soft">|</span>
            <strong className="text-cv-text font-normal">{data.role}</strong>
          </div>
          <div className="mt-4 inline-block border border-cv-cyan px-[14px] py-[6px] text-cv-cyan text-[12px] tracking-[0.18em] uppercase bg-[rgba(43,214,255,0.06)] max-[847px]:mx-auto">
            Stack favorita: {data.stack}
          </div>
        </div>
        <div className="text-right min-w-[240px] max-[847px]:text-center max-[847px]:min-w-0 max-[847px]:w-full">
          <div className="text-[11px] text-cv-text-dim tracking-[0.2em] uppercase">{data.level.label}</div>
          <div className="h-2 bg-[rgba(43,214,255,0.08)] border border-cv-border mt-[10px] max-w-[280px] ml-auto relative overflow-hidden max-[847px]:mx-auto">
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
