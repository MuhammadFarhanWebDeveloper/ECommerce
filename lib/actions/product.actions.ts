"use server";

import { z } from "zod";
import { ProductFormSchema } from "../validations";
import cloudinary from "../config.cloudinary";
import { prisma } from "../prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

type UploadInput = z.infer<typeof ProductFormSchema> & {
  images: File[];
};

type UpdateProductInput = z.infer<typeof ProductFormSchema> & {
  productId: number;
  newImages: File[];
  existingImageUrls: string[];
};

export const uploadPoductAction = async (data: UploadInput) => {
  try {
    console.log("📦 Server received:", data);
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId! },
    });
    if (!user || !userId) {
      return { success: false, message: "User ID is missing from session." };
    }

    const { images, ...productFields } = data;

    const result = ProductFormSchema.safeParse(productFields);

    if (!result.success) {
      return { success: false, message: "Invalid product details" };
    }

    if (!images || images.length < 1) {
      return {
        success: false,
        message: "At least one product image is required.",
      };
    }

    if (images.length > 4) {
      throw new Error("");
      return { success: false, message: "You can upload up to 4 images." };
    }

    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const buffer = await image.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const dataUri = `data:${image.type};base64,${base64}`;

        const uploadRes = await cloudinary.uploader.upload(dataUri, {
          folder: "products",
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        });

        return uploadRes.secure_url;
      })
    );

    const newProduct = await prisma.product.create({
      data: {
        name: productFields.name,
        description: productFields.description,
        category: productFields.category,
        gender: productFields.gender,
        price: productFields.price,
        discountPrice: productFields.discountPrice || 0,
        isFeatured: productFields.isFeatured || false,
        userid: userId,
        images: {
          create: uploadedImages.map((url) => ({ url })),
        },
        variants: {
          create: productFields.variants.map((variant) => ({
            color: {
              connectOrCreate: {
                where: { hex: variant.color.hex },
                create: {
                  name: variant.color.name,
                  hex: variant.color.hex,
                },
              },
            },
            size: variant.size,
            quantity: variant.quantity,
          })),
        },
      },
    });

    
    return { success: true, product: newProduct };
  } catch (err: any) {
    console.error("🔥 Error while uploading product:", err.message);
    return {
      success: false,
      error: err.message || "An unexpected error occurred.",
    };
  }
};

export const updateProductAction = async (data: UpdateProductInput) => {
  try {
    console.log("Server received update for product:", data.productId);
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId! },
    });
    if (!user) {
      return { success: false, message: "User ID is missing from session." };
    }

    const { productId, newImages, existingImageUrls, ...productFields } = data;

    const result = ProductFormSchema.safeParse(productFields);

    if (!result.success) {
      console.error("Validation errors:", result.error.flatten());
      return { success: false, message: "Invalid product details" };
    }

    // 📝 Step 1: Get existing image URLs from the database
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        userid: true,
        images: true,
      },
    });

    if (!existingProduct || existingProduct.userid !== userId) {
      return { success: false, message: "Product not found or unauthorized." };
    }

    const oldImageUrls = existingProduct.images.map((img) => img.url);

    // 📝 Step 2: Upload new images to Cloudinary
    const newlyUploadedUrls = await Promise.all(
      newImages.map(async (image) => {
        const buffer = await image.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const dataUri = `data:${image.type};base64,${base64}`;

        const uploadRes = await cloudinary.uploader.upload(dataUri, {
          folder: "products",
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        });
        return uploadRes.secure_url;
      })
    );

    const finalImageUrls = [...existingImageUrls, ...newlyUploadedUrls];

    if (finalImageUrls.length < 1) {
      return {
        success: false,
        message: "At least one product image is required.",
      };
    }
    if (finalImageUrls.length > 4) {
      return { success: false, message: "You can upload up to 4 images." };
    }

    // 📝 Step 3: Find URLs to delete (images that were removed from product)
    const urlsToDelete = oldImageUrls.filter(
      (url) => !finalImageUrls.includes(url)
    );

    // 📝 Step 4: Delete unwanted images from Cloudinary
    await Promise.all(
      urlsToDelete.map(async (url) => {
        try {
          // Extract public_id from URL (Cloudinary trick: public_id is between the folder and the extension)
          const publicId = url.split("/").slice(-1)[0].split(".")[0]; // This assumes single folder level (e.g., "products/filename.jpg")

          await cloudinary.uploader.destroy(`products/${publicId}`);
          console.log(`Deleted image from Cloudinary: ${publicId}`);
        } catch (deleteErr) {
          console.error(`Failed to delete image: ${url}`, deleteErr);
        }
      })
    );

    // 📝 Step 5: Update the product in the database
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: productFields.name,
        description: productFields.description,
        category: productFields.category,
        gender: productFields.gender,
        price: productFields.price,
        discountPrice: productFields.discountPrice || 0,
        isFeatured: productFields.isFeatured || false,

        images: {
          deleteMany: {}, // Clear old images
          create: finalImageUrls.map((url) => ({ url })),
        },

        variants: {
          deleteMany: {}, // Clear old variants
          create: productFields.variants.map((variant) => ({
            color: {
              connectOrCreate: {
                where: { hex: variant.color.hex },
                create: {
                  name: variant.color.name,
                  hex: variant.color.hex,
                },
              },
            },
            size: variant.size,
            quantity: variant.quantity,
          })),
        },
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

    return { success: true, product: updatedProduct };
  } catch (err: any) {
    console.error("🔥 Error while updating product:", err.message);
    return {
      success: false,
      message: err.message || "An unexpected error occurred.",
    };
  }
};

export const deleteProductAction = async (productId: string) => {
  const session = await auth();

  if (!session || !session.user) {
    return { success: false, message: "Unauthorized" };
  }

  const userId = session.user.id;

  const existingProduct = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
    include: { images: true },
  });

  if (!existingProduct) {
    return { success: false, message: "Product not found." };
  }

  if (existingProduct.userid !== userId) {
    return {
      success: false,
      message: "You are not authorized to delete this product.",
    };
  }

  try {
    // ✅ Delete images from Cloudinary
    const cloudinaryPublicIds = existingProduct.images.map((image) => {
      const parts = image.url.split("/");
      const filename = parts[parts.length - 1].split(".")[0];
      return `products/${filename}`;
    });

    await Promise.all(
      cloudinaryPublicIds.map((publicId) =>
        cloudinary.uploader.destroy(publicId)
      )
    );

    // ✅ Delete the product from the database
    await prisma.product.delete({
      where: { id: parseInt(productId) },
    });

    // ✅ Revalidate the admin product dashboard
    revalidatePath("/admin/dashboard/products");

    return { success: true, message: "Product deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the product.",
    };
  }
};
