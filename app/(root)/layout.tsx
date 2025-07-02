import Navbar from "@/components/Navbar/Navbar";
import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="py-16">{children}</main>
    </>
  );
}
