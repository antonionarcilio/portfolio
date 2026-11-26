'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { chatEnterVariants } from '../animations';
import type { AnswerMap } from '../engine/answer-reader';
import { groupSummarySteps, summaryGroupLines } from '../engine/build-summary';
import { resolvePath } from '../engine/conversation-path';
import type { StepKey } from '../engine/flow-types';
import type { FlowTexts } from '../engine/use-flow-texts';
import { SummaryBlock } from './summary-block';

type ReviewSummaryProps = {
  answers: AnswerMap;
  texts: FlowTexts;
  onEdit: (stepKey: StepKey) => void;
  animateEntrance: boolean;
};

/**
 * Painel "Resumo" da revisão: um bloco por etapa (ou grupo) do caminho atual, com "Editar" que reabre a
 * etapa — ao responder de novo, a conversa volta direto para cá (ver `targetAfterReviewEdit`).
 * @example <ReviewSummary answers={state.answers} texts={texts} onEdit={edit} animateEntrance />
 */
export function ReviewSummary({ answers, texts, onEdit, animateEntrance }: ReviewSummaryProps) {
  const t = useTranslations('pro.contactChat.review');
  const groups = groupSummarySteps(resolvePath(answers));

  return (
    <motion.dl
      variants={chatEnterVariants}
      initial={animateEntrance ? 'hidden' : false}
      animate="visible"
      className="flex w-full flex-col rounded-[16px] border border-alpha-black-10 bg-alpha-white-100 px-lg py-[2px] tablet:px-xl"
    >
      {groups.map((group) => {
        const firstStep = group.steps[0];
        if (!firstStep) return null;
        const label = texts.summaryLabel(firstStep);
        return (
          <SummaryBlock
            key={group.id}
            label={label}
            lines={summaryGroupLines(group, answers, texts)}
            emptyText={t('notInformed')}
            editLabel={t('edit')}
            editAccessibleLabel={t('editAccessible', { label })}
            onEdit={() => onEdit(firstStep.key)}
          />
        );
      })}
    </motion.dl>
  );
}
