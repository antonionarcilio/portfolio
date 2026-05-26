import PortfolioClient from '@/features/gamer/components/portfolio-client';
import { portfolioData } from '@/features/gamer/data/portfolio-data';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { name, role, skills } = portfolioData;

  const title = `${name} — ${role}`;
  const description = 'Construindo experiências digitais com atenção aos detalhes e paixão por qualidade.';
  const keywords = [role, ...skills.map((skill) => skill.name), 'Portfolio', name, 'Desenvolvedor Frontend'];

  return {
    title,
    description,
    keywords,
    authors: [{ name, url: portfolioData.githubUrl }],
    creator: name,
    icons: {
      icon: '/favicon.png',
      shortcut: '/favicon.png',
      apple: '/favicon.png',
    },
    openGraph: {
      type: 'profile',
      locale: 'pt_BR',
      title,
      description,
      siteName: `Portfolio — ${name}`,
      images: [{ url: '/og-gamer.png', width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-gamer.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default function GamerPage() {
  return <PortfolioClient data={portfolioData} />;
}
