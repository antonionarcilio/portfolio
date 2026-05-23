'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Toggle para status de trabalho: true = aberto a oportunidades
const OPEN_TO_WORK = true;

const WORK_STATUS = OPEN_TO_WORK
  ? { label: 'Procurando uma guilda', textClass: 'text-cv-yellow' }
  : { label: 'Em guilda', textClass: 'text-cv-text-dim' };

type PresenceConfig = {
  label: string;
  baseClass: string;
  pulseOpacity: number[];
  pulseBoxShadow: string[];
  pulseDuration: number;
};

function getPresenceConfig(totalMinutes: number): PresenceConfig {
  const inRange = (start: number, end: number) => totalMinutes >= start && totalMinutes < end;
  const h = (hour: number) => hour * 60;

  if (inRange(h(8), h(12) + 30) || inRange(h(14), h(17)) || inRange(h(19), h(22))) {
    return {
      label: 'Online',
      baseClass: 'bg-cv-green',
      pulseOpacity: [1, 0.45, 1],
      pulseBoxShadow: ['0 0 8px #4ed46a', '0 0 14px #4ed46a', '0 0 8px #4ed46a'],
      pulseDuration: 1.4,
    };
  }
  if (inRange(h(12) + 30, h(14)) || inRange(h(17), h(19))) {
    return {
      label: 'Em Pausa',
      baseClass: 'bg-cv-orange',
      pulseOpacity: [1, 0.45, 1],
      pulseBoxShadow: ['0 0 8px #ff8a3d', '0 0 14px #ff8a3d', '0 0 8px #ff8a3d'],
      pulseDuration: 1.4,
    };
  }
  return {
    label: 'Offline',
    baseClass: 'bg-cv-red',
    pulseOpacity: [0.4, 0.7, 0.4],
    pulseBoxShadow: ['0 0 4px #ff4d4d', '0 0 10px #ff4d4d', '0 0 4px #ff4d4d'],
    pulseDuration: 2,
  };
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
  const presence = getPresenceConfig(totalMinutes);

  return (
    <footer className="mt-12 border-t border-cv-border pt-[14px] pb-[14px] px-2 flex justify-between items-center text-[11px] tracking-[0.22em] uppercase text-cv-text-dim flex-wrap gap-3">
      <div className="flex items-center gap-[10px]">
        <motion.span
          key={presence.label}
          className={`w-2 h-2 rounded-full ${presence.baseClass}`}
          animate={{ opacity: presence.pulseOpacity, boxShadow: presence.pulseBoxShadow }}
          transition={{ duration: presence.pulseDuration, repeat: Infinity, ease: 'easeInOut' }}
        />
        {presence.label}
      </div>
      <div className="text-cv-text-muted">
        <motion.a
          href="https://github.com/antonionarcilio"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ color: '#2bd6ff' }}
          transition={{ duration: 0.2 }}
        >
          created by @antonionarcilio
        </motion.a>{' '}
        · Currículo v1.0.0 · {year} · {hh}:{mm}:{ss}
      </div>
      <div className="flex items-center gap-[10px]">
        Status:{' '}
        {OPEN_TO_WORK ? (
          <motion.span
            className={WORK_STATUS.textClass}
            animate={{
              opacity: [1, 0.1, 1, 0.1, 1, 0.1, 1],
              textShadow: [
                '0 0 10px rgba(227,211,74,0.3)',
                '0 0 0px rgba(0,0,0,0)',
                '0 0 28px #e3d34a, 0 0 56px rgba(227,211,74,0.5)',
                '0 0 0px rgba(0,0,0,0)',
                '0 0 28px #e3d34a, 0 0 56px rgba(227,211,74,0.5)',
                '0 0 0px rgba(0,0,0,0)',
                '0 0 10px rgba(227,211,74,0.3)',
              ],
            }}
            transition={{
              duration: 1,
              ease: 'easeInOut',
              times: [0, 0.15, 0.3, 0.5, 0.65, 0.8, 1.0],
              repeat: Infinity,
              repeatDelay: 4,
            }}
          >
            {WORK_STATUS.label}
          </motion.span>
        ) : (
          <span className={WORK_STATUS.textClass}>{WORK_STATUS.label}</span>
        )}
      </div>
    </footer>
  );
}
