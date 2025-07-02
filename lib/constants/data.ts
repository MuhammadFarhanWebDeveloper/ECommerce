import { Category, Gender } from "@prisma/client";

export const ProductColors: ProductColor[] = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy Blue", hex: "#001F3F" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Charcoal Grey", hex: "#36454F" },
  { name: "Olive Green", hex: "#708238" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Pastel Pink", hex: "#FFD1DC" },
  { name: "Mustard Yellow", hex: "#FFDB58" },
  { name: "Teal", hex: "#008080" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Lavender", hex: "#E6E6FA" },
];

export const ProductSizes: string[] = ["XS", "S", "M", "L", "XL", "XLL"];

export const ProductCategories: Category[] = ["topwear", "bottomwear"];

export const ProductGenders: Gender[] = ["men", "unisex", "women"];
