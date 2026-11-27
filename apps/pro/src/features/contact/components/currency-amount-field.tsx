'use client';

import { cva } from 'class-variance-authority';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useId, useRef, useState, type ComponentProps, type RefObject } from 'react';

import chevronDownIcon from '@/_assets/icons/lucide-chevron-down.svg';
import chevronUpIcon from '@/_assets/icons/lucide-chevron-up.svg';
import { ScrambleText } from '@/shared/components/scramble-text';
import { TABLET_AND_UP_MEDIA_QUERY, useMediaQuery } from '@/shared/hooks/use-media-query';

import type { CurrencyCode } from '../engine/field-validators';
import type { CurrencyDefinition } from '../engine/flow-types';
import { ChatField } from './chat-field';
import { CurrencyMenu, CurrencySheet, type CurrencyChoice } from './currency-menu';
import { useCloseOnOutsidePointer } from './use-shortcuts-menu';

type CurrencyPicker = {
  menuId: string;
  isOpen: boolean;
  /** Menu acima do campo a partir de `tablet`; drawer abaixo. Decidido no clique (ver `useMediaQuery`). */
  isTabletUp: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  menuRef: RefObject<HTMLDivElement | null>;
  toggle: () => void;
  close: (restoreFocus: boolean) => void;
  select: (code: CurrencyCode) => void;
};

/**
 * Abre/fecha o seletor de moeda. Clique fora fecha o menu; no drawer, a vaul cuida do véu, do Esc e de devolver
 * o foco ao "R$ ▾" — por isso escolher no drawer só fecha, e no menu devolve o foco à mão.
 * @example const picker = useCurrencyPicker(onCurrencyChange); picker.toggle()
 */
function useCurrencyPicker(onSelect: (code: CurrencyCode) => void): CurrencyPicker {
  const menuId = useId();
  const isTabletUp = useMediaQuery(TABLET_AND_UP_MEDIA_QUERY);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [elements] = useState(() => [triggerRef, menuRef] as const);

  const close = useCallback((restoreFocus: boolean) => {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);
  const closeFromOutside = useCallback(() => close(false), [close]);
  useCloseOnOutsidePointer(isOpen && isTabletUp, elements, closeFromOutside);

  const toggle = () => setIsOpen((wasOpen) => !wasOpen);
  const select = (code: CurrencyCode) => {
    onSelect(code);
    close(isTabletUp);
  };
  return { menuId, isOpen, isTabletUp, triggerRef, menuRef, toggle, close, select };
}

/** Seta do "R$ ▾": 60% fechada (o `$ink-muted` do design), 100% aberta e no hover/foco do botão. */
const currencyChevronVariants = cva(
  'transition-interface shrink-0 group-hover/currency:opacity-100 group-focus-visible/currency:opacity-100',
  {
    variants: { open: { true: 'opacity-100', false: 'opacity-60' } },
    defaultVariants: { open: false },
  },
);

type CurrencyTriggerProps = { picker: CurrencyPicker; choice: CurrencyChoice; label: string };

/**
 * "Prefixo Moeda" (`cSZfx`): "R$ ▾" com divisória à direita. O fundo `alpha-black-5` no hover/foco marca o
 * botão dentro da caixa (cujo foco já escurece a borda); `-my-xs` mantém a altura da caixa.
 */
function CurrencyTrigger({ picker, choice, label }: CurrencyTriggerProps) {
  const controlsMenu = picker.isOpen && picker.isTabletUp;
  return (
    <span className="flex shrink-0 items-center self-stretch border-r border-alpha-black-10 pr-xs">
      <button
        ref={picker.triggerRef}
        type="button"
        aria-haspopup={picker.isTabletUp ? 'menu' : 'dialog'}
        aria-expanded={picker.isOpen}
        aria-controls={controlsMenu ? picker.menuId : undefined}
        aria-label={label}
        onClick={picker.toggle}
        className="transition-interface group/currency -my-xs -ml-sm flex items-center gap-[6px] rounded-sm px-sm py-xs font-portfolio text-sm font-semibold text-alpha-black-100 hover:bg-alpha-black-5 focus-visible:bg-alpha-black-5 focus-visible:outline-none"
      >
        <ScrambleText>{choice.symbol}</ScrambleText>
        <Image
          src={picker.isOpen ? chevronUpIcon : chevronDownIcon}
          alt=""
          aria-hidden
          width={14}
          height={14}
          className={currencyChevronVariants({ open: picker.isOpen })}
        />
      </button>
    </span>
  );
}

type CurrencyAmountFieldProps = Omit<ComponentProps<typeof ChatField>, 'prefix'> & {
  currency: CurrencyDefinition;
  selectedCurrency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
};

type CurrencyTexts = { title: string; description: string; choices: CurrencyChoice[]; selected: CurrencyChoice };

/** Textos do seletor vindos de `fields.<id>.currency` (símbolo e nome de cada moeda, título e apoio). */
function currencyTextsOf(
  { step, texts, field }: Pick<CurrencyAmountFieldProps, 'step' | 'texts' | 'field'>,
  currency: CurrencyDefinition,
  selectedCurrency: CurrencyCode,
): CurrencyTexts {
  const choiceOf = (code: CurrencyCode): CurrencyChoice => ({
    code,
    symbol: texts.currencyOption(step, field.id, code, 'symbol'),
    name: texts.currencyOption(step, field.id, code, 'name'),
  });
  return {
    title: texts.currencyPrompt(step, field.id, 'title'),
    description: texts.currencyPrompt(step, field.id, 'description'),
    choices: currency.codes.map(choiceOf),
    selected: choiceOf(selectedCurrency),
  };
}

/**
 * Campo de valor com moeda (G02·6 "Faixa de investimento"): a caixa de texto do chat com o prefixo "R$ ▾", que
 * abre o "Menu de Moeda" a partir de `tablet` e o "Drawer de Moeda" abaixo. A moeda é só das `codes` do campo.
 * @example <CurrencyAmountField {...chatFieldProps} currency={field.currency} selectedCurrency="BRL" onCurrencyChange={setCurrency} />
 */
export function CurrencyAmountField({
  currency,
  selectedCurrency,
  onCurrencyChange,
  ...chatField
}: CurrencyAmountFieldProps) {
  const picker = useCurrencyPicker(onCurrencyChange);
  const { title, description, choices, selected } = currencyTextsOf(chatField, currency, selectedCurrency);
  const list = { title, choices, selected: selected.code, onSelect: picker.select };
  const triggerLabel = `${title}: ${selected.symbol} · ${selected.name}`;

  return (
    <div className="relative w-full">
      <AnimatePresence>
        {picker.isOpen && picker.isTabletUp && (
          <CurrencyMenu {...list} menuId={picker.menuId} menuRef={picker.menuRef} onClose={picker.close} />
        )}
      </AnimatePresence>
      <ChatField
        {...chatField}
        amountCurrency={selectedCurrency}
        prefix={<CurrencyTrigger picker={picker} choice={selected} label={triggerLabel} />}
      />
      <CurrencySheet
        {...list}
        open={picker.isOpen && !picker.isTabletUp}
        description={description}
        onClose={() => picker.close(false)}
      />
    </div>
  );
}
