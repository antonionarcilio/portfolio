import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://antoniomascarenhas.com.br'),
  title: 'Portfolio',
  description: 'Personal portfolio',
};

import { JetBrains_Mono, Share_Tech_Mono } from 'next/font/google';

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${shareTechMono.variable} ${jetbrainsMono.variable}`}>
      <body>
        <div className="a11y-zoom-wrapper">{children}</div>
      </body>
    </html>
  );
}
