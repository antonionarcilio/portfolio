import { curriculumData } from '@/features/curriculum/data/curriculum-data';
import CurriculumClient from '@/features/curriculum/components/curriculum-client';

export default function CurriculumPage() {
  return <CurriculumClient data={curriculumData} />;
}
