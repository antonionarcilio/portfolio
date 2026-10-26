import { ScrambleText } from '@/shared/components/scramble-text';
import { useTranslations } from 'next-intl';

/**
 * Rodapé do app `pro`: uma linha de copyright no fim do conteúdo, no fluxo normal da
 * página — sem `sticky`/`fixed`. O respiro acima dele é o `pb` do `<main>` (ver
 * page.tsx); o `pb-4` aqui é só a folga até a borda inferior do documento. A linha é
 * centralizada pelo `flex justify-center` do footer, e não por `text-center`.
 *
 * @example <Footer />
 */
export function Footer() {
  const t = useTranslations('pro.footer');

  return (
    <footer className="flex justify-center pb-4">
      <p
        // O copyright é um texto legal em uma linha só: sem quebra, para `text-sm` não
        // virar duas linhas no tema sunset, onde o `font-size` é ampliado pela a11y.
        className="text-sm font-regular font-portfolio text-alpha-black-100 whitespace-nowrap"
      >
        <ScrambleText>{t('copyright')}</ScrambleText>
      </p>
    </footer>
  );
}
