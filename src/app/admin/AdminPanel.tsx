'use client';

import React from 'react';
import Button from '../_components/ui/Button';
import { useRouter } from 'next/navigation';

function AdminPanel() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl uppercase">Products</h1>
        <div className="flex flex-row gap-2">
          <Button onClick={() => router.push('/admin/create/product')} name="Create Product">
            Create Product
          </Button>
          <Button onClick={() => router.push('/admin/update/product')} name="Update Product">
            Update Product
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl uppercase">Categories</h1>
        <div className="flex flex-row gap-2">
          <Button onClick={() => router.push('/admin/create/category')} name="Create Category">
            Create Category
          </Button>
          <Button onClick={() => router.push('/admin/update/category')} name="Update Category">
            Update Category
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl uppercase">Sales</h1>
        <div className="flex flex-row gap-2">
          <Button onClick={() => router.push('/admin/create/sale')} name="Create Sale">
            Create Sale
          </Button>
          <Button onClick={() => router.push('/admin/update/sale')} name="Update Sale">
            Update Sale
          </Button>
        </div>
      </div>
      {/* 
      There should be update options for each of these.
      When updating a product, it should be possible to update the sizes, colors, stock.
          It might be interesting to add 'tags' to the product model, to get more accurate related products.
      When updating a sport, category or subcategory, it should be possible to delete it or its categories/subcategories (with a warning of how many products will be left orphaned). 
          It should also be possible to update which products belong to it.
      When updating a sale, it should be possible to update the date, time, and which products belong to it.
      */}
    </div>
  );
}

export default AdminPanel;
