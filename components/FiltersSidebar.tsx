"use client";

import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import ColorCircle from "./ColorCircle";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import {  useSearchParams } from "next/navigation";
import { useRouter } from 'nextjs-toploader/app';
import { ProductCategories, ProductColors, ProductGenders, ProductSizes } from "@/lib/constants/data";

export default function FiltersSidebar() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Load filters from URL on mount and apply defaults if missing
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    const colors = searchParams.get("colors")?.split(",") || [];
    const sizes = searchParams.get("sizes")?.split(",") || [];

    const gender = searchParams.get("gender") || "all";
    const category = searchParams.get("category") || "all";

    setSelectedColors(colors);
    setSelectedSizes(sizes);
    setSelectedGender(gender);
    setSelectedCategory(category);

    // Optional: force URL to show "all" explicitly
    // But we'll skip that and just clean it instead
  }, [searchParams]);

  const toggleValue = (list: string[], value: string) => {
    return list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    selectedColors.length
      ? params.set("colors", selectedColors.join(","))
      : params.delete("colors");

    selectedSizes.length
      ? params.set("sizes", selectedSizes.join(","))
      : params.delete("sizes");

    selectedGender !== "all"
      ? params.set("gender", selectedGender)
      : params.delete("gender");

    selectedCategory !== "all"
      ? params.set("category", selectedCategory)
      : params.delete("category");

    router.push(`?${params.toString()}`);
  };

  return (
    <Sidebar variant="inset" className="px-4 py-14" collapsible="offcanvas">
      <SidebarHeader className="flex-row items-center justify-between">
        <h2 className="text-lg font-semibold mb-2">Filters</h2>
        <Button
          className="md:hidden text-center"
          size="icon"
          variant="ghost"
          onClick={() => toggleSidebar()}
        >
          <X />
        </Button>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-4 items-start px-4 py-2">
        {/* Gender Filter */}
        <div>
          <h3 className="text-medium font-semibold mb-2">Gender</h3>
          {["all", ...ProductGenders].map((gender) => (
            <div key={gender} className="flex gap-2 my-2 items-center">
              <input
                type="radio"
                id={`gender-${gender}`}
                name="gender"
                value={gender}
                checked={selectedGender === gender}
                onChange={() => setSelectedGender(gender)}
                className="w-4 h-4 border border-black"
              />
              <Label htmlFor={`gender-${gender}`}>
                {gender === "all"
                  ? "All"
                  : gender.charAt(0).toUpperCase() + gender.slice(1)}
              </Label>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-medium font-semibold mb-2">Category</h3>
          {["all", ...ProductCategories].map((cat) => (
            <div key={cat} className="flex gap-2 my-2 items-center">
              <input
                type="radio"
                id={`category-${cat}`}
                name="category"
                value={cat}
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(cat)}
                className="w-4 h-4 border border-black"
              />
              <Label htmlFor={`category-${cat}`}>
                {cat === "all"
                  ? "All"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Label>
            </div>
          ))}
        </div>

        {/* Color Filter */}
        <div>
          <h3 className="text-medium font-semibold mb-2">Color</h3>
          {ProductColors.map((color) => {
            const hex = color.hex;
            const isChecked = selectedColors.includes(hex);

            return (
              <div key={hex} className="flex gap-2 my-3">
                <Checkbox
                  id={`color-${hex}`}
                  className="border border-black w-4 h-4"
                  checked={isChecked}
                  onCheckedChange={() =>
                    setSelectedColors((prev) => toggleValue(prev, hex))
                  }
                />
                <Label
                  htmlFor={`color-${hex}`}
                  className="flex gap-2 items-center"
                >
                  <ColorCircle color={hex} />
                  <span>{color.name}</span>
                </Label>
              </div>
            );
          })}
        </div>

        {/* Size Filter */}
        <div>
          <h3 className="text-medium font-semibold mb-2">Size</h3>
          {ProductSizes.map((size) => {
            const isChecked = selectedSizes.includes(size);

            return (
              <div key={size} className="flex items-center space-x-2 my-2">
                <Checkbox
                  id={`size-${size}`}
                  className="border border-black w-4 h-4"
                  checked={isChecked}
                  onCheckedChange={() =>
                    setSelectedSizes((prev) => toggleValue(prev, size))
                  }
                />
                <Label htmlFor={`size-${size}`}>{size}</Label>
              </div>
            );
          })}
        </div>

        {/* Apply Button */}
      </SidebarContent>
      <SidebarFooter>
        <Button className="mt-4 w-full" onClick={applyFilters}>
          Apply Filters
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
