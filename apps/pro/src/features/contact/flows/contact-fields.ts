import whatsappIcon from '@/_assets/icons/solar-chat-round-line.svg';
import emailIcon from '@/_assets/icons/solar-letter.svg';
import linkIcon from '@/_assets/icons/solar-link.svg';
import userIcon from '@/_assets/icons/solar-user.svg';

import {
  emailAddress,
  FIELD_MAXIMUM_LENGTHS,
  personName,
  phoneNumber,
  websiteAddress,
} from '../engine/field-validators';
import type { FieldDefinition } from '../engine/flow-types';

/**
 * Campos de identificação reaproveitados pelos fluxos (e-mail, WhatsApp, nome completo, URL). Cada fluxo
 * escolhe quais usa na sua etapa de contato; rótulo e placeholder vêm das mensagens do próprio fluxo
 * (`steps.<stepId>.fields.<fieldId>`), então o mesmo campo pode ter textos diferentes em cada fluxo.
 */

/** @example emailField() // { id: 'email', kind: 'email', required: true, … } */
export function emailField(): FieldDefinition {
  return {
    id: 'email',
    kind: 'email',
    required: true,
    validator: emailAddress({ required: true }),
    maximumLength: FIELD_MAXIMUM_LENGTHS.email,
    icon: emailIcon,
    autoComplete: 'email',
  };
}

/** WhatsApp é sempre opcional no design. @example whatsappField() */
export function whatsappField(): FieldDefinition {
  return {
    id: 'whatsapp',
    kind: 'tel',
    required: false,
    validator: phoneNumber({ required: false }),
    maximumLength: FIELD_MAXIMUM_LENGTHS.phone,
    icon: whatsappIcon,
    autoComplete: 'tel',
  };
}

/** @example fullNameField() */
export function fullNameField(): FieldDefinition {
  return {
    id: 'fullName',
    kind: 'text',
    required: true,
    validator: personName({ required: true }),
    maximumLength: FIELD_MAXIMUM_LENGTHS.name,
    icon: userIcon,
    autoComplete: 'name',
  };
}

/** @example websiteField('url', { required: true }) */
export function websiteField(id: string, options: { required: boolean }): FieldDefinition {
  return {
    id,
    kind: 'url',
    required: options.required,
    validator: websiteAddress(options),
    maximumLength: FIELD_MAXIMUM_LENGTHS.url,
    icon: linkIcon,
    autoComplete: 'url',
  };
}
