"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ColorCircle from "./ColorCircle";

interface ProductVariant {
  color: { hex: string };
  size: string;
}

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  gender: string;
  variants: ProductVariant[];
}

export function ProductCard({
  id,
  name,
  price,
  image,
  category,
  gender,
  variants,
}: ProductCardProps) {
  const availableColors = Array.from(
    new Set(variants.map((variant) => variant.color.hex))
  );
  const availableSizes = Array.from(
    new Set(variants.map((variant) => variant.size))
  );

  return (
    <Card className="w-full p-2 bg-primary-foreground max-w-xs mx-auto overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <Link href={`/product/${id}`}>
          <div className="relative w-full cursor-pointer">
            <Image
              src={image}
              alt={name}
              width={300}
              height={300}
              className="rounded-t-lg object-cover w-[300px] h-[300px] mx-auto"
            />
          </div>
        </Link>

        <div className="p-4 space-y-2">
          <Link href={`/product/${id}`}>
            <h3 className="text-lg font-semibold text-gray-900 truncate hover:underline cursor-pointer">
              {name}
            </h3>
          </Link>
          <p className="text-xl font-bold text-gray-800">pkr{price.toFixed(2)}</p>

          {/* Gender and Category */}
          <div className="text-sm text-muted-foreground">
            <span className="capitalize">{gender}</span> |{" "}
            <span className="capitalize">{category}</span>
          </div>

          {/* Colors */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-600">Colors:</span>
            {availableColors.map((color) => (
              <ColorCircle
                key={color}
                color={color}
                className="w-5 h-5 border border-gray-300"
              />
            ))}
          </div>

          {/* Sizes */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-600">Sizes:</span>
            {availableSizes.map((size) => (
              <span
                key={size}
                className="text-xs px-2 py-1 rounded bg-gray-100 border text-gray-800"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
