const CORNERS: Array<{ v: 'top' | 'bottom'; h: 'left' | 'right' }> = [
  { v: 'top', h: 'left' },
  { v: 'top', h: 'right' },
  { v: 'bottom', h: 'left' },
  { v: 'bottom', h: 'right' },
];

export type CornerBracketsSize = 'md' | 'sm' | 'xs';

const SIZE_PX: Record<CornerBracketsSize, number> = {
  md: 16,
  sm: 12,
  xs: 10,
};

/** Decorative L-shaped corner accents, standardized across cards, modals and the header. */
export function CornerBrackets({
  size = 'md',
  thickness = 2,
  offset = -2,
  zIndex,
  className = 'border-cv-cyan',
}: {
  size?: CornerBracketsSize;
  thickness?: number;
  offset?: number;
  zIndex?: number;
  className?: string;
}) {
  const px = SIZE_PX[size];

  return (
    <>
      {CORNERS.map(({ v, h }) => (
        <span
          key={`${v}-${h}`}
          aria-hidden="true"
          className={`absolute pointer-events-none border-solid ${className}`}
          style={{
            width: px,
            height: px,
            [v]: offset,
            [h]: offset,
            zIndex,
            borderTopWidth: v === 'top' ? thickness : 0,
            borderBottomWidth: v === 'bottom' ? thickness : 0,
            borderLeftWidth: h === 'left' ? thickness : 0,
            borderRightWidth: h === 'right' ? thickness : 0,
          }}
        />
      ))}
    </>
  );
}
