import { cva } from 'class-variance-authority';

const trackVariants = cva(
  'transition-interface flex items-start shrink-0 p-0.5 rounded-[3.5px] hover:bg-alpha-black-50 focus-visible:bg-alpha-black-50 focus-visible:outline-none',
  {
    variants: { checked: { true: 'bg-bulb-on', false: 'bg-alpha-black-5' } },
    defaultVariants: { checked: false },
  },
);

/**
 * Desloca o dot de uma ponta à outra do trilho, para a troca animar. Trilho, dot e deslocamento
 * ficam em `rem` (26px − 12px = 1,625rem − 0,75rem): com "aumentar escala" a raiz cresce, e misturar
 * `px` com `rem` (o `size-3` e o `p-0.5` são `rem`) fazia o dot ultrapassar o trilho e ficar cortado.
 */
const thumbVariants = cva(
  'transition-interface block size-3 rounded-[2px] bg-alpha-white-100 border border-alpha-white-100 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)]',
  {
    variants: { checked: { true: 'translate-x-[0.875rem]', false: 'translate-x-0' } },
    defaultVariants: { checked: false },
  },
);

type ToggleSwitchProps = {
  checked: boolean;
  onChange: () => void;
  label?: string;
};

export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      type="button"
      className={trackVariants({ checked })}
    >
      <span className="flex items-center w-[1.625rem]">
        <span className={thumbVariants({ checked })} />
      </span>
    </button>
  );
}
