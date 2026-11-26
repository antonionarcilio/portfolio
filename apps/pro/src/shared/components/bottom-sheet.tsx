'use client';

import type { ReactNode } from 'react';
import { Drawer } from 'vaul';

import { useReturnFocus } from '@/shared/hooks/use-return-focus';
import { scrimVariants, type ScrimProps } from '@/shared/variants/scrim-variants';

type BottomSheetProps = ScrimProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Título e descrição só para leitores de tela, quando o conteúdo não mostra os seus (menu do header). Quem
   * mostra um título visível usa `Dialog.Title`/`Dialog.Description` dentro de `children`.
   */
  hiddenTitle?: string;
  hiddenDescription?: string;
  children: ReactNode;
};

/**
 * Bottom sheet do app (vaul): véu, folha branca presa embaixo com cantos de 24px, alça de arrastar e até 92% da
 * altura. A vaul cuida de portal, foco preso, Esc, trava de rolagem e arrastar para fechar; o foco volta ao
 * elemento que abriu. Usado pelo menu mobile do header e pelo `ResponsiveDialog` abaixo de `tablet`.
 * @example <BottomSheet open={isOpen} onOpenChange={setIsOpen} hiddenTitle={t('menu')}>{content}</BottomSheet>
 */
export function BottomSheet({ open, onOpenChange, hiddenTitle, hiddenDescription, tone, children }: BottomSheetProps) {
  const returnFocus = useReturnFocus();

  return (
    // `autoFocus`: sem ele a vaul impede o Radix de levar o foco para dentro da folha, e o foco ficava no botão
    // que abriu — atrás do véu e escondido dos leitores de tela (`aria-hidden` no resto da página).
    <Drawer.Root open={open} onOpenChange={onOpenChange} autoFocus>
      <Drawer.Portal>
        <Drawer.Overlay className={scrimVariants({ tone })} />
        <Drawer.Content
          {...returnFocus}
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-3xl bg-alpha-white-100 outline-none"
        >
          {hiddenTitle && <Drawer.Title className="sr-only">{hiddenTitle}</Drawer.Title>}
          {hiddenDescription && <Drawer.Description className="sr-only">{hiddenDescription}</Drawer.Description>}
          {/* Alça do design (G07 mobile `nYlfP`): 36×5px, a 8px do topo e 8px acima do conteúdo. */}
          <div aria-hidden className="flex shrink-0 justify-center py-sm">
            <div className="h-[5px] w-9 rounded-full bg-alpha-black-20" />
          </div>
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
