import { env } from '@/env';
import PortfolioClient from '@/features/gamer/components/portfolio-client';
import { getPortfolio } from '@/features/gamer/data/get-portfolio';
import { calcTotalCareerYears } from '@/features/gamer/utils/career-years';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const portfolioData = await getPortfolio();
  const { name, role, skills } = portfolioData;

  const years = calcTotalCareerYears(portfolioData.experience);
  const title = `${name} — ${role}`;
  const description = `Portfolio de ${name}, ${role} com ${years}+ anos de experiência em React, Next.js e TypeScript. São Luís, MA — Brasil.`;
  const keywords = [role, ...skills.map((skill) => skill.name), 'Portfolio', name, 'Desenvolvedor Frontend'];

  return {
    title,
    description,
    keywords,
    authors: [{ name, url: portfolioData.githubUrl }],
    creator: name,
    icons: {
      icon: '/favicon.webp',
      shortcut: '/favicon.webp',
      apple: '/favicon.webp',
    },
    alternates: {
      canonical: '/portfolios/gamer',
    },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      title,
      description,
      siteName: `Portfolio — ${name}`,
      images: [{ url: '/portfolios/gamer/og-gamer.webp', width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/portfolios/gamer/og-gamer.webp'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function GamerPage() {
  const portfolioData = await getPortfolio();
  const { name, role, githubUrl, linkedinUrl } = portfolioData;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: role,
    email: portfolioData.email,
    url: `${env.MY_DOMAIN}/portfolios/gamer`,
    sameAs: [githubUrl, linkedinUrl],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São Luís',
      addressRegion: 'MA',
      addressCountry: 'BR',
    },
    knowsAbout: portfolioData.skills.map((s) => s.name),
  };

  return (
    <>
      {/* JSON-LD: all data is static (portfolio-data.ts), JSON.stringify handles escaping */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortfolioClient data={portfolioData} phone={portfolioData.phone} email={portfolioData.email} />
    </>
  );
}
