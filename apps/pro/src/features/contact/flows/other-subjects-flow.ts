import { freeText } from '../engine/field-validators';
import type { FlowDefinition } from '../engine/flow-types';
import { emailField, websiteField } from './contact-fields';

/** Limite do texto livre da mensagem (mesmo dos outros fluxos). */
const MESSAGE_MAXIMUM_LENGTH = 2000;

/**
 * Grupo 04 — "Quero trocar uma ideia" (Pencil `O7r48x`): fluxo informal e rápido para networking, dúvidas e
 * convites. Assunto → mensagem → e-mail + LinkedIn opcional → revisão ("Etapa X de 5"). Sem ramificações.
 * Textos em `messages/contact-flows/other-subjects/*.json`.
 */
export const otherSubjectsFlow: FlowDefinition = {
  id: 'otherSubjects',
  steps: [
    {
      id: 'subject',
      kind: 'options',
      options: [
        { id: 'networking' },
        { id: 'technicalQuestion' },
        { id: 'partnership' },
        { id: 'eventInvitation' },
        { id: 'otherSubject' },
      ],
    },
    {
      id: 'message',
      kind: 'fields',
      fields: [
        {
          id: 'message',
          kind: 'textarea',
          required: true,
          validator: freeText({ required: true, maximumLength: MESSAGE_MAXIMUM_LENGTH }),
          maximumLength: MESSAGE_MAXIMUM_LENGTH,
        },
      ],
    },
    {
      id: 'contact',
      kind: 'fields',
      // O LinkedIn usa o ícone de link no design (`glIJN`), igual ao `websiteField`.
      // Linhas do design (Pencil); no mobile todos os campos empilham.
      rows: [['email'], ['linkedin']],
      fields: [emailField(), websiteField('linkedin', { required: false })],
    },
  ],
};
