'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { ShimmerStatus } from '@/features/gamer/components/shimmer-text';
import { Tooltip } from '@/features/gamer/components/tooltip';
import { useA11y } from '@/features/gamer/contexts/a11y-context';

function getWorkStatus(openToWork: boolean) {
  return openToWork
    ? { label: 'Procurando uma guilda', textClass: 'text-cv-yellow' }
    : { label: 'Em guilda', textClass: 'text-cv-text-dim' };
}

type PresenceConfig = {
  label: string;
  baseClass: string;
  pulseOpacity: number[];
  pulseBoxShadow: string[];
  pulseDuration: number;
};

const OFFLINE_CONFIG: PresenceConfig = {
  label: 'Offline',
  baseClass: 'bg-cv-red',
  pulseOpacity: [0.4, 0.7, 0.4],
  pulseBoxShadow: ['0 0 4px #ff4d4d', '0 0 10px #ff4d4d', '0 0 4px #ff4d4d'],
  pulseDuration: 2,
};

const ONLINE_CONFIG: PresenceConfig = {
  label: 'Online',
  baseClass: 'bg-cv-green',
  pulseOpacity: [1, 0.45, 1],
  pulseBoxShadow: ['0 0 8px #4ed46a', '0 0 14px #4ed46a', '0 0 8px #4ed46a'],
  pulseDuration: 1.4,
};

// dayOfWeek: 0 = domingo, 1–5 = seg–sex, 6 = sábado
function getPresenceConfig(totalMinutes: number, dayOfWeek: number): PresenceConfig {
  const inRange = (start: number, end: number) => totalMinutes >= start && totalMinutes < end;
  const h = (hour: number) => hour * 60;

  if (dayOfWeek === 0) return OFFLINE_CONFIG;

  if (dayOfWeek === 6) {
    return inRange(h(8) + 30, h(13)) ? ONLINE_CONFIG : OFFLINE_CONFIG;
  }

  // Segunda a sexta: regras padrão
  if (inRange(h(8), h(12) + 30) || inRange(h(14), h(17)) || inRange(h(19), h(22))) {
    return ONLINE_CONFIG;
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
  return OFFLINE_CONFIG;
}

export function CvFooter({ openToWork }: { openToWork: boolean }) {
  const [time, setTime] = useState<Date | null>(null);
  const { opts } = useA11y();
  const noMotion = opts.reduceMotion;

  useEffect(() => {
    setTime(new Date());
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const totalMinutes = time ? time.getHours() * 60 + time.getMinutes() : -1;
  const dayOfWeek = time ? time.getDay() : -1;
  const presence = getPresenceConfig(totalMinutes, dayOfWeek);
  const workStatus = getWorkStatus(openToWork);

  return (
    <footer className="mt-12 border-t border-cv-border pt-[14px] pb-[14px] px-2 flex justify-between items-center text-[11px] tracking-[0.22em] uppercase text-cv-text-dim flex-wrap gap-3 max-[880px]:flex-col max-[880px]:items-center">
      <div className="flex flex-1 items-center gap-[10px] max-[880px]:flex-none cursor-gamer-default [&_span]:cursor-gamer-default">
        {noMotion ? (
          <span className={`w-2 h-2 rounded-full ${presence.baseClass}`} />
        ) : (
          <motion.span
            key={presence.label}
            className={`w-2 h-2 rounded-full ${presence.baseClass}`}
            animate={{ opacity: presence.pulseOpacity, boxShadow: presence.pulseBoxShadow }}
            transition={{ duration: presence.pulseDuration, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {presence.label}
      </div>
      <div className="text-cv-text-muted">
        <Tooltip
          content={
            <span className="flex flex-col gap-[3px]">
              <span>Ver perfil no GitHub</span>
              <span className="opacity-70 normal-case tracking-normal lowercase">github.com/antonionarcilio</span>
            </span>
          }
        >
          <motion.a
            href="https://github.com/antonionarcilio"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={noMotion ? undefined : { color: '#2bd6ff' }}
            transition={{ duration: 0.2 }}
          >
            created by @antoniomascarenhas
          </motion.a>
        </Tooltip>
      </div>
      <div className="flex flex-1 items-center justify-end gap-[10px] max-[880px]:flex-none max-[880px]:justify-center cursor-gamer-default [&_span]:cursor-gamer-default">
        Guilda:{' '}
        {openToWork ? (
          <ShimmerStatus text={workStatus.label} />
        ) : (
          <span className={workStatus.textClass}>{workStatus.label}</span>
        )}
      </div>
    </footer>
  );
}
