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
      className={`flex items-start shrink-0 p-0.5 rounded-[3.5px] hover:bg-alpha-black-50 focus-visible:bg-alpha-black-50 focus-visible:outline-none ${checked ? 'bg-bulb-on' : 'bg-alpha-black-5'}`}
    >
      <span className={`flex items-center w-[26px] ${checked ? 'justify-end' : 'justify-start'}`}>
        <span className="size-3 rounded-[2px] bg-alpha-white-100 border border-alpha-white-100 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)] block" />
      </span>
    </button>
  );
}
