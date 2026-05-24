import { curriculumData } from '@/features/gamer/data/curriculum-data';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(curriculumData);
}
