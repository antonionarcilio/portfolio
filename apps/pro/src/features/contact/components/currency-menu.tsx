'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, type KeyboardEvent, type RefObject } from 'react';

import checkIcon from '@/_assets/icons/lucide-check.svg';
import { BottomSheet } from '@/shared/components/bottom-sheet';
import { ScrambleText } from '@/shared/components/scramble-text';
import { useA11y } from '@/shared/contexts/a11y-context';

import { shortcutsMenuVariants } from '../animations';
import type { CurrencyCode } from '../engine/field-validators';
import { ChoiceOption } from './choice-option';
import { commandItemVariants } from './command-item';
import { moveMenuFocus } from './shortcuts-menu';

/** Textos de uma moeda já traduzidos: símbolo ("R$") e nome ("Real brasileiro"). */
export type CurrencyChoice = { code: CurrencyCode; symbol: string; name: string };

type CurrencyListProps = {
  /** "Moeda": nome acessível do menu e título do drawer. */
  title: string;
  choices: readonly CurrencyChoice[];
  selected: CurrencyCode;
  onSelect: (code: CurrencyCode) => void;
};

type CurrencyMenuProps = CurrencyListProps & {
  menuId: string;
  menuRef: RefObject<HTMLDivElement | null>;
  /** `restoreFocus` devolve o foco ao "R$ ▾" (Esc); Tab fecha e deixa o foco seguir. */
  onClose: (restoreFocus: boolean) => void;
};

/** "Item de Comando" do menu de moeda (`pi0KI`): símbolo, nome e ✓ na marcada (fundo `alpha-black-5`). */
function CurrencyMenuItem({
  choice,
  checked,
  onSelect,
}: {
  choice: CurrencyChoice;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      tabIndex={-1}
      onClick={onSelect}
      className={commandItemVariants({ highlighted: checked })}
    >
      <span className="shrink-0 font-portfolio text-sm font-semibold text-alpha-black-100">
        <ScrambleText>{choice.symbol}</ScrambleText>
      </span>
      <span className="min-w-0 flex-1 truncate font-portfolio text-sm font-regular text-alpha-black-60">
        <ScrambleText>{choice.name}</ScrambleText>
      </span>
      {checked && <Image src={checkIcon} alt="" aria-hidden width={16} height={16} className="ml-auto shrink-0" />}
    </button>
  );
}

/** Ao abrir, o foco vai para a moeda marcada (padrão WAI-ARIA de menu). */
function useFocusCheckedItem(menuRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    menuRef.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
  }, [menuRef]);
}

/** ↑/↓/Home/End navegam; Esc fecha devolvendo o foco ao "R$ ▾"; Tab fecha. */
function handleCurrencyMenuKey(event: KeyboardEvent<HTMLDivElement>, onClose: CurrencyMenuProps['onClose']) {
  if (moveMenuFocus(event.currentTarget, event.key)) return event.preventDefault();
  if (event.key === 'Tab') return onClose(false);
  if (event.key !== 'Escape') return;
  event.preventDefault();
  event.stopPropagation();
  onClose(true);
}

// Mesmo painel flutuante do menu de atalhos (G06), alinhado à esquerda acima da caixa, 300px como no design.
const CURRENCY_MENU_CLASS =
  'absolute bottom-full left-0 z-10 mb-sm flex w-[300px] max-w-full flex-col gap-[2px] rounded-[16px] border border-alpha-black-10 bg-alpha-white-100 p-[6px] shadow-lg';

/**
 * "Menu de Moeda" (G02·6 · Moeda aberta, `iQVjV`), a partir de `tablet`: painel acima do campo, uma linha por
 * moeda. O pai precisa ser `relative` e envolver o menu em `AnimatePresence`.
 * @example <AnimatePresence>{isOpen && <CurrencyMenu menuId={id} menuRef={ref} title="Moeda" choices={choices} selected="BRL" onSelect={pick} onClose={close} />}</AnimatePresence>
 */
export function CurrencyMenu({ menuId, menuRef, title, choices, selected, onSelect, onClose }: CurrencyMenuProps) {
  const { features } = useA11y();
  useFocusCheckedItem(menuRef);

  return (
    <motion.div
      ref={menuRef}
      id={menuId}
      role="menu"
      aria-label={title}
      variants={shortcutsMenuVariants}
      initial={features.pauseAnimations ? false : 'hidden'}
      animate="visible"
      exit={features.pauseAnimations ? undefined : 'hidden'}
      onKeyDown={(event) => handleCurrencyMenuKey(event, onClose)}
      className={CURRENCY_MENU_CLASS}
    >
      {choices.map((choice) => (
        <CurrencyMenuItem
          key={choice.code}
          choice={choice}
          checked={choice.code === selected}
          onSelect={() => onSelect(choice.code)}
        />
      ))}
    </motion.div>
  );
}

type CurrencySheetProps = CurrencyListProps & {
  open: boolean;
  description: string;
  onClose: () => void;
};

/**
 * "Drawer de Moeda" (G05 mobile, `rIWjd`), abaixo de `tablet`: bottom sheet com título, texto de apoio e as
 * moedas como opções com radio ("R$ · Real brasileiro"). Escolher fecha; o foco volta ao "R$ ▾" (`BottomSheet`).
 * @example <CurrencySheet open={isOpen} title="Moeda" description="…" choices={choices} selected="BRL" onSelect={pick} onClose={close} />
 */
export function CurrencySheet({ open, title, description, choices, selected, onSelect, onClose }: CurrencySheetProps) {
  return (
    <BottomSheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()} tone="strong">
      {/* `pt-lg`/`pb-[34px]`: 16px entre a alça e o título e a base do drawer do design, como o ResponsiveDialog. */}
      <div className="flex flex-col gap-lg px-2xl pt-lg pb-[34px]">
        <Dialog.Title className="font-portfolio-title text-display-sm font-regular text-alpha-black-100">
          <ScrambleText>{title}</ScrambleText>
        </Dialog.Title>
        <Dialog.Description className="font-portfolio text-chat font-regular text-alpha-black-60">
          <ScrambleText>{description}</ScrambleText>
        </Dialog.Description>
        <div role="radiogroup" aria-label={title} className="flex flex-col gap-md pt-sm">
          {choices.map((choice) => (
            <ChoiceOption
              key={choice.code}
              layout="row"
              label={`${choice.symbol} · ${choice.name}`}
              selected={choice.code === selected}
              onSelect={() => onSelect(choice.code)}
            />
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
