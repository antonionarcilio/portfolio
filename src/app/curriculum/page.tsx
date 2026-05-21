import { curriculumData } from '../api/curriculum/data';
import CurriculumClient from './curriculum-client';

export default function CurriculumPage() {
  return <CurriculumClient data={curriculumData} />;
}
