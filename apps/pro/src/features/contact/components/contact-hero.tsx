'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { ActionButton } from '@/shared/components/action-button';
import { ScrambleText } from '@/shared/components/scramble-text';

import { chatEnterVariants } from '../animations';
import { SocialLinks, type ProfileLinks } from './social-links';

type ContactHeroProps = {
  links: ProfileLinks;
  onStart: () => void;
  /**
   * Antes de ler o sessionStorage (hidratação). O Hero já nasce visível no HTML do servidor, sem animação de
   * entrada (que atrasava o LCP); `styles.css` o esconde via `data-hydration-pending` só se o script do
   * `<head>` achou uma conversa salva.
   */
  isHydrationPending: boolean;
};

/**
 * G01 · 1 — Hero de entrada: "Vamos conversar.", texto de apoio, "Iniciar conversa" (só o rótulo — a seta
 * laranja saiu do design, `VWu1L`/`n6EvH2`) e os links sociais.
 * Centralizado na altura da área do chat em todas as larguras (pedido do usuário: no mobile também). O título
 * do mobile no design é 44px (sem token): fica em `display-md` (36) porque o token mais próximo, `display-lg`
 * (48), quebraria "Vamos conversar." em duas linhas a 390px.
 * @example <ContactHero links={links} onStart={start} isHydrationPending={false} />
 */
export function ContactHero({ links, onStart, isHydrationPending }: ContactHeroProps) {
  const t = useTranslations('pro.contactChat.hero');

  return (
    <motion.section
      variants={chatEnterVariants}
      initial={false}
      animate="visible"
      data-hydration-pending={isHydrationPending ? '' : undefined}
      className="contact-chat-height flex w-full flex-col items-center justify-center gap-2xl px-xs py-2xl tablet:gap-[28px]"
    >
      <div className="flex w-full max-w-[640px] flex-col items-center gap-[18px] text-center">
        <h1 className="font-portfolio-title text-display-md font-regular text-alpha-black-100 small:text-display-lg tablet:text-display-xl">
          <ScrambleText>{t('heading')}</ScrambleText>
        </h1>
        <p className="font-portfolio text-chat font-regular text-alpha-black-60 tablet:text-lg">
          <ScrambleText>{t('body')}</ScrambleText>
        </p>
      </div>
      <ActionButton label={t('start')} onClick={onStart} />
      <SocialLinks links={links} />
    </motion.section>
  );
}
