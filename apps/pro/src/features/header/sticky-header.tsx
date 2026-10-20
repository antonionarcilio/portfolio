'use client';

import { Header } from '@/features/header/header';
import { useScrollDirection } from '@/shared/hooks/use-scroll-direction';

/** Rolagem para cima necessária para o header reaparecer após ser escondido. */
const HEADER_REVEAL_AFTER_PX = 80;

const STICKY_HEADER_BASE = 'header-surface pt-4 sticky top-0 z-40 transition-transform duration-300 ease-out';

/**
 * Container sticky do header. Fica no wrapper (e não no <header>) porque o filho só se
 * desloca dentro do pai — se o pai tivesse a altura do header, ele rolaria junto.
 * Não usar `relative` aqui: o header precisa seguir sendo o offsetParent da logomarca
 * centralizada (`absolute left-1/2`).
 *
 * Ao esconder, o wrapper sai da tela por inteiro com `-translate-y-full` (que acompanha
 * a altura real do filho, agora `py-4` + conteúdo) em vez de um valor em px fixo.
 * @example <StickyHeader />
 */
export function StickyHeader() {
  const isHidden = useScrollDirection({ revealAfter: HEADER_REVEAL_AFTER_PX });

  return (
    <div className={`${STICKY_HEADER_BASE} ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <Header isHeaderHidden={isHidden} />
    </div>
  );
}
