"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "./product-card";

interface CardCarouselProps {
  title: string;
  products: Product[];
}

export function CardCarousel({ title, products }: CardCarouselProps) {
  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      {products.length > 0 && (
        <>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 px-4 md:px-0">
            {title}
          </h2>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="">
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-4 basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="p-1">
                    <ProductCard
                      variants={product.variants}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.images[0].url}
                      gender={product.gender}
                      category={product.category}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex" />
          </Carousel>
        </>
      )}
    </div>
  );
}
