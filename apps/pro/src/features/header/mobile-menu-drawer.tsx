'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { Drawer } from 'vaul';

import hamburgerIcon from '@/_assets/icons/solar-hamburger-menu.svg';
import { Accordion } from '@/shared/components/accordion';
import { useA11y } from '@/shared/contexts/a11y-context';
import { MOBILE_DRAWER_CLOSE_MILLISECONDS } from './animations';
import { AccessibilityList, LanguagesList, VisualsList } from './island-panel-lists';
import { MobilePageLinks } from './mobile-page-links';

type MobileMenuSection = 'pages' | 'accessibility' | 'visuals' | 'languages';

/** Seção aberta sempre que o drawer abre. */
const DEFAULT_SECTION: MobileMenuSection = 'pages';

/**
 * Menu do header em telas ≤590px: botão hambúrguer que abre um bottom-sheet (vaul) com acordeões
 * exclusivos (só um aberto por vez; "Páginas" abre expandido). Navegar ou trocar de idioma fecha o
 * drawer; abrir de novo volta ao estado padrão.
 * @example <MobileMenuDrawer />
 */
export function MobileMenuDrawer() {
  const t = useTranslations('pro.island');
  const navigationLabels = useTranslations('pro.nav');
  const { features, toggleFeature } = useA11y();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<MobileMenuSection | null>(DEFAULT_SECTION);

  const handleOpenChange = (nextIsOpen: boolean) => {
    if (nextIsOpen) setExpandedSection(DEFAULT_SECTION);
    setIsOpen(nextIsOpen);
  };
  const close = () => setIsOpen(false);

  function section(key: MobileMenuSection, label: string, content: React.ReactNode) {
    return (
      <Accordion
        label={label}
        expanded={expandedSection === key}
        onToggle={() => setExpandedSection((current) => (current === key ? null : key))}
      >
        {content}
      </Accordion>
    );
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Drawer.Trigger asChild>
        <button
          type="button"
          aria-label={t('openMenuLabel')}
          className="transition-interface flex shrink-0 items-center justify-center rounded-[99px] opacity-60 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none min-[591px]:hidden"
        >
          <Image src={hamburgerIcon} alt="" aria-hidden width={24} height={24} />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-alpha-black-30" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-[24px] bg-alpha-white-100 outline-none">
          <Drawer.Title className="sr-only">{t('menuPanelLabel')}</Drawer.Title>
          <Drawer.Description className="sr-only">{t('menuPanelLabel')}</Drawer.Description>
          <div aria-hidden className="flex shrink-0 justify-center pt-[10px]">
            <div className="h-[3px] w-9 rounded-full bg-alpha-black-30" />
          </div>
          <div className="flex min-h-0 flex-col overflow-y-auto px-[16px] pb-[32px] pt-[12px]">
            {section('pages', t('tabPages'), <MobilePageLinks onNavigate={close} />)}
            {section(
              'accessibility',
              navigationLabels('accessibility'),
              <AccessibilityList features={features} onToggle={toggleFeature} />,
            )}
            {section('visuals', t('tabVisuals'), <VisualsList />)}
            {section(
              'languages',
              t('tabLanguages'),
              <LanguagesList onSwitched={close} switchDelayMilliseconds={MOBILE_DRAWER_CLOSE_MILLISECONDS} />,
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
