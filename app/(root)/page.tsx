import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  ShoppingCart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { CardCarousel } from "@/components/card-carousel";
import { getProducts } from "@/lib/actions/products";

// Mock products data - in real app this would come from database
export const dynamic = "force-dynamic"; 
export default async function Home() {
  const products = await getProducts({ isFeaturedProducts: true });

  return (
    <div className="min-h-screen bg-background">
      {/* Banner/Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-8 md:py-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6 py-16">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Discover Amazing Products
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-md">
                Shop the latest tech gadgets and accessories with unbeatable
                prices and fast shipping.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  asChild
                >
                  <Link href={"/collections"}>
                    Start Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                >
                  <a
                    href="https://hafiz-muhammad-farhan.vercel.app"
                    target="_blank"
                  >
                    About Me
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/hero.jpg"
                alt="Hero Product"
                width={400}
                height={300}
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold">
                Up to 50% OFF
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-8">
        {/* Products Grid */}
        {products.length > 0 && (
          <CardCarousel products={products} title="FeaturedProducts" />
        )}

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link href={"/collections"}>
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Additional Sections */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">
                Free shipping on orders over $50
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Guarantee</h3>
              <p className="text-muted-foreground">
                We sell the best quality of products
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Same day delivery available
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
