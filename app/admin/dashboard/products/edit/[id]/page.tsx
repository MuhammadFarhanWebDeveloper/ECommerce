import ProductForm from "@/components/product-form";
import { getOneProduct } from "@/lib/actions/products";
import React from "react";

type Params = Promise<{ id: string }>;
export default async function page({ params }: { params: Params }) {
  const { id } = await params;
  const product = await getOneProduct(parseInt(id));
  
  if (!product) {
    return <div>Product Not found</div>;
  }
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Product</h1>
      <ProductForm initialData={product} />
    </div>
  );
}
