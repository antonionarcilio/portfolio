import CurriculumClient from '@/features/gamer/components/curriculum-client';
import { curriculumData } from '@/features/gamer/data/curriculum-data';

export default function GamerPage() {
  return <CurriculumClient data={curriculumData} />;
}
