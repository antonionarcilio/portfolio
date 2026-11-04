'use client';

import { useTranslations } from 'next-intl';

import { ModalBase } from '@/shared/components/modal-base';
import { CornerBrackets } from './corner-brackets';
import { CvButton } from './cv-button';
import { Tooltip } from './tooltip';

/**
 * Shared chrome for the gamified detail modals (project, experience, achievement image):
 * overlay, floating/drawer wiring, border + corner brackets, and the close button.
 * Each modal only supplies its own inner content and a couple of layout tweaks.
 */
export function DetailModalShell({
  show,
  onClose,
  drawerTitle,
  noMotion,
  panelClassName = '',
  drawerPanelClassName = 'flex flex-col overflow-hidden',
  drawerContentClassName = 'z-[300] bg-cv-panel border-t border-cv-border cursor-gamified-default font-cv-mono',
  children,
}: {
  show: boolean;
  onClose: () => void;
  drawerTitle: string;
  noMotion?: boolean;
  /** Extra classes for the desktop floating panel, appended after the shared border/blur/shadow treatment. */
  panelClassName?: string;
  /** Extra classes for the mobile drawer's inner wrapper. */
  drawerPanelClassName?: string;
  drawerContentClassName?: string;
  children: (props: { isDrawer: boolean }) => React.ReactNode;
}) {
  const t = useTranslations('gamified.modals');

  return (
    <ModalBase
      open={show}
      onClose={onClose}
      portalId="gamified-portal-root"
      noMotion={noMotion}
      drawerTitle={drawerTitle}
      overlayClassName="bg-[rgba(3,6,15,0.80)] z-[300] cursor-gamified-pointer"
      drawerContentClassName={drawerContentClassName}
      drawerHandleClassName="bg-cv-cyan/30"
    >
      {({ floatingRef, floatingProps, panelStyles, isDrawer }) => (
        <div
          ref={isDrawer ? undefined : floatingRef}
          style={isDrawer ? undefined : panelStyles}
          className={
            isDrawer
              ? `w-full outline-none ${drawerPanelClassName}`
              : `relative bg-transparent backdrop-blur-[18px] border border-cv-border shadow-[inset_0_0_30px_rgba(43,214,255,0.05),0_8px_24px_rgba(0,0,0,0.5),0_0_18px_rgba(43,214,255,0.18)] outline-none cursor-gamified-default ${panelClassName}`
          }
          {...(isDrawer ? {} : floatingProps)}
        >
          {/* Corner brackets — desktop only */}
          {!isDrawer && <CornerBrackets size="md" />}

          {/* Close button — desktop only; drawer is dismissed by swipe / overlay tap */}
          {!isDrawer && (
            <div className="absolute top-3 right-[14px]">
              <Tooltip key={String(show)} content={t('close')} placement="left" className="!z-[9999]">
                <CvButton
                  className="bg-transparent border border-cv-border text-cv-cyan font-cv-mono text-[16px] w-7 h-7 justify-center leading-none outline-none transition-[border-color,box-shadow] duration-150 hover:border-cv-cyan hover:shadow-[0_0_12px_rgba(43,214,255,0.5)]"
                  onClick={onClose}
                  aria-label={t('close')}
                >
                  ×
                </CvButton>
              </Tooltip>
            </div>
          )}

          {children({ isDrawer })}
        </div>
      )}
    </ModalBase>
  );
}
