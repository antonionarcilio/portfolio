import { conversationStateSchema, type ConversationState } from './conversation-state';

/** Versão no nome da chave: mudar o formato do estado = trocar o sufixo, e o salvo antigo é ignorado. */
const CONVERSATION_STORAGE_KEY = 'pro.contact-chat.v3';

/**
 * Lê a conversa salva na aba (sessionStorage: fechar a aba descarta). `null` quando não há nada salvo, o
 * JSON é inválido ou o armazenamento está bloqueado (modo privado, cookies desligados).
 * @example const saved = readSavedConversation(); if (saved) dispatch({ type: 'restore', state: saved });
 */
export function readSavedConversation(): ConversationState | null {
  try {
    const stored = window.sessionStorage.getItem(CONVERSATION_STORAGE_KEY);
    if (!stored) return null;
    const parsed = conversationStateSchema.safeParse(JSON.parse(stored));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** Salva a conversa; falhas de armazenamento são ignoradas (a conversa só não sobrevive ao recarregar). */
export function saveConversation(state: ConversationState): void {
  try {
    window.sessionStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Armazenamento cheio ou bloqueado: seguir sem persistência é aceitável.
  }
}

/** "Reiniciar conversa" e o fim do envio apagam o estado salvo. */
export function clearSavedConversation(): void {
  try {
    window.sessionStorage.removeItem(CONVERSATION_STORAGE_KEY);
  } catch {
    // Mesmo motivo de `saveConversation`.
  }
}
