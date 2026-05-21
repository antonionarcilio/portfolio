import { NextResponse } from 'next/server';
import { curriculumData } from './data';

export async function GET() {
  return NextResponse.json(curriculumData);
}
