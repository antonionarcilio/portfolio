import CurriculumClient from '@/features/curriculum/components/curriculum-client';
import { curriculumData } from '@/features/curriculum/data/curriculum-data';

export default function CurriculumPage() {
  return <CurriculumClient data={curriculumData} />;
}
