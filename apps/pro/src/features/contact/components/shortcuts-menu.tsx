'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';

import { AnimatedIcon } from '@/shared/components/animated-icon/animated-icon';
import { ScrambleText } from '@/shared/components/scramble-text';
import { useA11y } from '@/shared/contexts/a11y-context';

import { shortcutsMenuVariants } from '../animations';
import { CommandItem } from './command-item';
import { CAPTION_TEXT_CLASS } from './composer-card';
import { availableProfiles, type ProfileLinks } from './social-links';
import type { ShortcutsMenuControls } from './use-shortcuts-menu';

/** `root`: Reiniciar / Alterar meu nome / Onde me encontrar. `links`: submenu com os perfis do CMS. */
type ShortcutsMenuView = 'root' | 'links';

type ShortcutsMenuProps = {
  menu: ShortcutsMenuControls;
  links: ProfileLinks;
  onRestart: () => void;
  /** "Alterar meu nome" (G08): o pai fecha o menu e abre o campo do nome na etapa atual. */
  onChangeName: () => void;
};

/** Índice do item "Onde me encontrar" no menu raiz e do primeiro perfil no submenu (o 0 é o "voltar"). */
const FIND_ME_ITEM_INDEX = 2;
const FIRST_PROFILE_ITEM_INDEX = 1;

/** `menuitemradio`: o menu de moeda (`currency-menu.tsx`) reaproveita a navegação por setas. */
const MENU_ITEM_SELECTOR = '[role="menuitem"], [role="menuitemradio"]';

function menuItemsOf(panel: HTMLElement | null): HTMLElement[] {
  return panel ? Array.from(panel.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)) : [];
}

/**
 * Move o foco entre os itens: ↑/↓ circulares, Home/End nas pontas. Devolve `false` se a tecla não navega.
 * @example moveMenuFocus(panelRef.current, 'ArrowDown')
 */
export function moveMenuFocus(panel: HTMLElement | null, key: string): boolean {
  const items = menuItemsOf(panel);
  const current = items.indexOf(document.activeElement as HTMLElement);
  const from = current < 0 && key === 'ArrowUp' ? 0 : current;
  const targets: Record<string, number> = {
    ArrowDown: (from + 1) % items.length,
    ArrowUp: (from - 1 + items.length) % items.length,
    Home: 0,
    End: items.length - 1,
  };
  const target = targets[key];
  if (items.length === 0 || target === undefined) return false;
  items[target]?.focus();
  return true;
}

/** Foca o item pedido sempre que o painel monta ou troca de lista (menu ↔ submenu). */
function useFocusOnView(
  panelRef: RefObject<HTMLDivElement | null>,
  view: ShortcutsMenuView,
  focusIndexRef: RefObject<number>,
) {
  useEffect(() => {
    menuItemsOf(panelRef.current)[focusIndexRef.current]?.focus();
  }, [panelRef, view, focusIndexRef]);
}

const BACK_ITEM_CLASS =
  'transition-interface flex w-full items-center gap-sm rounded-lg px-md pt-sm pb-[6px] text-left hover:bg-alpha-black-5 focus-visible:bg-alpha-black-5 focus-visible:outline-none';

/** Cabeçalho do submenu ("‹ ONDE ME ENCONTRAR"): volta à lista principal. */
function BackToMenuItem({ title, label, onSelect }: { title: string; label: string; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      aria-label={label}
      data-animated-icon-host
      onClick={onSelect}
      className={BACK_ITEM_CLASS}
    >
      <AnimatedIcon name="chevron-left" sizePixels={16} trigger="parent" className="opacity-60" />
      <span className={CAPTION_TEXT_CLASS}>
        <ScrambleText>{title}</ScrambleText>
      </span>
    </button>
  );
}

type ViewProps = {
  showView: (view: ShortcutsMenuView, focusIndex: number) => void;
  links: ProfileLinks;
  onRestart: () => void;
  onChangeName: () => void;
  onFollowLink: () => void;
};

function RootItems({ showView, onRestart, onChangeName }: ViewProps) {
  const t = useTranslations('pro.contactChat.shortcuts');
  return (
    <>
      <CommandItem icon="undo" title={t('restart.title')} description={t('restart.description')} onSelect={onRestart} />
      <CommandItem
        icon="user-pen"
        title={t('changeName.title')}
        description={t('changeName.description')}
        onSelect={onChangeName}
      />
      <CommandItem
        icon="globe"
        title={t('findMe.title')}
        description={t('findMe.description')}
        trailing="submenu"
        onSelect={() => showView('links', FIRST_PROFILE_ITEM_INDEX)}
      />
    </>
  );
}

/** Só os perfis com URL no CMS (hoje LinkedIn e GitHub; o Instagram do design fica de fora). */
function LinkItems({ showView, links, onFollowLink }: ViewProps) {
  const t = useTranslations('pro.contactChat.shortcuts');
  const title = t('findMe.title');
  return (
    <>
      <BackToMenuItem
        title={title}
        label={t('backToMenu', { menu: title })}
        onSelect={() => showView('root', FIND_ME_ITEM_INDEX)}
      />
      {availableProfiles(links).map((profile) => (
        <CommandItem
          key={profile.id}
          icon="link"
          title={t(`${profile.id}.title`)}
          description={t(`${profile.id}.description`)}
          trailing="external"
          href={profile.url}
          onSelect={onFollowLink}
        />
      ))}
    </>
  );
}

type MenuKeyActions = { panel: HTMLElement | null; isSubmenu: boolean; backToRoot: () => void; close: () => void };

/**
 * Teclado do menu (padrão WAI-ARIA de menu): ↑/↓/Home/End navegam, Esc volta do submenu ou fecha, Tab fecha,
 * Espaço ativa também os links (no `<a>` o navegador só ativa com Enter).
 */
function handleMenuKey(event: KeyboardEvent<HTMLDivElement>, actions: MenuKeyActions) {
  if (moveMenuFocus(actions.panel, event.key)) return event.preventDefault();
  if (event.key === 'Tab') return actions.close();
  if (event.key === ' ' && document.activeElement instanceof HTMLAnchorElement) {
    event.preventDefault();
    return document.activeElement.click();
  }
  if (event.key !== 'Escape') return;
  event.preventDefault();
  event.stopPropagation();
  if (actions.isSubmenu) actions.backToRoot();
  else actions.close();
}

const PANEL_CLASS =
  'absolute inset-x-0 bottom-full z-10 mb-sm flex flex-col gap-[2px] rounded-[16px] border border-alpha-black-10 bg-alpha-white-100 p-[5px] shadow-lg';

/**
 * "Atalhos (/)" (G06): painel flutuante logo acima do compositor, sobre o fim do histórico. Lista principal
 * (Reiniciar conversa, Alterar meu nome, Onde me encontrar) e submenu de perfis, que troca a lista no mesmo
 * painel. O pai precisa ser `relative` e envolver o painel em `AnimatePresence`.
 * @example <AnimatePresence>{menu.isOpen && <ShortcutsMenu menu={menu} links={links} onRestart={restart} onChangeName={openNameChange} />}</AnimatePresence>
 */
export function ShortcutsMenu({ menu, links, onRestart, onChangeName }: ShortcutsMenuProps) {
  const t = useTranslations('pro.contactChat');
  const { features } = useA11y();
  const [view, setView] = useState<ShortcutsMenuView>('root');
  const focusIndexRef = useRef(0);
  useFocusOnView(menu.panelRef, view, focusIndexRef);

  const showView = (next: ShortcutsMenuView, focusIndex: number) => {
    focusIndexRef.current = focusIndex;
    setView(next);
  };
  const close = () => menu.close(true);
  const viewProps: ViewProps = { showView, links, onRestart, onChangeName, onFollowLink: close };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) =>
    handleMenuKey(event, {
      panel: menu.panelRef.current,
      isSubmenu: view === 'links',
      backToRoot: () => showView('root', FIND_ME_ITEM_INDEX),
      close,
    });

  return (
    <motion.div
      ref={menu.panelRef}
      id={menu.menuId}
      role="menu"
      aria-label={view === 'links' ? t('shortcuts.findMe.title') : t('composer.shortcuts')}
      variants={shortcutsMenuVariants}
      initial={features.pauseAnimations ? false : 'hidden'}
      animate="visible"
      exit={features.pauseAnimations ? undefined : 'hidden'}
      onKeyDown={handleKeyDown}
      className={PANEL_CLASS}
    >
      {view === 'root' ? <RootItems {...viewProps} /> : <LinkItems {...viewProps} />}
    </motion.div>
  );
}
