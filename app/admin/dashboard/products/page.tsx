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

export const dynamic = "force-dynamic";
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
