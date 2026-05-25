import { A11yProvider } from '@/contexts/a11y-context';
import type { Metadata } from 'next';
import { JetBrains_Mono, Share_Tech_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Antonio Mascarenhas — Frontend Developer',
  description:
    'Portfolio de Antonio Mascarenhas, Desenvolvedor Frontend com 4+ anos de experiência em React, Next.js e TypeScript. Baseado em São Luís, MA — Brasil.',
  keywords: [
    'Frontend Developer',
    'React',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'TailwindCSS',
    'Portfolio',
    'Antonio Mascarenhas',
    'São Luís',
    'Desenvolvedor Frontend',
  ],
  authors: [{ name: 'Antonio Mascarenhas', url: 'https://github.com/antonionarcilio' }],
  creator: 'Antonio Mascarenhas',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'profile',
    locale: 'pt_BR',
    title: 'Antonio Mascarenhas — Frontend Developer',
    description:
      'Portfolio de Antonio Mascarenhas, Desenvolvedor Frontend com 4+ anos de experiência em React, Next.js e TypeScript.',
    siteName: 'Portfolio — Antonio Mascarenhas',
    images: [{ url: '/favicon.png', width: 512, height: 512, alt: 'Antonio Mascarenhas' }],
  },
  twitter: {
    card: 'summary',
    title: 'Antonio Mascarenhas — Frontend Developer',
    description:
      'Portfolio de Antonio Mascarenhas, Desenvolvedor Frontend com 4+ anos de experiência em React, Next.js e TypeScript.',
    images: ['/favicon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

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

export default function GamerLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${shareTechMono.variable} ${jetbrainsMono.variable}`}>
      <A11yProvider>{children}</A11yProvider>
      {/* Portal root for modals — inside the font-variable scope so CSS vars cascade */}
      <div id="gamer-portal-root" className="font-cv-mono" />
    </div>
  );
}
