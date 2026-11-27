'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import checkCircleWhiteIcon from '@/_assets/icons/solar-check-circle-white.svg';
import { ActionButton } from '@/shared/components/action-button';
import { ScrambleText } from '@/shared/components/scramble-text';

import { chatEnterVariants } from '../animations';
import { clearSavedConversation } from '../engine/conversation-storage';
import { SocialLinks, type ProfileLinks } from './social-links';

type SuccessStateProps = {
  visitorName: string;
  links: ProfileLinks;
};

/** Selo verde: anel translúcido de 96px com o círculo cheio de 64px e o check branco. */
function SuccessSeal() {
  return (
    <span aria-hidden className="flex size-[96px] items-center justify-center rounded-full border border-success-alpha">
      <span className="flex size-[64px] items-center justify-center rounded-full bg-success-500">
        <Image src={checkCircleWhiteIcon} alt="" width={30} height={30} />
      </span>
    </span>
  );
}

/**
 * "Estado de Sucesso": selo, título, agradecimento com o nome, "Voltar ao início" (leva à homepage e apaga
 * a conversa salva, para quem voltar a /contact recomeçar pelo Hero em vez de rever o sucesso) e os links sociais.
 * @example <SuccessState visitorName="Mariana" links={links} />
 */
export function SuccessState({ visitorName, links }: SuccessStateProps) {
  const t = useTranslations('pro.contactChat.success');

  return (
    <motion.section
      variants={chatEnterVariants}
      initial="hidden"
      animate="visible"
      aria-live="polite"
      className="flex w-full flex-1 flex-col items-center justify-center gap-[18px] px-3xl py-[40px] text-center"
    >
      <SuccessSeal />
      <h2 className="max-w-[456px] font-portfolio-title text-display-sm font-regular text-alpha-black-100">
        <ScrambleText>{t('heading')}</ScrambleText>
      </h2>
      <p className="max-w-[456px] font-portfolio text-chat font-regular text-alpha-black-60">
        <ScrambleText>{t('body', { name: visitorName })}</ScrambleText>
      </p>
      <ActionButton label={t('backHome')} href="/" onClick={clearSavedConversation} />
      <div className="pt-lg">
        <SocialLinks links={links} />
      </div>
    </motion.section>
  );
}
