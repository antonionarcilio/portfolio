import React from 'react';

/**
 * Renders stack technology badges.
 * Each inner array is one group whose items are joined by "+".
 * Multiple groups are separated by ",".
 */
export function StackBadges({ groups }: { groups: string[][] }) {
  return (
    <div className="flex flex-wrap items-end gap-y-[10px]">
      {groups.map((group, gi) => (
        <React.Fragment key={gi}>
          {group.map((s, i) => (
            <React.Fragment key={s}>
              <span className="border border-cv-cyan-dim text-cv-cyan bg-[rgba(43,214,255,0.06)] px-[10px] py-1 text-[12px] tracking-[0.1em]">
                {s}
              </span>
              {i < group.length - 1 && (
                <span className="text-cv-text-dim text-[12px] px-[6px] select-none leading-[28px]">+</span>
              )}
            </React.Fragment>
          ))}
          {gi < groups.length - 1 && (
            <span className="text-cv-text-dim text-[12px] px-[6px] mr-[6px] select-none leading-none self-end">,</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
