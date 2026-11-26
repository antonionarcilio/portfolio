import type { StaticImageData } from 'next/image';
import type { z } from 'zod';

import type { CurrencyCode } from './field-validators';

/**
 * Contrato declarativo da conversa guiada. Cada fluxo (intro, projeto, oportunidade, outros assuntos) é uma
 * lista de `StepDefinition`; o motor (`conversation-path.ts` + `conversation-reducer.ts`) lê essa lista para
 * decidir a próxima pergunta, montar o histórico, o progresso e a revisão. Os textos NÃO ficam aqui: vêm de
 * `pro.contactChat.flows.<flowId>.steps.<stepId>` (ver `flow-message-keys.ts`).
 */

/** Id qualificado de uma etapa: `"<flowId>.<stepId>"` (ex.: `"project.deadline"`). */
export type StepKey = `${string}.${string}`;

/** Pseudo-etapa final de todo fluxo: o resumo com o botão "Enviar mensagem". */
export const REVIEW_STEP_KEY = 'review';

export type StepTarget = StepKey | typeof REVIEW_STEP_KEY;

/** Resposta salva de uma etapa. `values` é indexado pelo id do campo. */
export type StepAnswer =
  /** `values`: o campo de detalhe da opção (`detailField`), quando ela tem um. */
  | { type: 'option'; optionId: string; values?: Record<string, string> }
  | { type: 'fields'; values: Record<string, string> }
  | { type: 'skipped' };

/** Leitura das respostas já dadas, usada pelo `next` de cada etapa para ramificar. */
export type AnswerReader = {
  /** Id da opção escolhida na etapa, ou `undefined` (sem resposta, pulada ou etapa de campos). */
  option: (stepKey: StepKey) => string | undefined;
  /** Valor normalizado de um campo (de uma etapa de campos ou do `detailField` de uma opção), ou `undefined`. */
  field: (stepKey: StepKey, fieldId: string) => string | undefined;
};

/**
 * Validação de um campo: recebe o texto digitado e devolve o texto normalizado ou falha com uma chave de
 * `pro.contactChat.errors` como `message` (ver `field-validators.ts`).
 */
export type FieldValidator = z.ZodType<string, string>;

export type FieldKind = 'text' | 'email' | 'url' | 'tel' | 'textarea';

/**
 * Moeda escolhida no prefixo de um campo de valor (G02·6 `R7fu20`: "R$ ▾" na caixa da "Faixa de investimento").
 * O código vai em `values[id]`, ao lado do valor do campo; `validator` só aceita códigos de `codes`.
 * @example { id: 'currency', codes: ['BRL', 'USD'], validator: currencyCode(['BRL', 'USD']) }
 */
export type CurrencyDefinition = {
  id: string;
  /** Lista fechada (ISO 4217), na ordem do menu; a primeira é a marcada quando o visitante não escolhe. */
  codes: readonly [CurrencyCode, ...CurrencyCode[]];
  validator: FieldValidator;
};

export type FieldDefinition = {
  id: string;
  kind: FieldKind;
  /** Obrigatório mostra o asterisco; opcional mostra "(opcional)" e aceita vazio. */
  required: boolean;
  validator: FieldValidator;
  /** Mesmo teto do `validator`, repetido no `maxLength` do HTML (o navegador corta antes de digitar demais). */
  maximumLength: number;
  /** Ícone à esquerda dentro da caixa (16px). Não vale para `textarea`. */
  icon?: StaticImageData;
  autoComplete?: string;
  /** Prefixo de moeda dentro da caixa (só campos `text`); a resposta mostra "<símbolo> <valor>". */
  currency?: CurrencyDefinition;
};

export type OptionDefinition = {
  id: string;
  /** Só nas etapas `cards`: ícone 22px na moldura cinza à esquerda. */
  icon?: StaticImageData;
  /**
   * Campo revelado na mesma caixa ao marcar esta opção (G02 · Investimento: "Faixa de investimento"). A
   * etapa então não avança no clique: espera o envio (botão ↑) e guarda o valor em `values[field.id]`.
   * @example { id: 'defined', detailField: shortTextField('range', { required: false }) }
   */
  detailField?: FieldDefinition;
};

type StepBase = {
  id: string;
  /**
   * Próxima etapa. Sem `next`, segue a ordem do array e, no fim, vai para a revisão.
   * @example next: (answers) => (answers.option('project.situation') === 'exists' ? 'project.url' : 'project.deadline')
   */
  next?: (answers: AnswerReader) => StepTarget;
  /** Mostra a ação "Pular esta pergunta". */
  optional?: boolean;
  /**
   * `counted` (padrão) soma 1 no "Etapa X de N"; `inherit` repete o número da etapa anterior (perguntas
   * condicionais, como a URL do projeto); `intro` mostra "Início" (etapas do Grupo 01).
   */
  progress?: 'counted' | 'inherit' | 'intro';
  /**
   * Agrupa etapas num único bloco da revisão (rótulo da primeira do grupo; valores em linhas). Sem
   * `summary`, cada etapa vira um bloco; `summary: false` esconde a etapa da revisão.
   */
  summary?: false | { group: string };
  /** `hidden` remove a linha de ações (Voltar/Atalhos/Pular) do compositor — ex.: escolha do motivo (G01·3). */
  navigation?: 'hidden';
};

export type StepDefinition =
  | (StepBase & {
      kind: 'fields';
      fields: readonly FieldDefinition[];
      /**
       * Ids dos campos de cada linha a partir de `tablet` (no mobile tudo empilha). Sem `rows`: dois campos
       * curtos ficam lado a lado e o resto empilha.
       * @example rows: [['fullName', 'email'], ['whatsapp']]
       */
      rows?: readonly (readonly string[])[];
    })
  | (StepBase & { kind: 'options'; options: readonly OptionDefinition[] })
  | (StepBase & { kind: 'cards'; options: readonly OptionDefinition[] });

export type FlowDefinition = {
  /** Também é a chave das mensagens (`pro.contactChat.flows.<id>`) e o id da opção no passo de motivo. */
  id: string;
  steps: readonly StepDefinition[];
};

/** Etapa resolvida dentro do caminho atual da conversa. */
export type ResolvedStep = { key: StepKey; flowId: string; definition: StepDefinition };
