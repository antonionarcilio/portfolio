import { curriculumData } from '@/features/curriculum/data/curriculum-data';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(curriculumData);
}
