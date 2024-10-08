import { api } from '@/trpc/server';
import MessageWrapper from '../ui/MessageWrapper';
import CategoryFoldable from './CategoryFoldable';

async function CategoryFoldableWrapper() {
  try {
    const sports = await api.category.getSports();
    const maleCategories = await api.category.getSportsByGender({ gender: 'MALE' });
    const femaleCategories = await api.category.getSportsByGender({ gender: 'FEMALE' });
    const sale = await api.sale.get();
    const saleCategories = await api.category.getSportsInSale();

    return (
      <CategoryFoldable
        sports={sports}
        maleSports={maleCategories}
        femaleSports={femaleCategories}
        saleName={sale?.name}
        saleSports={saleCategories}
      />
    );
  } catch (_error) {
    return <MessageWrapper message="Unable to fetch sports at this time" popup={false} />;
  }
}

export default CategoryFoldableWrapper;
