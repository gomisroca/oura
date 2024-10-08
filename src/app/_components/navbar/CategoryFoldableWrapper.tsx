import { api } from '@/trpc/server';
import MessageWrapper from '../ui/MessageWrapper';
import CategoryFoldable from './CategoryFoldable';

async function CategoryFoldableWrapper() {
  try {
    // Run all API calls concurrently
    const [sports, maleCategories, femaleCategories, sale, saleCategories] = await Promise.all([
      api.category.getSports(),
      api.category.getSportsByGender({ gender: 'MALE' }),
      api.category.getSportsByGender({ gender: 'FEMALE' }),
      api.sale.get(),
      api.category.getSportsInSale(),
    ]);

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
