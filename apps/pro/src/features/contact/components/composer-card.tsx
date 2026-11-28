'use client';

import { motion } from 'framer-motion';
import type { FormEvent, ReactNode } from 'react';

import { OverlayScrollArea } from '@/shared/components/overlay-scroll-area';
import { ScrambleText } from '@/shared/components/scramble-text';

import { chatEnterVariants } from '../animations';

type ComposerCardProps = {
  /** Legenda em caixa-alta acima do conteúdo ("SEU NOME", "ESCOLHA UMA OPÇÃO"). */
  caption?: string;
  children: ReactNode;
  /** Linha de ações: esquerda (Voltar, Atalhos) e direita (Pular, Enviar). Sem nenhuma, a linha some. */
  leadingActions?: ReactNode;
  trailingActions?: ReactNode;
  /** Etapas de campos viram `<form>` (Enter envia); as de opção, não. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
};

/** Legenda em caixa-alta (11px, 1.1px de espaçamento, 60%): compositor e cabeçalho do submenu de atalhos. */
export const CAPTION_TEXT_CLASS =
  'font-portfolio text-overline font-semibold tracking-[1.1px] text-alpha-black-60 uppercase';

// `min-h-0` em toda a cadeia (wrapper animado → cartão → miolo): em tela curta o cartão encolhe e só o miolo
// rola, com legenda e linha de ações sempre à vista e a sombra do cartão intacta.
const CARD_CLASS =
  'flex min-h-0 w-full flex-col gap-md rounded-2xl border border-alpha-black-10 bg-alpha-white-100 p-[14px] shadow-lg tablet:px-xl tablet:py-[18px]';

/**
 * "Interação": cartão branco onde o visitante responde a etapa atual. Normalmente cabe inteiro; quando a tela
 * é curta demais (o histórico guarda 120px — ver ConversationView), só o miolo (opções/campos) rola.
 * @example <ComposerCard caption={caption} leadingActions={<BackAction … />}>…</ComposerCard>
 */
export function ComposerCard({ caption, children, leadingActions, trailingActions, onSubmit }: ComposerCardProps) {
  const body = (
    <>
      {caption && (
        <p className={CAPTION_TEXT_CLASS}>
          <ScrambleText>{caption}</ScrambleText>
        </p>
      )}
      {/* `-m-[2px] p-[2px]`: folga para a borda de 1px das opções não encostar no corte da rolagem. */}
      <OverlayScrollArea className="-m-[2px] min-h-0">
        <div className="flex flex-col gap-md p-[2px]">{children}</div>
      </OverlayScrollArea>
      {(leadingActions || trailingActions) && (
        <div className="flex w-full items-center justify-between gap-md">
          <div className="flex items-center gap-md">{leadingActions}</div>
          {trailingActions && <div className="flex items-center gap-[14px]">{trailingActions}</div>}
        </div>
      )}
    </>
  );

  return (
    <motion.div
      variants={chatEnterVariants}
      initial="hidden"
      animate="visible"
      className="flex min-h-0 w-full flex-col"
    >
      {onSubmit ? (
        <form noValidate onSubmit={onSubmit} className={CARD_CLASS}>
          {body}
        </form>
      ) : (
        <div className={CARD_CLASS}>{body}</div>
      )}
    </motion.div>
  );
}
