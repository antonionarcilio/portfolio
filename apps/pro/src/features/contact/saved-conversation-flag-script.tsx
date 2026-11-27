import { CONVERSATION_STORAGE_KEY } from './engine/conversation-storage';

/** Atributo que o script grava no `<html>` e que `styles.css` usa para esconder o Hero enquanto a página hidrata. */
const SAVED_CONVERSATION_ATTRIBUTE = 'data-contact-saved';

// Roda antes do primeiro paint (HTML do servidor) e só checa a EXISTÊNCIA da chave: a validação do conteúdo
// continua no React. Se a chave existir mas o JSON for inválido, o Hero reaparece quando a hidratação termina.
const SAVED_CONVERSATION_SCRIPT = `try{if(window.sessionStorage.getItem(${JSON.stringify(
  CONVERSATION_STORAGE_KEY,
)})!==null)document.documentElement.setAttribute(${JSON.stringify(SAVED_CONVERSATION_ATTRIBUTE)},"")}catch(error){}`;

/**
 * Decide, antes da hidratação, se há conversa salva, para o Hero de entrada já aparecer no HTML (melhor LCP)
 * sem piscar quando a conversa vai ser restaurada. Ver `.contact-hero-pending` em `styles.css`.
 * @example <SavedConversationFlagScript />
 */
export function SavedConversationFlagScript() {
  return <script dangerouslySetInnerHTML={{ __html: SAVED_CONVERSATION_SCRIPT }} />;
}
