'use client';

import { useRef, useState } from 'react';

import { flipDemoContent } from './content';
import { FlipDemoCard } from './flip-demo-card';

export default function FlipDemoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-8">
      <div ref={containerRef} className="relative h-[520px] w-full max-w-xl">
        <FlipDemoCard
          containerRef={containerRef}
          content={flipDemoContent}
          expanded={expanded}
          onExpandedChange={() => setExpanded((value) => !value)}
        />
      </div>
    </main>
  );
}
