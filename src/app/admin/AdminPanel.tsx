'use client';

import React from 'react';
import Button from '../_components/ui/Button';
import { useRouter } from 'next/navigation';

function AdminPanel() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => router.push('/admin/create/product')} name="Create Product">
        Create Product
      </Button>
      <Button onClick={() => router.push('/admin/create/category')} name="Create Category">
        Create Category
      </Button>
      <Button onClick={() => router.push('/admin/create/sale')} name="Create Sale">
        Create Sale
      </Button>
    </div>
  );
}

export default AdminPanel;
