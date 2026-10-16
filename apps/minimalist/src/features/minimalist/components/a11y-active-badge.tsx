type MinimalistA11yActiveBadgeProps = {
  count: number;
  label: string;
};

export function MinimalistA11yActiveBadge({ count, label }: MinimalistA11yActiveBadgeProps) {
  return (
    <svg
      className="minimalist-a11y-trigger__badge"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      role="img"
      aria-label={label}
    >
      <circle cx="8" cy="8" r="8" fill="var(--minimalist-foreground)" />
      <text
        x={count === 1 ? 7.5 : 8}
        y="8.5"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--minimalist-background)"
        fontFamily="var(--font-inter)"
        fontWeight={700}
        fontSize={11}
      >
        {count}
      </text>
    </svg>
  );
}
