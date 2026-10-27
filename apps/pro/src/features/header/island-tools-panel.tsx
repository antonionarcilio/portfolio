'use client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { ScrambleText } from '@/shared/components/scramble-text';
import { buttonWhiteVariants } from '@/shared/variants/button-white-variants';
import type { A11yFeatures } from './a11y-dropdown';
import { islandCardVariants } from './animations';
import { AccessibilityList, LanguagesList, VisualsList } from './island-panel-lists';
import { SlidingPill } from './sliding-pill';
import type { ToolsTab } from './use-island-panel';
import { usePillGeometry } from './use-pill-geometry';

const TAB_ORDER: ToolsTab[] = ['visuals', 'accessibility', 'languages'];

function useTabLabels(): Record<ToolsTab, string> {
  const t = useTranslations('pro.island');
  const navigationLabels = useTranslations('pro.nav');
  return { visuals: t('tabVisuals'), accessibility: navigationLabels('accessibility'), languages: t('tabLanguages') };
}

type IslandToolTabsProps = { activeTab: ToolsTab; onSelect: (tab: ToolsTab) => void };

/**
 * Botões do container da ilha quando as ferramentas estão abertas (substituem os do menu de
 * páginas), com a mesma pílula deslizante. O container é de `IslandSurface`.
 * @example <IslandToolTabs activeTab="visuals" onSelect={openTab} />
 */
export function IslandToolTabs({ activeTab, onSelect }: IslandToolTabsProps) {
  const labels = useTabLabels();
  const activeIndex = TAB_ORDER.indexOf(activeTab);
  const { itemRefs, pill } = usePillGeometry(activeIndex);

  // Ao abrir, o foco vai para a aba ativa: quem abriu pelo teclado continua dentro do painel.
  useEffect(() => {
    itemRefs.current[activeIndex]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só na montagem; trocar de aba não deve roubar o foco
  }, []);

  return (
    <div className="relative flex items-center gap-[2px]">
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
          className={buttonWhiteVariants({ state: 'sliding', size: 'lg' })}
        >
          <ScrambleText>{labels[tab]}</ScrambleText>
        </button>
      ))}
    </div>
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
 * "Fechar" pendurado logo abaixo. Fica atrás do container (que é `z-10`), `-5px` além dele:
 * 1px de borda + 4px de padding. O espaçador de 39px reserva o lugar do container.
 * @example <IslandToolsCard activeTab="visuals" features={features} onToggleFeature={toggle} onClose={close} />
 */
export function IslandToolsCard({ activeTab, features, onToggleFeature, onClose }: PanelBodyProps) {
  const t = useTranslations('pro.island');

  return (
    <motion.div
      role="group"
      aria-label={t('panelLabel')}
      variants={islandCardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
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
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-b-[12px] bg-alpha-black-5 px-[12px] py-[8px] text-xs font-regular font-portfolio text-alpha-black-100 hover:bg-alpha-black-10 focus-visible:bg-alpha-black-10 focus-visible:outline-none"
          >
            <ScrambleText>{t('close')}</ScrambleText>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
