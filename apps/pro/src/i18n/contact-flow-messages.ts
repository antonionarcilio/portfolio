import type { AbstractIntlMessages } from 'next-intl';

/**
 * Mensagens de cada fluxo do chat de contato vivem em arquivos próprios
 * (`messages/contact-flows/<pasta>/<locale>.json`) para que cada fluxo seja editado sem conflito com os
 * demais. Aqui elas são montadas em `pro.contactChat.flows.<flowId>` — o mesmo id de
 * `features/contact/flows/flow-registry.ts`. Fluxo novo: adicione a linha abaixo e a pasta.
 */
const CONTACT_FLOW_MESSAGE_FOLDERS = {
  intro: 'intro',
  project: 'project',
  opportunity: 'opportunity',
  otherSubjects: 'other-subjects',
} as const;

async function loadFlowMessages(folder: string, locale: string): Promise<AbstractIntlMessages> {
  return (await import(`../../messages/contact-flows/${folder}/${locale}.json`)).default as AbstractIntlMessages;
}

/** @example const flows = await loadContactFlowMessages('pt-BR'); flows.project.steps */
export async function loadContactFlowMessages(locale: string): Promise<Record<string, AbstractIntlMessages>> {
  const entries = await Promise.all(
    Object.entries(CONTACT_FLOW_MESSAGE_FOLDERS).map(
      async ([flowId, folder]) => [flowId, await loadFlowMessages(folder, locale)] as const,
    ),
  );
  return Object.fromEntries(entries);
}

function asMessages(value: AbstractIntlMessages[string] | undefined, path: string): AbstractIntlMessages {
  if (value && typeof value === 'object') return value;
  throw new Error(`Expected an object at messages.${path}; received ${JSON.stringify(value)}`);
}

/**
 * Devolve uma cópia de `messages` com os fluxos em `pro.contactChat.flows`.
 * @example withContactFlowMessages(base, await loadContactFlowMessages(locale))
 */
export function withContactFlowMessages(
  messages: AbstractIntlMessages,
  flows: Record<string, AbstractIntlMessages>,
): AbstractIntlMessages {
  const pro = asMessages(messages.pro, 'pro');
  const contactChat = asMessages(pro.contactChat, 'pro.contactChat');
  return { ...messages, pro: { ...pro, contactChat: { ...contactChat, flows } } };
}
