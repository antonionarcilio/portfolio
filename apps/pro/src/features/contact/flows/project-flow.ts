import { freeText } from '../engine/field-validators';
import type { AnswerReader, FlowDefinition, StepTarget } from '../engine/flow-types';
import { emailField, websiteField, whatsappField } from './contact-fields';

/** Texto livre da ideia do projeto. */
const IDEA_MAXIMUM_LENGTH = 2000;

/** "Faixa de investimento": uma linha curta. */
const BUDGET_RANGE_MAXIMUM_LENGTH = 120;

/**
 * Grupo 02 do design (Pencil `z1i0sp`) — "Tenho um projeto em mente". Textos em
 * `messages/contact-flows/project/*.json`.
 *
 * Ramificações (anotações do grupo):
 * - Situação "Sim, já existe." → pergunta da URL; nas demais respostas, pula direto para o Prazo.
 * - Investimento "Tenho um orçamento definido." → revela o campo opcional "Faixa de investimento" na mesma
 *   caixa (`detailField`, G02·6 `gXp9M`); a faixa vai junto da opção na resposta e na revisão.
 *
 * Contato: só e-mail e WhatsApp (tela `rO4CN`); o nome é o da apresentação — as telas com "Nome completo"
 * (`v3zDzB`, revisão `iz9Sq`) estão defasadas, confirmado pelo usuário.
 *
 * Progresso: motivo (1) + 6 etapas contadas + revisão = "Etapa X de 8"; a URL usa `progress: 'inherit'`.
 */
export const projectFlow: FlowDefinition = {
  id: 'project',
  steps: [
    {
      id: 'need',
      kind: 'options',
      options: [
        { id: 'newProduct' },
        { id: 'evolveProduct' },
        { id: 'improveExperience' },
        { id: 'fixProblems' },
        { id: 'notSure' },
      ],
    },
    {
      id: 'description',
      kind: 'fields',
      fields: [
        {
          id: 'idea',
          kind: 'textarea',
          required: true,
          validator: freeText({ required: true, maximumLength: IDEA_MAXIMUM_LENGTH }),
          maximumLength: IDEA_MAXIMUM_LENGTH,
        },
      ],
    },
    {
      id: 'situation',
      kind: 'options',
      summary: { group: 'existing' },
      options: [{ id: 'exists' }, { id: 'fromScratch' }, { id: 'planning' }],
      next: afterSituation,
    },
    {
      id: 'url',
      kind: 'fields',
      optional: true,
      progress: 'inherit',
      summary: { group: 'existing' },
      fields: [websiteField('url', { required: false })],
    },
    {
      id: 'deadline',
      kind: 'options',
      optional: true,
      options: [{ id: 'asSoonAsPossible' }, { id: 'nextWeeks' }, { id: 'nextMonths' }, { id: 'noDeadline' }],
    },
    {
      id: 'budget',
      kind: 'options',
      optional: true,
      options: [
        {
          id: 'defined',
          detailField: {
            id: 'range',
            kind: 'text',
            required: false,
            validator: freeText({ required: false, maximumLength: BUDGET_RANGE_MAXIMUM_LENGTH }),
            maximumLength: BUDGET_RANGE_MAXIMUM_LENGTH,
          },
        },
        { id: 'notDefined' },
        { id: 'talkFirst' },
      ],
    },
    {
      id: 'contact',
      kind: 'fields',
      fields: [emailField(), whatsappField()],
    },
  ],
};

/** Só quem já tem o projeto no ar informa a URL. @example afterSituation(answers) // 'project.deadline' */
function afterSituation(answers: AnswerReader): StepTarget {
  return answers.option('project.situation') === 'exists' ? 'project.url' : 'project.deadline';
}
