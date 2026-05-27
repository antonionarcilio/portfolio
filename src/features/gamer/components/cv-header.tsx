'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import type { PortfolioData } from '@/features/gamer/types/portfolio';
import { A11yDropdown } from './a11y-dropdown';

function useTypewriter(text: string, speed = 65, startTyping = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!startTyping) return;
    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i === text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, startTyping]);

  return { displayed, done };
}

function BlinkingCursor({ className = '' }: { className?: string }) {
  return (
    <motion.span
      className={`inline-block bg-cv-cyan shadow-[0_0_10px_#2bd6ff] ml-1 ${className}`}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: 'linear', times: [0, 0.45, 0.5, 1] }}
    />
  );
}

export function CvHeader({ data }: { data: PortfolioData }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true });

  const { displayed: titleText, done: titleDone } = useTypewriter('// DEV_01', 80, isInView);
  const { displayed: nameText, done: nameDone } = useTypewriter(data.name, 60, titleDone);
  const { displayed: roleText, done: roleDone } = useTypewriter(data.role, 60, nameDone);

  const allDone = titleDone && nameDone && roleDone;

  return (
    <div
      ref={headerRef}
      className="relative border border-cv-cyan bg-[linear-gradient(180deg,rgba(43,214,255,0.04),rgba(43,214,255,0.01))] px-[34px] pt-[28px] pb-[26px] mb-7 shadow-cv-header"
    >
      <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan top-[-5px] left-[-5px] border-r-0 border-b-0" />
      <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan top-[-5px] right-[-5px] border-l-0 border-b-0" />
      <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan bottom-[-5px] left-[-5px] border-r-0 border-t-0" />
      <span className="absolute w-[18px] h-[18px] border-2 border-cv-cyan bottom-[-5px] right-[-5px] border-l-0 border-t-0" />
      <div className="flex justify-between items-start gap-[30px] flex-wrap max-[847px]:flex-col max-[847px]:items-center cv-header-info-row">
        <div className="flex-[1_1_420px] min-w-0 max-[847px]:text-center max-[847px]:flex-none max-[847px]:w-full cv-header-info-left">
          <p className="text-[44px] text-cv-cyan tracking-[0.18em] mt-0 mb-[14px] [text-shadow:0_0_12px_rgba(43,214,255,0.4),0_0_30px_rgba(43,214,255,0.2)] max-cv:text-[32px]">
            {titleText}
            {(!titleDone || allDone) && <BlinkingCursor className="w-[18px] h-[36px] align-[-6px] mb-[3.5px]" />}
          </p>
          <h1 className="text-cv-text-dim text-[13px] tracking-[0.14em] uppercase flex items-center gap-[14px] flex-wrap max-[847px]:justify-center cv-header-name-row">
            <span className="relative inline-block">
              <span className="invisible whitespace-nowrap">{data.name}</span>
              <span className="absolute top-0 left-0 whitespace-nowrap">
                {nameText}
                {titleDone && !nameDone && <BlinkingCursor className="w-[7px] h-[13px] align-middle" />}
              </span>
            </span>
            <span className="text-cv-cyan-soft cv-name-divider">|</span>
            <strong className="text-cv-text font-normal relative inline-block">
              <span className="invisible whitespace-nowrap">{data.role}</span>
              <span className="absolute top-0 left-0 whitespace-nowrap">
                {roleText}
                {nameDone && !roleDone && <BlinkingCursor className="w-[7px] h-[13px] align-middle" />}
              </span>
            </strong>
          </h1>
        </div>
        <div className="text-right min-w-[240px] max-[847px]:text-center max-[847px]:min-w-0 max-[847px]:w-full cv-header-info-right">
          <span className="block text-[11px] text-cv-text-dim tracking-[0.2em] uppercase">{data.level.label}</span>
          <div className="h-2 bg-[rgba(43,214,255,0.08)] border border-cv-border mt-[10px] w-full max-w-[280px] ml-auto relative overflow-hidden max-[847px]:mx-auto cv-header-level-bar">
            <motion.div
              className="h-full bg-cv-cyan shadow-[0_0_12px_#2bd6ff]"
              initial={{ width: '0%' }}
              animate={{ width: isInView ? `${data.level.fill}%` : '0%' }}
              transition={{ duration: 1.6, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 }}
            />
          </div>
          <span className="block text-[12px] text-cv-cyan mt-2 tracking-[0.06em]">{data.level.sub}</span>
        </div>
      </div>
      <div className="mt-[22px] pt-4 border-t border-dashed border-cv-border flex items-center justify-between gap-[18px] flex-wrap cv-header-bottom">
        <span className="inline-block border border-cv-cyan px-[14px] py-[6px] text-cv-cyan text-[12px] tracking-[0.18em] uppercase bg-[rgba(43,214,255,0.06)] text-center">
          Stack favorita: {data.stack}
        </span>
        <div className="flex items-center gap-[18px] flex-wrap cv-header-bottom-actions">
          <div
            className="inline-flex items-center gap-2 border border-cv-border px-[10px] py-1 bg-[rgba(43,214,255,0.04)]"
            role="group"
            aria-label="Language"
          >
            <button className="bg-transparent border-0 text-cv-cyan text-[12px] tracking-[0.22em] px-1 py-0.5 [text-shadow:0_0_8px_#2bd6ff]">
              PT
            </button>
            <span className="text-cv-cyan-soft text-[12px]">|</span>
            <button
              className="bg-transparent border-0 text-cv-text-dim text-[12px] tracking-[0.22em] px-1 py-0.5 cursor-gamer-not-allowed opacity-40"
              disabled
            >
              EN
            </button>
          </div>
          <A11yDropdown />
        </div>
      </div>
    </div>
  );
}
