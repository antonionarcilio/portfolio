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
   * Antes de ler o sessionStorage: renderizado (o HTML do servidor leva o `<h1>` e o texto), mas no estado
   * `hidden` da animação e `inert` (fora do foco e dos leitores de tela) até saber se há conversa salva.
   */
  isConcealed: boolean;
};

/**
 * G01 · 1 — Hero de entrada: "Vamos conversar.", texto de apoio, "Iniciar conversa" (só o rótulo — a seta
 * laranja saiu do design, `VWu1L`/`n6EvH2`) e os links sociais.
 * Centralizado na altura da área do chat em todas as larguras (pedido do usuário: no mobile também). O título
 * do mobile no design é 44px (sem token): fica em `display-md` (36) porque o token mais próximo, `display-lg`
 * (48), quebraria "Vamos conversar." em duas linhas a 390px.
 * @example <ContactHero links={links} onStart={start} isConcealed={false} />
 */
export function ContactHero({ links, onStart, isConcealed }: ContactHeroProps) {
  const t = useTranslations('pro.contactChat.hero');

  return (
    <motion.section
      variants={chatEnterVariants}
      initial="hidden"
      animate={isConcealed ? 'hidden' : 'visible'}
      inert={isConcealed}
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
