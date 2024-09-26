'use client';

import React from 'react';
import Button from '../_components/ui/Button';
import { useRouter } from 'next/navigation';

function AdminPanel() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => router.push('/admin/create/product')}>Create Product</Button>
      <Button onClick={() => router.push('/admin/create/category')}>Create Category</Button>
    </div>
  );
}

export default AdminPanel;
