"use client";

import Link from "next/link";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

interface BannerItem {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const bannerData: BannerItem[] = [
  {
    id: 1,
    image: "/placeholder.svg?height=600&width=1200",
    title: "Sustainable Living, Simplified.",
    description:
      "Discover our curated collection of eco-friendly products for a greener lifestyle.",
    buttonText: "Shop Now",
    buttonLink: "/shop",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=600&width=1200",
    title: "Limited Time Deals!",
    description:
      "Don't miss out on incredible savings on your favorite sustainable items.",
    buttonText: "View Deals",
    buttonLink: "/deals",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=600&width=1200",
    title: "New Arrivals Every Week",
    description:
      "Stay ahead with the latest innovations in sustainable technology and fashion.",
    buttonText: "Explore New",
    buttonLink: "/shop/new-arrivals",
  },
];

export function Banner() {
  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <Carousel className="w-full">
        <CarouselContent>
          {bannerData.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="p-1">
                <Card className="relative overflow-hidden rounded-lg">
                  <CardContent className="flex items-center justify-center p-0 h-40 md:h-56">
                    <Image
                      src={banner.image || "/placeholder.svg"}
                      alt={banner.title}
                      layout="fill"
                      objectFit="cover"
                      className="z-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
                    <div className="relative z-20 text-white p-4 md:p-8 max-w-md text-left">
                      <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 leading-tight">
                        {banner.title}
                      </h2>
                      <p className="text-xs md:text-base mb-3 md:mb-5">
                        {banner.description}
                      </p>
                      <Link href={banner.buttonLink}>
                        <Button
                          variant="secondary"
                          className="text-sm px-4 py-2"
                        >
                          {banner.buttonText}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-30" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-30" />
      </Carousel>
    </div>
  );
}
