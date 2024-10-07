import { api } from '@/trpc/server';
import MessageWrapper from '../ui/MessageWrapper';
import CategoryFoldable from './CategoryFoldable';
import { type SaleCategory } from 'types';

async function CategoryFoldableWrapper() {
  try {
    const sports = await api.category.getSports();
    const maleCategories = await api.category.getSportsByGender({ gender: 'MALE' });
    const femaleCategories = await api.category.getSportsByGender({ gender: 'FEMALE' });
    const saleCategories: { saleName: string; sports: SaleCategory[] } | null = await api.category.getSportsInSale();

    return (
      <CategoryFoldable
        sports={sports}
        maleSports={maleCategories}
        femaleSports={femaleCategories}
        saleName={saleCategories?.saleName ?? undefined}
        saleSports={saleCategories?.sports ?? undefined}
      />
    );
  } catch (_error) {
    return <MessageWrapper message="Unable to fetch sports at this time" popup={false} />;
  }
}

export default CategoryFoldableWrapper;
