'use client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, type KeyboardEvent } from 'react';

import arrowLeftIcon from '@/_assets/icons/lucide-arrow-left.svg';

import { ScrambleText } from '@/shared/components/scramble-text';
import { useA11y } from '@/shared/contexts/a11y-context';
import { buttonWhiteVariants } from '@/shared/variants/button-white-variants';
import type { A11yFeatures } from './a11y-dropdown';
import { islandCardVariants } from './animations';
import { moveFocusWithinContainer } from './focus-navigation';
import { AccessibilityList, LanguagesList, VisualsList } from './island-panel-lists';
import { SlidingPill } from './sliding-pill';
import type { ToolsTab } from './use-island-panel';
import { usePillGeometry } from './use-pill-geometry';

const HINT_ICON_PIXELS = 12;

/** Botões de texto do rodapé do painel: mesmo efeito de opacidade dos botões de ícone do header. */
const FOOTER_BUTTON_CLASS =
  'transition-interface opacity-60 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none';

const TAB_ORDER: ToolsTab[] = ['visuals', 'accessibility', 'languages'];

function useTabLabels(): Record<ToolsTab, string> {
  const t = useTranslations('pro.island');
  const navigationLabels = useTranslations('pro.nav');
  return { visuals: t('tabVisuals'), accessibility: navigationLabels('accessibility'), languages: t('tabLanguages') };
}

type IslandToolTabsProps = {
  activeTab: ToolsTab;
  onSelect: (tab: ToolsTab) => void;
  /** Seta para baixo nas abas: leva o foco à lista de opções. */
  onEnterList: () => void;
};

/**
 * Botões do container da ilha quando as ferramentas estão abertas (substituem os do menu de
 * páginas), com a mesma pílula deslizante. O container é de `IslandSurface`.
 * @example <IslandToolTabs activeTab="visuals" onSelect={openTab} onEnterList={focusList} />
 */
export function IslandToolTabs({ activeTab, onSelect, onEnterList }: IslandToolTabsProps) {
  const labels = useTabLabels();
  const activeIndex = TAB_ORDER.indexOf(activeTab);
  const { itemRefs, pill } = usePillGeometry(activeIndex);

  // Ao abrir, o foco vai para a aba ativa: quem abriu pelo teclado continua dentro do painel.
  useEffect(() => {
    itemRefs.current[activeIndex]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só na montagem; trocar de aba não deve roubar o foco
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown') return void moveFocusWithinContainer(event, 'horizontal');
    event.preventDefault();
    onEnterList();
  };

  return (
    <div className="relative flex items-center gap-[2px]" onKeyDown={handleKeyDown}>
      {pill && <SlidingPill geometry={pill} />}
      {TAB_ORDER.map((tab, index) => (
        <button
          key={tab}
          ref={(element) => {
            itemRefs.current[index] = element;
          }}
          type="button"
          aria-pressed={tab === activeTab}
          onClick={() => onSelect(tab)}
          className={buttonWhiteVariants({ state: tab === activeTab ? 'slidingCurrent' : 'sliding', size: 'lg' })}
        >
          <ScrambleText>{labels[tab]}</ScrambleText>
        </button>
      ))}
    </div>
  );
}

/**
 * Dica de teclado ao lado do "Fechar": rótulo seguido das setas para cima e para baixo. Não há
 * `arrow-up`/`arrow-down` no projeto; como no acordeão, giramos o `arrow-left` (90° = cima, -90° = baixo).
 */
function NavigationHint({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1 opacity-60">
      <ScrambleText>{label}</ScrambleText>
      <Image
        src={arrowLeftIcon}
        alt=""
        aria-hidden
        width={HINT_ICON_PIXELS}
        height={HINT_ICON_PIXELS}
        className="rotate-90"
      />
      <Image
        src={arrowLeftIcon}
        alt=""
        aria-hidden
        width={HINT_ICON_PIXELS}
        height={HINT_ICON_PIXELS}
        className="-rotate-90"
      />
    </span>
  );
}

type PanelBodyProps = {
  activeTab: ToolsTab;
  features: A11yFeatures;
  onToggleFeature: (key: keyof A11yFeatures) => void;
  onClose: () => void;
};

function PanelBody({ activeTab, features, onToggleFeature, onClose }: PanelBodyProps) {
  if (activeTab === 'visuals') return <VisualsList />;
  if (activeTab === 'accessibility') return <AccessibilityList features={features} onToggle={onToggleFeature} />;
  return <LanguagesList onSwitched={onClose} />;
}

/**
 * Cartão que envolve o container de botões e leva a lista de opções do item ativo, com o
 * "Fechar" pendurado logo abaixo. Setas para cima/baixo (e Home/End) circulam entre as opções e o "Fechar". Fica atrás do container (que é `z-10`), `-5px` além dele:
 * 1px de borda + 4px de padding. O espaçador de 39px reserva o lugar do container.
 * @example <IslandToolsCard activeTab="visuals" features={features} onToggleFeature={toggle} onClose={close} />
 */
export function IslandToolsCard({ activeTab, features, onToggleFeature, onClose }: PanelBodyProps) {
  const t = useTranslations('pro.island');
  const { resetFeatures } = useA11y();

  return (
    <motion.div
      role="group"
      aria-label={t('panelLabel')}
      variants={islandCardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onKeyDown={(event) => moveFocusWithinContainer(event, 'vertical')}
      className="absolute inset-x-[-5px] top-[-5px] z-0 flex flex-col"
    >
      <div className="header-surface rounded-[12px] border border-alpha-black-10 p-[4px]">
        <div className="h-[39px]" />
        <div className="flex flex-col p-[12px]">
          <PanelBody activeTab={activeTab} features={features} onToggleFeature={onToggleFeature} onClose={onClose} />
        </div>
      </div>
      <div className="w-full px-[12px]">
        <div className="header-surface rounded-b-[12px]">
          <div className="flex w-full items-center justify-between rounded-b-[12px] bg-alpha-black-5 px-[12px] py-[8px] text-xs font-regular font-portfolio text-alpha-black-100">
            <div className="flex items-center gap-4">
              <button type="button" onClick={onClose} className={FOOTER_BUTTON_CLASS}>
                <ScrambleText>{t('close')}</ScrambleText>
              </button>
              {activeTab === 'accessibility' && (
                <button type="button" onClick={resetFeatures} className={FOOTER_BUTTON_CLASS}>
                  <ScrambleText>{t('resetAccessibility')}</ScrambleText>
                </button>
              )}
            </div>
            <NavigationHint label={t('navigationHint')} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
