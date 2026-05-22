'use client';

import { useEffect, useState } from 'react';

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
    return { label: 'Online', dotClass: 'bg-cv-green shadow-[0_0_8px_#4ed46a] animate-pulse-led' };
  }
  if (inRange(h(12) + 30, h(14)) || inRange(h(17), h(19))) {
    return { label: 'Em Pausa', dotClass: 'bg-cv-orange shadow-[0_0_8px_#ff8a3d] animate-pulse-led-orange' };
  }
  return { label: 'Offline', dotClass: 'bg-cv-red shadow-[0_0_4px_#ff4d4d] animate-pulse-led-red' };
}

export function CvFooter() {
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
