import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import './globals.css';

import { env } from '@/env';
import { portfolioData } from '@/shared/data/portfolio-data';
import { calcTotalCareerYears } from '@/shared/utils/career-years';

const years = calcTotalCareerYears(portfolioData.experience);

export const metadata: Metadata = {
  metadataBase: new URL(env.MY_DOMAIN),
  title: 'Antônio Mascarenhas — Frontend Developer',
  description: `Portfolio de Antônio Mascarenhas, Frontend Developer com ${years}+ anos de experiência em React, Next.js e TypeScript. São Luís, MA — Brasil.`,
  icons: {
    icon: '/favicon.webp',
    shortcut: '/favicon.webp',
    apple: '/favicon.webp',
  },
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
        <Analytics />
      </body>
    </html>
  );
}
