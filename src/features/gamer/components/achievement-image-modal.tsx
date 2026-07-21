'use client';

import Image from 'next/image';

import { useA11y } from '@/features/gamer/contexts/a11y-context';
import type { PortfolioData } from '@/shared/types/portfolio';

import { DetailModalShell } from './detail-modal-shell';

export function AchievementImageModal({
  data,
  show,
  onClose,
}: {
  data: PortfolioData['achievements'][0] | null;
  show: boolean;
  onClose: () => void;
}) {
  const { opts } = useA11y();
  if (!data) return null;

  return (
    <DetailModalShell
      show={show}
      onClose={onClose}
      noMotion={opts.reduceMotion}
      drawerTitle={data.title}
      panelClassName="p-6"
      drawerPanelClassName="flex items-center justify-center"
      drawerContentClassName="z-[300] bg-cv-panel border-t border-cv-border cursor-gamer-default font-cv-mono flex items-center justify-center py-8"
    >
      {() => <Image src={data.badge} alt={data.title} width={320} height={320} className="object-contain" />}
    </DetailModalShell>
  );
}
