// types/index.d.ts

import { Category, Gender, Size } from "@prisma/client";

declare global {
  type ProductImage = {
    id: number;
    url: string;
  };

  type ProductVariant = {
    id: number;
    color: ProductColor;
    size: Size;
    quantity: number;
    sku?: string;
  };

  type ProductColor = {
    name: string;
    hex: string;
  };

  type Product = {
    id: number;
    name: string;
    category: Category;
    description: string;
    gender: Gender;
    variants: ProductVariant[];
    price: number;
    discountPrice?: number;
    images: ProductImage[];
  };

  type CartProduct = {
    id: number;
    name: string;
    category: Category;
    gender: Gender;
    variant: ProductVariant;
    price: number;
    quantity: number;
    image: string;
  };
}

export {}; // <-- This makes sure it's treated as a module
