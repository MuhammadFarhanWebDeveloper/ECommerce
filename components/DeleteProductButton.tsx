'use client';

import { deleteProductAction } from '@/lib/actions/product.actions';
import { startTransition } from 'react';

export function DeleteProductButton({ productId }: { productId: number }) {
  const handleDelete = () => {
    startTransition(() => {
      deleteProductAction(productId.toString());
    });
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 w-full cursor-pointer hover:text-red-800"
    >
      Delete
    </button>
  );
}
