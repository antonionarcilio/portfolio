import { portfolioData } from '@/features/gamer/data/portfolio-data';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(portfolioData);
}
