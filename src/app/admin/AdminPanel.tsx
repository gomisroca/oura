'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import Button from '../_components/ui/Button';

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
    </div>
  );
}

export default AdminPanel;
