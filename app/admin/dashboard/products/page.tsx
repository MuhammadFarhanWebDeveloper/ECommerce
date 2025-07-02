import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { deleteProductAction } from "@/lib/actions/product.actions";
import { DeleteProductButton } from "@/components/DeleteProductButton";
import { getProducts } from "@/lib/actions/products";

// Type Definitions
type ProductImage = {
  id: number;
  url: string;
};

type ProductColor = {
  name: string;
  hex: string;
};

type ProductVariant = {
  id: number;
  color: ProductColor;
  size: "XS" | "S" | "M" | "L" | "XL" | "XLL";
  quantity: number;
  sku?: string;
};

type Product = {
  id: number;
  name: string;
  category: "topwear" | "bottomwear";
  description: string;
  gender: "men" | "women";
  variants: ProductVariant[];
  price: number;
  images: ProductImage[];
};

// Dummy Data
const products_: Product[] = [
  {
    id: 1,
    name: "Classic Cotton Tee",
    category: "topwear",
    description: "A comfortable and stylish cotton t-shirt.",
    gender: "men",
    variants: [
      {
        id: 101,
        color: { name: "Black", hex: "#000000" },
        size: "M",
        quantity: 50,
        sku: "CCT-BLK-M",
      },
      {
        id: 102,
        color: { name: "White", hex: "#FFFFFF" },
        size: "L",
        quantity: 30,
        sku: "CCT-WHT-L",
      },
    ],
    price: 25.0,
    images: [{ id: 1001, url: "/placeholder.svg?height=64&width=64" }],
  },
  {
    id: 2,
    name: "High-Waist Jeans",
    category: "bottomwear",
    description: "Trendy high-waist jeans for a modern look.",
    gender: "women",
    variants: [
      {
        id: 201,
        color: { name: "Blue", hex: "#0000FF" },
        size: "S",
        quantity: 20,
        sku: "HWJ-BLU-S",
      },
      {
        id: 202,
        color: { name: "Black", hex: "#000000" },
        size: "M",
        quantity: 15,
        sku: "HWJ-BLK-M",
      },
    ],
    price: 65.0,
    images: [{ id: 2001, url: "/placeholder.svg?height=64&width=64" }],
  },
  {
    id: 3,
    name: "Sporty Hoodie",
    category: "topwear",
    description: "Warm and comfortable hoodie for active wear.",
    gender: "men",
    variants: [
      {
        id: 301,
        color: { name: "Grey", hex: "#808080" },
        size: "L",
        quantity: 40,
        sku: "SH-GRY-L",
      },
      {
        id: 302,
        color: { name: "Red", hex: "#FF0000" },
        size: "XL",
        quantity: 25,
        sku: "SH-RED-XL",
      },
    ],
    price: 45.0,
    images: [{ id: 3001, url: "/placeholder.svg?height=64&width=64" }],
  },
  {
    id: 4,
    name: "Flowy Summer Dress",
    category: "topwear",
    description: "Light and airy dress perfect for summer days.",
    gender: "women",
    variants: [
      {
        id: 401,
        color: { name: "Floral", hex: "#FFC0CB" },
        size: "S",
        quantity: 10,
        sku: "FSD-FLR-S",
      },
      {
        id: 402,
        color: { name: "Yellow", hex: "#FFFF00" },
        size: "M",
        quantity: 8,
        sku: "FSD-YLW-M",
      },
    ],
    price: 55.0,
    images: [{ id: 4001, url: "/placeholder.svg?height=64&width=64" }],
  },
  {
    id: 5,
    name: "Cargo Shorts",
    category: "bottomwear",
    description: "Durable cargo shorts with multiple pockets.",
    gender: "men",
    variants: [
      {
        id: 501,
        color: { name: "Khaki", hex: "#F0E68C" },
        size: "L",
        quantity: 35,
        sku: "CS-KHK-L",
      },
      {
        id: 502,
        color: { name: "Olive", hex: "#808000" },
        size: "XL",
        quantity: 20,
        sku: "CS-OLV-XL",
      },
    ],
    price: 38.0,
    images: [{ id: 5001, url: "/placeholder.svg?height=64&width=64" }],
  },
];

export default async function AdminDashboard() {
  const products = await getProducts();
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-2xl font-semibold">Products</h1>
          <Button className="ml-auto" size="sm" asChild>
            <Link href={"/admin/dashboard/products/upload"}>Add Product</Link>
          </Button>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="overflow-x-auto rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Gender</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead className="hidden md:table-cell">Stock</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Image
                          alt={`${product.name} image`}
                          className="aspect-square rounded-md object-cover"
                          height={64}
                          src={
                            product.images[0]?.url ||
                            "/placeholder.svg?height=64&width=64"
                          }
                          width={64}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.gender}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        PKR:{product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.variants.reduce(
                          (sum, variant) => sum + variant.quantity,
                          0
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/dashboard/products/edit/${product.id}`}
                              >
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <DeleteProductButton productId={product.id} />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}
