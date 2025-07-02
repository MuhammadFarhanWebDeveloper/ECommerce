"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import {  useSearchParams } from "next/navigation";
import { useRouter } from 'nextjs-toploader/app';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("search") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    if (searchText) {
      params.set("search", searchText);
    } else {
      params.delete("search");
    }

    router.push(`/collections?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="pl-10 pr-4"
      />
    </form>
  );
}
