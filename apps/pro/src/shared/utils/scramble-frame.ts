const SCRAMBLE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const SCRAMBLABLE_CHARACTER = /[\p{L}\p{N}]/u;

/** Sorteia um caractere do alfabeto de embaralhamento. */
export function pickScrambleCharacter(): string {
  return SCRAMBLE_CHARACTERS[Math.floor(Math.random() * SCRAMBLE_CHARACTERS.length)];
}

/**
 * Monta um quadro do efeito de decifragem: os primeiros `progress * length` caracteres já
 * estão no texto final; os demais viram caracteres sorteados. Espaços e pontuação nunca são
 * trocados, para que as quebras de linha do quadro acompanhem as do texto final.
 *
 * @example
 * buildScrambleFrame('Olá, mundo', 0.3, pickScrambleCharacter); // 'Olá' + sorteio + ', ' preservado
 */
export function buildScrambleFrame(target: string, progress: number, pickCharacter: () => string): string {
  const resolvedCount = Math.floor(progress * target.length);
  return Array.from(target, (character, index) => {
    if (index < resolvedCount || !SCRAMBLABLE_CHARACTER.test(character)) return character;
    return pickCharacter();
  }).join('');
}
