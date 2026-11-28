'use client';
import { MotionConfig } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image, { type StaticImageData } from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import magnifierIcon from '@/_assets/icons/solar-magnifer.svg';
import { AnimatedIcon } from '@/shared/components/animated-icon/animated-icon';
import type { AnimatedIconName } from '@/shared/components/animated-icon/animated-icon-registry';
import type { AnimatedIconTrigger } from '@/shared/components/animated-icon/types';
import { useA11y } from '@/shared/contexts/a11y-context';
import { IslandSurface } from './island-surface';
import { MobileMenuDrawer } from './mobile-menu-drawer';
import { useIslandPanel, type ToolsTab } from './use-island-panel';
import { useRememberedToolsTab } from './use-remembered-tools-tab';

type ToolButtonProps = {
  /** Imagem estática ou o nome de um ícone animado, que toca uma vez ao aparecer (ex.: o de fechar). */
  icon: StaticImageData | AnimatedIconName;
  label: string;
  isExpanded?: boolean;
  isDisabled?: boolean;
  /** O ícone anima ao aparecer, sem hover (ex.: ao voltar no lugar do ícone de fechar). */
  shouldPlayOnAppear?: boolean;
  iconSize?: number;
  onClick?: () => void;
};

/**
 * O ícone de fechar toca uma vez ao aparecer; os demais animam no hover/foco do botão — e ficam parados quando
 * ele está desabilitado, que não tem hover.
 */
function pickIconTrigger(icon: AnimatedIconName, isDisabled: boolean | undefined): AnimatedIconTrigger {
  if (icon === 'close-circle') return 'mount';
  return isDisabled ? 'controlled' : 'parent';
}

/** Botão "menu-trigger" do Figma: ícone de 26px sem fundo, 60% de opacidade até hover/focus. */
function ToolButton({
  icon,
  label,
  isExpanded,
  isDisabled,
  shouldPlayOnAppear,
  iconSize = 26,
  onClick,
}: ToolButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={isExpanded}
      disabled={isDisabled}
      data-animated-icon-host
      onClick={onClick}
      className="transition-interface flex shrink-0 items-center justify-center rounded-full opacity-60 disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:opacity-100 enabled:focus-visible:opacity-100 focus-visible:outline-none"
    >
      {typeof icon === 'string' ? (
        <AnimatedIcon
          // Uma instância por ícone: sem a `key` o React reaproveitaria a mesma na troca de/para o de fechar, e o
          // "tocar ao aparecer" (só na montagem) nunca dispararia.
          key={icon}
          name={icon}
          sizePixels={iconSize}
          trigger={pickIconTrigger(icon, isDisabled)}
          playOnMount={shouldPlayOnAppear}
        />
      ) : (
        <Image src={icon} alt="" aria-hidden width={iconSize} height={iconSize} />
      )}
    </button>
  );
}

/** Busca ainda não implementada: oculta por enquanto. Trocar para `true` para reexibir o botão. */
const IS_SEARCH_VISIBLE = false;

/** Botão que abriu o painel: só ele vira "fechar"; o outro fica desabilitado até o painel fechar. */
type PanelOrigin = 'settings' | 'accessibility';

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
  const { features, toggleFeature } = useA11y();

  // O painel não acompanha o deslize do header: se ele some com o painel aberto, fecha junto.
  useEffect(() => {
    if (isHeaderHidden && activeTab) closePanel();
  }, [isHeaderHidden, activeTab, closePanel]);

  const [panelOrigin, setPanelOrigin] = useState<PanelOrigin>('settings');
  // Os ícones só animam sozinhos ao VOLTAR (depois de o painel ter sido aberto), não no carregamento da página.
  const [hasPanelBeenOpened, setHasPanelBeenOpened] = useState(false);

  const isPanelOpen = activeTab !== null;
  const isSettingsOrigin = isPanelOpen && panelOrigin === 'settings';
  const isAccessibilityOrigin = isPanelOpen && panelOrigin === 'accessibility';

  const openFromSettings = () => {
    setHasPanelBeenOpened(true);
    setPanelOrigin('settings');
    openTab(rememberedTab);
  };
  const openFromAccessibility = () => {
    setHasPanelBeenOpened(true);
    setPanelOrigin('accessibility');
    openTab('accessibility' satisfies ToolsTab);
  };

  return (
    <MotionConfig reducedMotion="user">
      <header className="relative flex w-full items-center justify-between overflow-visible py-[22px]">
        {/* Sem `pointer-events-none`: o `title` nativo da logo só aparece com hover real. */}
        <div className="shrink-0">{brandLogo}</div>

        <div
          ref={islandRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 header-compact:hidden"
        >
          <IslandSurface
            activeTab={activeTab}
            features={features}
            onSelectTab={openTab}
            onToggleFeature={toggleFeature}
            onClose={closePanel}
          />
        </div>

        <MobileMenuDrawer />

        <div className="flex shrink-0 items-center gap-lg header-compact:hidden">
          <ToolButton
            icon={isSettingsOrigin ? 'close-circle' : 'menu-dots-circle'}
            label={islandLabels(isSettingsOrigin ? 'closePanelLabel' : 'settingsLabel')}
            isExpanded={isPanelOpen}
            isDisabled={isAccessibilityOrigin}
            shouldPlayOnAppear={hasPanelBeenOpened}
            onClick={isSettingsOrigin ? closePanel : openFromSettings}
          />
          <ToolButton
            icon={isAccessibilityOrigin ? 'close-circle' : 'accessibility'}
            label={islandLabels(isAccessibilityOrigin ? 'closePanelLabel' : 'accessibilityLabel')}
            isExpanded={isPanelOpen}
            isDisabled={isSettingsOrigin}
            shouldPlayOnAppear={hasPanelBeenOpened}
            onClick={isAccessibilityOrigin ? closePanel : openFromAccessibility}
          />
          {IS_SEARCH_VISIBLE && <ToolButton icon={magnifierIcon} label={t('searchLabel')} iconSize={26} isDisabled />}
        </div>
      </header>
    </MotionConfig>
  );
}
