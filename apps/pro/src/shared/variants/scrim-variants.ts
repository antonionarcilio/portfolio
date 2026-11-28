import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Véu atrás de diálogos e bottom sheets. `light` (30%) é o do menu mobile do header, que não interrompe uma
 * tarefa; `strong` (40%) é o das confirmações (G07 · Reiniciar conversa: o design pede `#0A0A0A` a 45%, entre
 * os tokens 40 e 50 — fica o mais leve).
 */
export const scrimVariants = cva('fixed inset-0 z-50', {
  variants: { tone: { light: 'bg-alpha-black-30', strong: 'bg-alpha-black-40' } },
  defaultVariants: { tone: 'light' },
});

export type ScrimProps = VariantProps<typeof scrimVariants>;
