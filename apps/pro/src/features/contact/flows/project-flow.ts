import { budgetAmount, currencyCode, freeText } from '../engine/field-validators';
import type { AnswerReader, FieldDefinition, FlowDefinition, StepKey } from '../engine/flow-types';
import { emailField, websiteField, whatsappField } from './contact-fields';

/** A primeira etapa: o tipo de necessidade decide os textos da descrição e se o link do projeto aparece. */
const NEED_STEP_KEY: StepKey = 'project.need';

/** Texto livre da ideia do projeto. */
const IDEA_MAXIMUM_LENGTH = 2000;

/** "Valor aproximado": só números, até 12 dígitos (centenas de bilhões). */
const BUDGET_AMOUNT_MAXIMUM_DIGITS = 12;

/** Moedas do prefixo da faixa (G02·6 "Moeda": `R7fu20` desktop, `v4Vuci` drawer mobile); R$ vem marcado. */
const BUDGET_CURRENCY_CODES = ['BRL', 'USD'] as const;

/**
 * Grupo 02 do design (Pencil `z1i0sp`) — "Tenho um projeto em mente". Textos em
 * `messages/contact-flows/project/*.json`.
 *
 * Decisões do usuário que divergem do Pencil (ainda com as telas antigas):
 * - Sem a etapa "Situação atual" ("Já existe algum site ou sistema…?") nem a da URL: a necessidade (etapa 1)
 *   já diz se o produto existe. O link do projeto foi para a etapa de descrição, opcional, abaixo da área de
 *   texto, e só aparece quando existe (ou pode existir) um projeto — todas as necessidades menos "Criar do zero".
 * - A descrição muda a fala, a dica, o rótulo e o placeholder conforme a necessidade (`textVariantFrom`,
 *   `steps.description.variants.<necessidade>` nas mensagens); "Ainda não sei" usa os textos base.
 *
 * - O valor do orçamento aceita só números (campo `amount`): o design pedia uma faixa em texto livre.
 *
 * Investimento "Tenho um orçamento definido." → revela o campo opcional "Valor aproximado" na mesma caixa
 * (`detailField`, G02·6 `gXp9M`), com o prefixo de moeda "R$ ▾" (`currency`: menu a partir de `tablet`, drawer
 * abaixo); o valor vai junto da opção na resposta e na revisão como "US$ 15,000".
 *
 * Contato: só e-mail e WhatsApp (tela `rO4CN`); o nome é o da apresentação — as telas com
 * "Nome completo" (`v3zDzB`, revisão `iz9Sq`) estão defasadas, confirmado pelo usuário.
 *
 * Progresso: motivo (1) + 5 etapas contadas + revisão = "Etapa X de 7".
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
      textVariantFrom: NEED_STEP_KEY,
      fields: [
        {
          id: 'idea',
          kind: 'textarea',
          required: true,
          validator: freeText({ required: true, maximumLength: IDEA_MAXIMUM_LENGTH }),
          maximumLength: IDEA_MAXIMUM_LENGTH,
        },
        projectLinkField(),
      ],
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
            kind: 'amount',
            required: false,
            validator: budgetAmount({ required: false, maximumDigits: BUDGET_AMOUNT_MAXIMUM_DIGITS }),
            maximumLength: BUDGET_AMOUNT_MAXIMUM_DIGITS,
            currency: { id: 'currency', codes: BUDGET_CURRENCY_CODES, validator: currencyCode(BUDGET_CURRENCY_CODES) },
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

/** "Criar do zero" não tem projeto para mostrar; as outras necessidades (inclusive "Ainda não sei") podem ter. */
function hasExistingProject(answers: AnswerReader): boolean {
  return answers.option(NEED_STEP_KEY) !== 'newProduct';
}

/** Link opcional do projeto atual, abaixo da descrição. @example projectLinkField().visibleWhen?.(answers) */
function projectLinkField(): FieldDefinition {
  return { ...websiteField('url', { required: false }), visibleWhen: hasExistingProject };
}
