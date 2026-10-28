'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';

import type { A11yFeatures } from './a11y-dropdown';
import { islandButtonsVariants } from './animations';
import { IslandNav } from './island-nav';
import { IslandToolsCard, IslandToolTabs } from './island-tools-panel';
import { useAnimatedWidth } from './use-animated-width';
import { useElementWidth } from './use-element-width';
import type { ToolsTab } from './use-island-panel';
import { useIslandSequence } from './use-island-sequence';

/** Padding horizontal do container (`p-[3px]` de cada lado) somado à largura dos botões. */
const BAR_HORIZONTAL_PADDING_PIXELS = 6;

const FOCUSABLE_IN_LIST = 'button:not(:disabled)';

type IslandSurfaceProps = {
  activeTab: ToolsTab | null;
  features: A11yFeatures;
  onSelectTab: (tab: ToolsTab) => void;
  onToggleFeature: (key: keyof A11yFeatures) => void;
  onClose: () => void;
};

/**
 * Dynamic island. Um único container de botões (`bg-alpha-black-5`) que ora mostra o menu de
 * páginas, ora as abas de ferramentas; a largura acompanha o conteúdo com uma mola. O cartão com
 * a lista só entra (fade) depois que o container termina de se ajustar — ver `useIslandSequence`.
 * Trocar de aba com o cartão aberto só atualiza a lista.
 * @example <IslandSurface activeTab={activeTab} features={features} onSelectTab={open} onToggleFeature={toggle} onClose={close} />
 */
export function IslandSurface({ activeTab, features, onSelectTab, onToggleFeature, onClose }: IslandSurfaceProps) {
  const { isToolsBarShown, isCardShown } = useIslandSequence(activeTab !== null);
  const { setElement, width } = useElementWidth();
  const barWidth = useAnimatedWidth(width === null ? null : width + BAR_HORIZONTAL_PADDING_PIXELS);
  // Durante o fechamento `activeTab` já é null, mas as abas ainda estão na tela: guarda a última.
  const [displayTab, setDisplayTab] = useState<ToolsTab>('visuals');
  if (activeTab && activeTab !== displayTab) setDisplayTab(activeTab);

  const rootRef = useRef<HTMLDivElement>(null);
  const focusList = () => rootRef.current?.querySelector<HTMLElement>(`[role="group"] ${FOCUSABLE_IN_LIST}`)?.focus();

  return (
    <div ref={rootRef} className="relative">
      <motion.div
        style={{ width: barWidth }}
        className="relative z-10 flex h-[39px] items-center overflow-hidden rounded-[8px] bg-alpha-black-5 p-[3px]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isToolsBarShown ? 'tools' : 'menu'}
            ref={setElement}
            variants={islandButtonsVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-max shrink-0"
          >
            {isToolsBarShown ? (
              <IslandToolTabs activeTab={displayTab} onSelect={onSelectTab} onEnterList={focusList} />
            ) : (
              <IslandNav />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      {/* Depois da barra no DOM, para o Tab seguir abas → opções → "Fechar" (o empilhamento visual vem do z-index). */}
      <AnimatePresence>
        {isCardShown && activeTab && (
          <IslandToolsCard
            activeTab={activeTab}
            features={features}
            onToggleFeature={onToggleFeature}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
