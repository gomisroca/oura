import { api } from '@/trpc/server';
import MessageWrapper from '../ui/MessageWrapper';
import CategoryFoldable from './CategoryFoldable';

async function CategoryFoldableWrapper() {
  try {
    const sports = await api.category.getSports();
    const maleCategories = await api.category.getSportsByGender({ gender: 'MALE' });
    const femaleCategories = await api.category.getSportsByGender({ gender: 'FEMALE' });

    return <CategoryFoldable sports={sports} maleSports={maleCategories} femaleSports={femaleCategories} />;
  } catch (_error) {
    return <MessageWrapper message="Unable to fetch sports at this time" popup={false} />;
  }
}

export default CategoryFoldableWrapper;
