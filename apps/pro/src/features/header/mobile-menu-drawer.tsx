'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

import hamburgerIcon from '@/_assets/icons/solar-hamburger-menu.svg';
import { useRouter } from '@/i18n/navigation';
import { Accordion } from '@/shared/components/accordion';
import { BOTTOM_SHEET_BODY_CLASS, BottomSheet } from '@/shared/components/bottom-sheet';
import { useA11y } from '@/shared/contexts/a11y-context';
import { MOBILE_DRAWER_CLOSE_MILLISECONDS } from './animations';
import { AccessibilityList, LanguagesList, VisualsList } from './island-panel-lists';
import { MobileCurrentPageLabel } from './mobile-current-page-label';
import { MobilePageLinks } from './mobile-page-links';

type MobileMenuSection = 'pages' | 'accessibility' | 'visuals' | 'languages';

/** Seção aberta sempre que o drawer abre. */
const DEFAULT_SECTION: MobileMenuSection = 'pages';

/**
 * Menu do header em telas ≤590px: botão hambúrguer que abre o `BottomSheet` compartilhado (vaul) com acordeões
 * exclusivos (só um aberto por vez; "Páginas" abre expandido). Navegar ou trocar de idioma fecha o
 * drawer; abrir de novo volta ao estado padrão.
 * @example <MobileMenuDrawer />
 */
export function MobileMenuDrawer() {
  const t = useTranslations('pro.island');
  const navigationLabels = useTranslations('pro.nav');
  const router = useRouter();
  const { features, toggleFeature } = useA11y();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<MobileMenuSection | null>(DEFAULT_SECTION);

  const handleOpenChange = (nextIsOpen: boolean) => {
    if (nextIsOpen) setExpandedSection(DEFAULT_SECTION);
    setIsOpen(nextIsOpen);
  };
  const close = () => setIsOpen(false);

  // Navegar durante a descida do sheet sobrepõe a troca de rota (scroll, header) à animação de fechar;
  // por isso a navegação espera o drawer terminar de fechar.
  const closeThenNavigate = (href: string) => {
    close();
    window.setTimeout(() => router.push(href), MOBILE_DRAWER_CLOSE_MILLISECONDS);
  };

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
    <>
      <div className="flex min-w-0 items-center gap-md header-full:hidden">
        <MobileCurrentPageLabel />
        <button
          type="button"
          aria-label={t('openMenuLabel')}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={() => handleOpenChange(true)}
          className="transition-interface flex shrink-0 items-center justify-center rounded-full opacity-60 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
        >
          <Image src={hamburgerIcon} alt="" aria-hidden width={26} height={26} />
        </button>
      </div>
      <BottomSheet
        open={isOpen}
        onOpenChange={handleOpenChange}
        hiddenTitle={t('menuPanelLabel')}
        hiddenDescription={t('menuPanelLabel')}
      >
        {/* `[&_[role=radio]]:mx-[7px]` e `[&_[role=switch]]:mx-[2px]`: alinham radios e switches ao
            ícone (seta) dos acordeões só no drawer — as listas são compartilhadas com o painel do
            desktop, que não recebe o recuo. Espaçamento: o padrão dos drawers (`BOTTOM_SHEET_BODY_CLASS`). */}
        <div
          className={`flex min-h-0 flex-col overflow-y-auto ${BOTTOM_SHEET_BODY_CLASS} [&_[role=radio]]:mx-[7px] [&_[role=switch]]:mx-[2px]`}
        >
          {section('pages', t('tabPages'), <MobilePageLinks onNavigate={closeThenNavigate} />)}
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
      </BottomSheet>
    </>
  );
}
