"use server";
import { Category, Gender, Prisma, Size } from "@prisma/client";
import { prisma } from "../prisma";




interface GetProductsParams {
  category?: string;
  gender?: string;
  colors?: string[]; // Hex values (color.hex)
  sizes?: string[]; // Size enum values as strings (e.g., "S", "M", etc.)
  isFeaturedProducts?: boolean;
}

export const getProducts = async (
  params: GetProductsParams & { sort?: string; search?: string } = {}
) => {
  const { category, gender, colors, sizes, sort, search, isFeaturedProducts } =
    params;

  const where: Prisma.ProductWhereInput = {
    ...(category && category !== "all" && { category: category as Category }),
    ...(gender && gender !== "all" && { gender: gender as Gender }),
    ...(colors &&
      colors.length > 0 && {
        variants: {
          some: {
            color: {
              hex: { in: colors },
            },
          },
        },
      }),
    ...(sizes &&
      sizes.length > 0 && {
        variants: {
          some: {
            size: { in: sizes as Size[] },
          },
        },
      }),
    ...(isFeaturedProducts && {
      isFeatured: true,
    }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  let orderBy: Prisma.ProductOrderByWithRelationInput | undefined;

  if (sort === "asc") orderBy = { price: "asc" };
  else if (sort === "desc") orderBy = { price: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      images: true,
      variants: {
        include: { color: true },
      },
    },
  });

  return products;
};

export const getOneProduct = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
    include: {
      images: true,
      variants: {
        include: {
          color: true,
        },
      },
    },
  });
  return product;
};


export async function getAdminDashboardStats() {
  // Total Revenue
  const revenueData = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
    where: {
      paymentStatus: "COMPLETED", // Adjust according to your payment status logic
    },
  });

  const totalRevenue = revenueData._sum.total || 0;

  // Total Orders
  const totalOrders = await prisma.order.count();

  // Total Products
  const totalProducts = await prisma.product.count();

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
  };
}