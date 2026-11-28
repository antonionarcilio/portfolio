'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import type { BottomSheetProps } from '@/shared/components/bottom-sheet-drawer';

/**
 * A vaul pesa ~100 KB e o menu mobile do header existe em toda página, então ela sai do bundle inicial:
 * `ssr: false` porque a folha nunca é renderizada fechada, e o `import()` só roda sob demanda.
 */
const LazyBottomSheetDrawer = dynamic(
  () => import('@/shared/components/bottom-sheet-drawer').then((module) => module.BottomSheetDrawer),
  { ssr: false },
);

/**
 * Espaçamento padrão do conteúdo de um bottom sheet de lista (menu do header, moedas): 20px nas laterais, 4px
 * abaixo da alça (que já soma 8 + 5 + 8px, então o conteúdo começa a 25px do topo) e 20px na base. Quem envolve
 * o conteúdo aplica esta classe, para todos os drawers terem o mesmo respiro.
 * @example <div className={`flex flex-col ${BOTTOM_SHEET_BODY_CLASS}`}>…</div>
 */
export const BOTTOM_SHEET_BODY_CLASS = 'px-xl pt-xs pb-xl';

/** Aquece o chunk da vaul quando o navegador está ocioso, sem montar nada: a primeira abertura não espera rede. */
function usePreloadDrawerWhenIdle(): void {
  useEffect(() => {
    const preload = () => void import('@/shared/components/bottom-sheet-drawer');
    if (typeof window.requestIdleCallback !== 'function') {
      const timeoutId = window.setTimeout(preload, 2000);
      return () => window.clearTimeout(timeoutId);
    }
    const idleId = window.requestIdleCallback(preload, { timeout: 5000 });
    return () => window.cancelIdleCallback(idleId);
  }, []);
}

/**
 * Bottom sheet do app (vaul), montado só na primeira abertura. Depois de aberto permanece montado, para a
 * animação de fechar rodar. Usado pelo menu mobile do header e pelo `ResponsiveDialog` abaixo de `tablet`.
 * @example <BottomSheet open={isOpen} onOpenChange={setIsOpen} hiddenTitle={t('menu')}>{content}</BottomSheet>
 */
export function BottomSheet(props: BottomSheetProps) {
  const [hasOpened, setHasOpened] = useState(props.open);
  usePreloadDrawerWhenIdle();

  if (props.open && !hasOpened) setHasOpened(true);
  if (!hasOpened) return null;
  return <LazyBottomSheetDrawer {...props} />;
}
