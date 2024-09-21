import ProductList from './_components/product/ProductList';

export default async function Home() {
  return (
    <div className="flex w-full flex-col gap-2">
      <ProductList />
    </div>
  );
}
