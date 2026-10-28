import type { ContactFormValues } from './contact-form-schema';

/** Assinatura do envio injetado em `useContactForm` — resolve quando a mensagem foi aceita. */
export type SendContactMessage = (values: ContactFormValues) => Promise<void>;

const SIMULATED_NETWORK_DELAY_MILLISECONDS = 600;

/**
 * TODO: ainda não existe backend de contato (nem rota `/api/contact`, nem serviço de e-mail
 * definido). Enquanto isso, só simula a latência de rede e resolve — nada é enviado de verdade.
 * Troque pelo `fetch` real mantendo a assinatura `SendContactMessage`.
 */
export const sendContactMessage: SendContactMessage = async () => {
  await new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_NETWORK_DELAY_MILLISECONDS));
};
