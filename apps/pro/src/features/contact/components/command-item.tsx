import { cva } from 'class-variance-authority';
import Image, { type StaticImageData } from 'next/image';

import { AnimatedIcon } from '@/shared/components/animated-icon/animated-icon';
import type { AnimatedIconName } from '@/shared/components/animated-icon/animated-icon-registry';
import { ScrambleText } from '@/shared/components/scramble-text';

/**
 * "Item de Comando" do menu de atalhos (G06, Fase 3): ícone 18px, título, descrição e, à direita, chevron
 * (abre submenu) ou seta externa (link). Hover/foco e `highlighted` (item ativo no teclado) pintam o fundo.
 * Exportado para o menu de moeda (`currency-menu.tsx`), que usa a mesma linha com `menuitemradio`.
 */
export const commandItemVariants = cva(
  'transition-interface flex w-full items-center gap-md rounded-lg px-md py-[10px] text-left hover:bg-alpha-black-5 focus-visible:bg-alpha-black-5 focus-visible:outline-none',
  {
    variants: { highlighted: { true: 'bg-alpha-black-5', false: '' } },
    defaultVariants: { highlighted: false },
  },
);

type CommandItemProps = {
  /** Imagem estática ou, para um ícone com animação própria, o nome dele no catálogo (anima no hover/foco da linha). */
  icon: StaticImageData | AnimatedIconName;
  title: string;
  description: string;
  trailing?: 'submenu' | 'external' | 'none';
  highlighted?: boolean;
  /** Com `href`, vira link (abre em nova aba quando `trailing="external"`); senão, botão. */
  href?: string;
  /** Botão: a ação. Link: roda junto da navegação (ex.: fechar o menu). */
  onSelect?: () => void;
};

const TRAILING_ICON_CLASS = 'ml-auto shrink-0 opacity-60';

const TRAILING_ANIMATED_ICONS = { submenu: 'chevron-right', external: 'arrow-up-right' } as const;

/** Chevron › (desloca para a direita) ou seta ↗ (gira) à direita; ambos animam no hover/foco da linha. */
function TrailingIcon({ trailing }: { trailing: 'submenu' | 'external' }) {
  return (
    <AnimatedIcon
      name={TRAILING_ANIMATED_ICONS[trailing]}
      sizePixels={16}
      trigger="parent"
      className={TRAILING_ICON_CLASS}
    />
  );
}

function LeadingIcon({ icon }: { icon: StaticImageData | AnimatedIconName }) {
  if (typeof icon === 'string') return <AnimatedIcon name={icon} sizePixels={18} trigger="parent" />;
  return <Image src={icon} alt="" aria-hidden width={18} height={18} className="shrink-0" />;
}

function ItemContent({
  icon,
  title,
  description,
  trailing = 'none',
}: Omit<CommandItemProps, 'href' | 'onSelect' | 'highlighted'>) {
  return (
    <>
      <LeadingIcon icon={icon} />
      <span className="shrink-0 font-portfolio text-sm font-medium text-alpha-black-100">
        <ScrambleText>{title}</ScrambleText>
      </span>
      {/* A descrição some abaixo de `tablet`, como no mobile do design; o `ml-auto` do ícone o mantém à direita. */}
      <span className="min-w-0 flex-1 truncate font-portfolio text-sm font-regular text-alpha-black-60 max-tablet:hidden">
        <ScrambleText>{description}</ScrambleText>
      </span>
      {trailing !== 'none' && <TrailingIcon trailing={trailing} />}
    </>
  );
}

/**
 * Fora da ordem de Tab (`tabIndex={-1}`): o menu move o foco entre os itens com as setas.
 * @example <CommandItem icon={undoIcon} title="Reiniciar conversa" description="Voltar ao início" onSelect={restart} />
 */
export function CommandItem({ href, onSelect, highlighted = false, ...content }: CommandItemProps) {
  const className = commandItemVariants({ highlighted });
  if (href) {
    const external = content.trailing === 'external';
    return (
      <a
        role="menuitem"
        tabIndex={-1}
        href={href}
        data-animated-icon-host
        onClick={onSelect}
        className={className}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <ItemContent {...content} />
      </a>
    );
  }
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      data-animated-icon-host
      onClick={onSelect}
      className={className}
    >
      <ItemContent {...content} />
    </button>
  );
}
