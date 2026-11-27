import { cva } from 'class-variance-authority';
import Image, { type StaticImageData } from 'next/image';
import type { RefObject } from 'react';

import arrowLeftIcon from '@/_assets/icons/lucide-arrow-left.svg';
import arrowUpWhiteIcon from '@/_assets/icons/lucide-arrow-up-white.svg';
import circleXIcon from '@/_assets/icons/lucide-circle-x.svg';
import { ScrambleText } from '@/shared/components/scramble-text';

const TEXT_ACTION_CLASS =
  'transition-interface flex items-center gap-[6px] rounded-sm px-xs py-sm font-portfolio text-sm font-regular text-alpha-black-100 hover:text-alpha-black-60 focus-visible:text-alpha-black-60 focus-visible:outline-none';

type IconTextActionProps = { icon: StaticImageData; label: string; onClick: () => void };

/**
 * O ícone é um SVG estático (`<img>`), que não herda a cor do texto: no hover/foco ele vai a 60% de opacidade, o
 * mesmo tom do texto em `alpha-black-60`, para ícone e rótulo mudarem juntos.
 */
const TEXT_ACTION_ICON_CLASS =
  'transition-interface shrink-0 group-hover/text-action:opacity-60 group-focus-visible/text-action:opacity-60';

/** Ação de texto com ícone de 16px à esquerda, sem caixa (base de Voltar e Cancelar). */
function IconTextAction({ icon, label, onClick }: IconTextActionProps) {
  return (
    <button type="button" onClick={onClick} className={`group/text-action ${TEXT_ACTION_CLASS}`}>
      <Image src={icon} alt="" aria-hidden width={16} height={16} className={TEXT_ACTION_ICON_CLASS} />
      <ScrambleText>{label}</ScrambleText>
    </button>
  );
}

/** "Botão Voltar": seta + texto, sem caixa. @example <BackAction label={t('back')} onBack={goBack} /> */
export function BackAction({ label, onBack }: { label: string; onBack: () => void }) {
  return <IconTextAction icon={arrowLeftIcon} label={label} onClick={onBack} />;
}

/**
 * "Cancelar" (G08 · Editar nome `NoOPs`): o "Botão Voltar" com o círculo com X no lugar da seta.
 * @example <CancelAction label={t('cancel')} onCancel={cancelNameChange} />
 */
export function CancelAction({ label, onCancel }: { label: string; onCancel: () => void }) {
  return <IconTextAction icon={circleXIcon} label={label} onClick={onCancel} />;
}

type SkipActionProps = {
  /** Texto completo ("Pular esta pergunta"): visível a partir de `tablet` e nome acessível sempre. */
  label: string;
  /** Texto curto do mobile ("Pular"): o completo quebrava em duas linhas ao lado de Voltar e Atalhos. */
  shortLabel: string;
  onSkip: () => void;
};

/**
 * "Ação Pular" das etapas opcionais.
 * @example <SkipAction label={t('skip')} shortLabel={t('skipShort')} onSkip={skip} />
 */
export function SkipAction({ label, shortLabel, onSkip }: SkipActionProps) {
  return (
    <button type="button" aria-label={label} onClick={onSkip} className={TEXT_ACTION_CLASS}>
      <span aria-hidden className="whitespace-nowrap tablet:hidden">
        <ScrambleText>{shortLabel}</ScrambleText>
      </span>
      <span aria-hidden className="whitespace-nowrap max-tablet:hidden">
        <ScrambleText>{label}</ScrambleText>
      </span>
    </button>
  );
}

type ShortcutsButtonProps = {
  label: string;
  onToggle: () => void;
  isOpen: boolean;
  /** `id` do painel do menu (`aria-controls`). */
  menuId: string;
  /** O menu devolve o foco a este botão ao fechar (Esc, item escolhido). */
  triggerRef: RefObject<HTMLButtonElement | null>;
};

/** Aberto, o botão fica com o fundo do hover (G06: "Atalhos" pressionado enquanto o menu está à vista). */
const shortcutsButtonVariants = cva(
  'transition-interface flex items-center gap-sm rounded-md px-[6px] py-xs hover:bg-alpha-black-5 focus-visible:bg-alpha-black-5 focus-visible:outline-none',
  { variants: { open: { true: 'bg-alpha-black-5', false: '' } }, defaultVariants: { open: false } },
);

/**
 * "Atalhos (/)": tecla "/" + rótulo (o rótulo some abaixo de `tablet`, como no mobile do design; o nome
 * acessível continua no `aria-label`). Abre e fecha o menu de atalhos (G06).
 * @example <ShortcutsButton label={t('shortcuts')} onToggle={menu.toggle} isOpen={menu.isOpen} menuId={menu.menuId} triggerRef={menu.triggerRef} />
 */
export function ShortcutsButton({ label, onToggle, isOpen, menuId, triggerRef }: ShortcutsButtonProps) {
  return (
    <button
      ref={triggerRef}
      type="button"
      aria-label={label}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={isOpen ? menuId : undefined}
      onClick={onToggle}
      className={shortcutsButtonVariants({ open: isOpen })}
    >
      <span
        aria-hidden
        className="flex size-[22px] items-center justify-center font-portfolio text-caption font-semibold text-alpha-black-100"
      >
        /
      </span>
      <span aria-hidden className="font-portfolio text-caption font-regular text-alpha-black-60 max-tablet:hidden">
        <ScrambleText>{label}</ScrambleText>
      </span>
    </button>
  );
}

/**
 * Estados do "Botão Enviar" (pen.dev `TwXfS`, folha de estados `exn2S`): hover a 60%; foco a 60% com o "Anel de
 * foco" (`XEAWg`) — anel preto (`stroke-focus`) sólido de 1px a 1px do círculo —; desabilitado a 40%, sem hover.
 */
const SEND_BUTTON_CLASS =
  'transition-interface flex size-[26px] shrink-0 items-center justify-center rounded-full bg-alpha-black-100 enabled:hover:opacity-60 focus-visible:opacity-60 focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-stroke-focus focus-visible:outline-solid disabled:opacity-40';

/**
 * "Botão Enviar": círculo preto de 26px com seta para cima. Desabilitado (40%) enquanto a resposta não pode
 * seguir (quem decide é a etapa: obrigatórios vazios, erro à vista, checagem em andamento).
 * @example <SendButton label={t('send')} disabled={!canSend} />
 */
export function SendButton({ label, disabled }: { label: string; disabled: boolean }) {
  return (
    <button type="submit" aria-label={label} disabled={disabled} className={SEND_BUTTON_CLASS}>
      <Image src={arrowUpWhiteIcon} alt="" aria-hidden width={14} height={14} />
    </button>
  );
}
