import { JetBrains_Mono, Share_Tech_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { A11yProvider } from '@/contexts/a11y-context';

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export default function CurriculumLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${shareTechMono.variable} ${jetbrainsMono.variable}`}>
      <A11yProvider>{children}</A11yProvider>
    </div>
  );
}
