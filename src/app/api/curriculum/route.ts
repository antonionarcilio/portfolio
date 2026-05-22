import { NextResponse } from 'next/server';
import { curriculumData } from '@/features/curriculum/data/curriculum-data';

export async function GET() {
  return NextResponse.json(curriculumData);
}
