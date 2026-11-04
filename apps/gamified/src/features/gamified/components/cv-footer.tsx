'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { ShimmerStatus } from '@/features/gamified/components/shimmer-text';
import { Tooltip } from '@/features/gamified/components/tooltip';
import { useA11y } from '@/features/gamified/contexts/a11y-context';

function getWorkStatus(openToWork: boolean) {
  return openToWork
    ? { labelKey: 'openToWork' as const, textClass: 'text-cv-yellow' }
    : { labelKey: 'inGuild' as const, textClass: 'text-cv-text-dim' };
}

type PresenceConfig = {
  labelKey: 'offline' | 'online' | 'onBreak';
  baseClass: string;
  pulseOpacity: number[];
  pulseBoxShadow: string[];
  pulseDuration: number;
};

const OFFLINE_CONFIG: PresenceConfig = {
  labelKey: 'offline',
  baseClass: 'bg-cv-red',
  pulseOpacity: [0.4, 0.7, 0.4],
  pulseBoxShadow: ['0 0 4px #ff4d4d', '0 0 10px #ff4d4d', '0 0 4px #ff4d4d'],
  pulseDuration: 2,
};

const ONLINE_CONFIG: PresenceConfig = {
  labelKey: 'online',
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
      labelKey: 'onBreak',
      baseClass: 'bg-cv-orange',
      pulseOpacity: [1, 0.45, 1],
      pulseBoxShadow: ['0 0 8px #ff8a3d', '0 0 14px #ff8a3d', '0 0 8px #ff8a3d'],
      pulseDuration: 1.4,
    };
  }
  return OFFLINE_CONFIG;
}

export function CvFooter({ openToWork }: { openToWork: boolean }) {
  const t = useTranslations('gamified.cvFooter');
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
    <footer className="cv-footer mt-12 border-t border-cv-border pt-[14px] pb-[14px] px-2 flex justify-between items-center text-[11px] tracking-[0.22em] uppercase text-cv-text-dim flex-wrap gap-3">
      <div className="cv-footer__presence flex flex-1 items-center gap-[10px] cursor-gamified-default [&_span]:cursor-gamified-default">
        {noMotion ? (
          <span className={`w-2 h-2 rounded-full ${presence.baseClass}`} />
        ) : (
          <motion.span
            key={presence.labelKey}
            className={`w-2 h-2 rounded-full ${presence.baseClass}`}
            animate={{ opacity: presence.pulseOpacity, boxShadow: presence.pulseBoxShadow }}
            transition={{ duration: presence.pulseDuration, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {t(presence.labelKey)}
      </div>
      <div className="text-cv-text-muted normal-case">
        <Tooltip
          content={
            <span className="flex flex-col gap-[3px]">
              <span>{t('visitSite')}</span>
              <span className="opacity-70 normal-case tracking-normal lowercase">antoniomascarenhas.com.br</span>
            </span>
          }
        >
          <motion.a
            href="https://antoniomascarenhas.com.br"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={noMotion ? undefined : { color: '#2bd6ff' }}
            transition={{ duration: 0.2 }}
          >
            {t('madeBy')}
          </motion.a>
        </Tooltip>
      </div>
      <div className="cv-footer__status flex flex-1 items-center justify-end gap-[10px] cursor-gamified-default [&_span]:cursor-gamified-default">
        {t('guildLabel')}{' '}
        {openToWork ? (
          <ShimmerStatus text={t(workStatus.labelKey)} />
        ) : (
          <span className={workStatus.textClass}>{t(workStatus.labelKey)}</span>
        )}
      </div>
    </footer>
  );
}
