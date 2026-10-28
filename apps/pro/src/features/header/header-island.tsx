'use client';
import { MotionConfig } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image, { type StaticImageData } from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import wcagIcon from '@/_assets/icons/lucide-wcag.svg';
import magnifierIcon from '@/_assets/icons/solar-magnifer.svg';
import widgetIcon from '@/_assets/icons/solar-widget-2.svg';
import type { A11yFeatures } from './a11y-dropdown';
import { IslandSurface } from './island-surface';
import { useIslandPanel, type ToolsTab } from './use-island-panel';
import { useRememberedToolsTab } from './use-remembered-tools-tab';

const INITIAL_A11Y_FEATURES: A11yFeatures = {
  bigCursor: false,
  highlightLinks: false,
  biggerText: false,
  pauseAnimations: false,
};

type ToolButtonProps = {
  icon: StaticImageData;
  label: string;
  isExpanded?: boolean;
  isDisabled?: boolean;
  iconSize?: number;
  onClick?: () => void;
};

/** Botão "menu-trigger" do Figma: ícone de 24px sem fundo, 60% de opacidade até hover/focus. */
function ToolButton({ icon, label, isExpanded, isDisabled, iconSize = 24, onClick }: ToolButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={isExpanded}
      disabled={isDisabled}
      onClick={onClick}
      className="transition-interface flex shrink-0 items-center justify-center rounded-[99px] opacity-60 disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:opacity-100 enabled:focus-visible:opacity-100 focus-visible:outline-none"
    >
      <Image src={icon} alt="" aria-hidden width={iconSize} height={iconSize} />
    </button>
  );
}

type HeaderIslandProps = { isHeaderHidden: boolean; brandLogo: ReactNode };

/**
 * Header v2: logomarca à esquerda, "dynamic island" centralizada e ferramentas à direita.
 * A ilha mostra o menu; o painel de ferramentas abre sobre ele, com a barra de abas no mesmo
 * ponto do menu (`-top-[5px]` = borda 1px + padding 4px do cartão). A engrenagem abre na última aba que ficou ativa
 * (sessionStorage; "Visuais" na primeira vez) e o botão de acessibilidade abre em "Acessibilidade". A pesquisa ainda não tem ação.
 * @example <HeaderIsland isHeaderHidden={false} brandLogo={<BrandLogo />} />
 */
export function HeaderIsland({ isHeaderHidden, brandLogo }: HeaderIslandProps) {
  const t = useTranslations('pro.nav');
  const islandLabels = useTranslations('pro.island');
  const islandRef = useRef<HTMLDivElement>(null);
  const { activeTab, openTab, closePanel } = useIslandPanel(islandRef);
  const rememberedTab = useRememberedToolsTab(activeTab);
  const [features, setFeatures] = useState<A11yFeatures>(INITIAL_A11Y_FEATURES);

  // O painel não acompanha o deslize do header: se ele some com o painel aberto, fecha junto.
  useEffect(() => {
    if (isHeaderHidden && activeTab) closePanel();
  }, [isHeaderHidden, activeTab, closePanel]);

  const toggleFeature = (key: keyof A11yFeatures) =>
    setFeatures((previous) => ({ ...previous, [key]: !previous[key] }));
  const isPanelOpen = activeTab !== null;

  return (
    <MotionConfig reducedMotion="user">
      <header className="relative flex w-full items-center justify-between overflow-visible py-[22px]">
        {/* Sem `pointer-events-none`: o `title` nativo da logo só aparece com hover real. */}
        <div className="shrink-0">{brandLogo}</div>

        <div ref={islandRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <IslandSurface
            activeTab={activeTab}
            features={features}
            onSelectTab={openTab}
            onToggleFeature={toggleFeature}
            onClose={closePanel}
          />
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <ToolButton
            icon={wcagIcon}
            label={islandLabels('accessibilityLabel')}
            isExpanded={isPanelOpen}
            isDisabled={isPanelOpen}
            onClick={() => openTab('accessibility' satisfies ToolsTab)}
          />
          <ToolButton
            icon={widgetIcon}
            label={islandLabels('settingsLabel')}
            isExpanded={isPanelOpen}
            isDisabled={isPanelOpen}
            onClick={() => openTab(rememberedTab)}
          />
          <ToolButton icon={magnifierIcon} label={t('searchLabel')} iconSize={24} isDisabled />
        </div>
      </header>
    </MotionConfig>
  );
}
