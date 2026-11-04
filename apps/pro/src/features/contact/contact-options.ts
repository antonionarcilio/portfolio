/**
 * Opções dos quatro scrollers do formulário, na ordem do Figma. O texto de cada uma vem de
 * `pro.contactPage.options.<grupo>.<opção>`; o valor guardado no formulário é a própria chave.
 */
export const CONTACT_OPTION_KEYS = {
  help: ['newProduct', 'vibeCodingFixer', 'productEvolution', 'designSystem', 'otherChallenge'],
  projectType: ['dashboard', 'adminPanel', 'automation', 'siteBlog', 'unsure'],
  technology: ['react', 'nextjs', 'svelte', 'nodejs', 'wordpress', 'java', 'python', 'n8n'],
  deadline: ['asap', 'twoWeeks', 'oneMonth', 'oneToThreeMonths', 'undefined'],
} as const;

export type ContactOptionGroup = keyof typeof CONTACT_OPTION_KEYS;

export const CONTACT_OPTION_GROUPS = Object.keys(CONTACT_OPTION_KEYS) as ContactOptionGroup[];
