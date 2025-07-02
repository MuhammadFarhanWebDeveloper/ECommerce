"use client";

import React from "react";
import { Button } from "./ui/button";
import { FilterIcon } from "lucide-react";
import { useSidebar } from "./ui/sidebar";

export default function ToggleFiltersSidebar() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      onClick={toggleSidebar}
      className="flex items-center gap-2 px-4 py-2 text-sm md:text-base rounded-md border border-gray-300 dark:border-gray-600 shadow-sm transition-all duration-200  md:hidden"
    >
      <FilterIcon className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
      <span className="sm:block hidden">Filters</span>
    </Button>
  );
}
