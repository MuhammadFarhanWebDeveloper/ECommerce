import ProductOverview from '@/components/ProductOverview'
import { getOneProduct } from '@/lib/actions/products';
import React from 'react'
type Params = Promise<{ id: string }>
export default async function page({ params }: { params: Params }) {
  const { id } = await params;

  const product =await getOneProduct(parseInt(id));
  if (!product) {
    return <div>Product not found</div>;
  }
  
  
  return (
    <div>
      <ProductOverview product={product}/>
    </div>
  )
}
