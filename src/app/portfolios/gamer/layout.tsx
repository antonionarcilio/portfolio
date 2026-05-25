import { JetBrains_Mono, Share_Tech_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

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

import { A11yProvider } from '@/contexts/a11y-context';

export default function GamerLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${shareTechMono.variable} ${jetbrainsMono.variable}`}>
      <A11yProvider>{children}</A11yProvider>
      {/* Portal root for modals — inside the font-variable scope so CSS vars cascade */}
      <div id="gamer-portal-root" className="font-cv-mono" />
    </div>
  );
}
