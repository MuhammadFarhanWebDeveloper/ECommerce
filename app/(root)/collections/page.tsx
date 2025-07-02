// app/collections/page.tsx
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import FiltersSidebar from "@/components/FiltersSidebar";
import ToggleFiltersSidebar from "@/components/ToggleFiltersSidebar";
import { SortProducts } from "@/components/sort-products";
import { ProductCard } from "@/components/product-card";
import { Category, Gender, Size } from "@prisma/client";
import { getProducts } from "@/lib/actions/products";

interface CollectionsPageProps {
  searchParams: Promise<{
    category?: string;
    gender?: string;
    colors?: string;
    sizes?: string;
    sort?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function CollectionsPage(props: CollectionsPageProps) {
  const searchParams = await props.searchParams;
  // 🟢 Extract filters from URL params
  const selectedCategory = searchParams.category?.toLowerCase() || "all";
  const selectedGender = searchParams.gender?.toLowerCase() || "all";
  const selectedColors = searchParams.colors
    ? searchParams.colors.split(",")
    : [];
  const selectedSizes = searchParams.sizes ? searchParams.sizes.split(",") : [];
  const sort = searchParams.sort || "default";
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page || "1");
  const limit = 9; // or whatever number you prefer

  const products = await getProducts({
    category: selectedCategory as Category,
    gender: selectedGender as Gender,
    colors: selectedColors,
    sizes: selectedSizes as Size[],
    sort,
    search,
  });

  return (
    <SidebarProvider>
      <FiltersSidebar />
      <SidebarInset>
        {/* Header */}
        <div className="flex py-3 flex-col md:flex-row justify-between shrink-0 items-center gap-2 border-b px-4">
          <h1 className="text-xl font-semibold">All Collections</h1>
          <div className="flex gap-2 items-center justify-between">
            <ToggleFiltersSidebar />
            <SortProducts />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          {products.length > 0 ? (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  {...{
                    ...product,
                    image: product.images[0]?.url || "/placeholder.svg",
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No products match your filters.
            </p>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
