'use client';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { usePathname, useRouter } from '@/i18n/navigation';
import { ToggleSwitch } from '@/shared/components/toggle-switch';

const LOCALES = [
  { code: 'pt-BR', flag: '/icons/flag-br.svg', labelKey: 'portuguese' },
  { code: 'en', flag: '/icons/flag-us.svg', labelKey: 'english' },
] as const;

/**
 * Painel do seletor de idioma. Fica em `absolute top-full`, fora dos limites do <header>
 * (`overflow-visible`), então não é arrastado pelo `-translate-y-full` do container sticky.
 * Recebe `isHeaderHidden` para sair junto com o header: o mesmo translate com a mesma
 * duração, mantendo o painel aberto — ao voltar, ele reaparece intacto.
 */
export function I18nDropdown({ isHeaderHidden, onClose }: { isHeaderHidden: boolean; onClose: () => void }) {
  const t = useTranslations('pro.i18n');
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchLocale = (locale: string) => {
    router.push(pathname, { locale });
    onClose();
  };

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
      <div className="header-surface flex flex-col gap-1 overflow-hidden rounded-[6px] py-3 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.15)]">
        {LOCALES.map(({ code, flag, labelKey }) => (
          <div key={code} className="flex h-6 items-center justify-between gap-3 px-3">
            <div className="flex items-center gap-2">
              <Image src={flag} alt="" aria-hidden width={14} height={14} />
              <span className="whitespace-nowrap text-sm font-regular font-portfolio text-alpha-black-100">
                {t(labelKey)}
              </span>
            </div>
            <ToggleSwitch checked={currentLocale === code} onChange={() => switchLocale(code)} />
          </div>
        ))}
      </div>
    </div>
  );
}
