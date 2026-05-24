import PortfolioClient from '@/features/gamer/components/portfolio-client';
import { portfolioData } from '@/features/gamer/data/portfolio-data';

export default function GamerPage() {
  return <PortfolioClient data={portfolioData} />;
}
