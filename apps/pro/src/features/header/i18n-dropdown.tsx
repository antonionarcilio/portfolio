'use client';
import { useTranslations } from 'next-intl';
import Image, { type StaticImageData } from 'next/image';

import flagBrIcon from '@/_assets/icons/flag-br.svg';
import flagUsIcon from '@/_assets/icons/flag-us.svg';
import { Radio } from '@/shared/components/radio';
import { ScrambleText } from '@/shared/components/scramble-text';
import { useLocaleSwitch } from './use-locale-switch';

const LOCALES: { code: string; flag: StaticImageData; labelKey: 'portuguese' | 'english' }[] = [
  { code: 'pt-BR', flag: flagBrIcon, labelKey: 'portuguese' },
  { code: 'en', flag: flagUsIcon, labelKey: 'english' },
];

/**
 * Painel do seletor de idioma. Fica em `absolute top-full`, fora dos limites do <header>
 * (`overflow-visible`), então não é arrastado pelo `-translate-y-full` do container sticky.
 * Recebe `isHeaderHidden` para sair junto com o header: o mesmo translate com a mesma
 * duração, mantendo o painel aberto — ao voltar, ele reaparece intacto.
 */
export function I18nDropdown({ isHeaderHidden, onClose }: { isHeaderHidden: boolean; onClose: () => void }) {
  const t = useTranslations('pro.i18n');
  const navigationLabels = useTranslations('pro.nav');
  const { currentLocale, switchLocale: switchLocaleAndNotify } = useLocaleSwitch();
  const switchLocale = (locale: string) => switchLocaleAndNotify(locale, onClose);

  return (
    <div
      // Ocultação em fade, não em deslize: o painel fica parado no lugar e só perde
      // opacidade, acompanhando o header sem "subir" junto. `visibility` entra na
      // transição porque é discreta — vira `hidden` no fim do fade e `visible` no
      // início, o que mantém o painel fora do hit-test enquanto está invisível.
      className={`absolute right-0 top-full z-50 mt-2 w-max transition-[opacity,visibility] duration-300 ease-out ${
        isHeaderHidden ? 'invisible opacity-0' : 'opacity-100'
      }`}
    >
      <div
        role="radiogroup"
        aria-label={navigationLabels('languageLabel')}
        className="header-surface flex flex-col gap-1 overflow-hidden rounded-[6px] py-3 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.15)]"
      >
        {LOCALES.map(({ code, flag, labelKey }) => (
          <div key={code} className="flex h-6 items-center justify-between gap-3 px-3">
            <div className="flex items-center gap-2">
              <Image src={flag} alt="" aria-hidden width={14} height={14} />
              <span className="whitespace-nowrap text-sm font-regular font-portfolio text-alpha-black-100">
                <ScrambleText>{t(labelKey)}</ScrambleText>
              </span>
            </div>
            <Radio checked={currentLocale === code} onSelect={() => switchLocale(code)} label={t(labelKey)} />
          </div>
        ))}
      </div>
    </div>
  );
}
