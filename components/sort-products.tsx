"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

export function SortProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    router.push(`?${params.toString()}`);
  };

  const currentSort = searchParams.get("sort") || "default";

  return (
    <Select defaultValue={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="asc">Price: Low to High</SelectItem>
        <SelectItem value="desc">Price: High to Low</SelectItem>
      </SelectContent>
    </Select>
  );
}
