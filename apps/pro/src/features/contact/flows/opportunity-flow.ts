import positionIcon from '@/_assets/icons/solar-case.svg';
import companyIcon from '@/_assets/icons/solar-shop-2.svg';

import { freeText, organizationText } from '../engine/field-validators';
import type { FieldDefinition, FlowDefinition } from '../engine/flow-types';
import { emailField, websiteField } from './contact-fields';

/** Limite dos campos curtos (empresa, cargo): uma linha, sem texto livre longo. */
const SHORT_TEXT_MAXIMUM_LENGTH = 120;

/** Limite do texto livre de "Informações adicionais" (mesmo do texto livre do fluxo de projeto). */
const DETAILS_MAXIMUM_LENGTH = 2000;

/**
 * Campo de uma linha com ícone (empresa, cargo). O design mostra o ícone da empresa como "loja"
 * (`solar-shop-2`) e o do cargo como "maleta" (`solar-case`).
 * @example shortTextField('company', { required: true, icon: companyIcon, autoComplete: 'organization' })
 */
function shortTextField(
  id: string,
  options: { required: boolean; icon: FieldDefinition['icon']; autoComplete: string },
): FieldDefinition {
  return {
    id,
    kind: 'text',
    required: options.required,
    // `organizationText`: "Booking.com" e "ASP.NET" são nomes reais, não links.
    validator: organizationText({ required: options.required, maximumLength: SHORT_TEXT_MAXIMUM_LENGTH }),
    maximumLength: SHORT_TEXT_MAXIMUM_LENGTH,
    icon: options.icon,
    autoComplete: options.autoComplete,
  };
}

/**
 * Grupo 03 — "Tenho uma oportunidade profissional" (Pencil `xNLDK`). Fluxo curto e profissional, sem perguntas
 * de orçamento: tipo → empresa → posição → link da vaga (opcional) → detalhes (opcional) → identificação.
 * Sem ramificações: o link é sempre perguntado e pode ser pulado. Textos em
 * `messages/contact-flows/opportunity/*.json`.
 */
export const opportunityFlow: FlowDefinition = {
  id: 'opportunity',
  steps: [
    {
      id: 'type',
      kind: 'options',
      options: [{ id: 'job' }, { id: 'internship' }, { id: 'freelance' }, { id: 'partnership' }, { id: 'other' }],
    },
    {
      id: 'company',
      kind: 'fields',
      fields: [shortTextField('company', { required: true, icon: companyIcon, autoComplete: 'organization' })],
    },
    {
      id: 'position',
      kind: 'fields',
      fields: [shortTextField('position', { required: true, icon: positionIcon, autoComplete: 'off' })],
    },
    { id: 'link', kind: 'fields', optional: true, fields: [websiteField('url', { required: false })] },
    {
      id: 'details',
      kind: 'fields',
      optional: true,
      fields: [
        {
          id: 'details',
          kind: 'textarea',
          required: false,
          validator: freeText({ required: false, maximumLength: DETAILS_MAXIMUM_LENGTH }),
          maximumLength: DETAILS_MAXIMUM_LENGTH,
        },
      ],
    },
    {
      id: 'contact',
      kind: 'fields',
      // Linhas do design (Pencil); no mobile todos os campos empilham.
      rows: [['role'], ['email', 'linkedin']],
      fields: [
        shortTextField('role', { required: false, icon: positionIcon, autoComplete: 'organization-title' }),
        emailField(),
        websiteField('linkedin', { required: false }),
      ],
    },
  ],
};
