"use client";

import React from "react";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { ProductFormSchema } from "@/lib/validations";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  uploadPoductAction,
  updateProductAction,
} from "@/lib/actions/product.actions";
import { ProductColors, ProductSizes } from "@/lib/constants/data";
import { useRouter } from "nextjs-toploader/app";
import { Category, Gender } from "@prisma/client";
type ProductFormValues = z.infer<typeof ProductFormSchema>;

type ImageState = {
  id?: number;
  url?: string;
  file?: File;
  preview: string;
};

type ProductFormProps = {
  initialData?: ProductFormValues & {
    id: number;
    images: { id: number; url: string }[];
  };
};

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<ImageState[]>([]);

  React.useEffect(() => {
    if (initialData?.images && initialData.images.length > 0) {
      setImages(
        initialData.images.map((img) => ({
          id: img.id,
          url: img.url,
          preview: img.url,
        }))
      );
    }
  }, [initialData]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      category: undefined,
      gender: undefined,
      price: 0,
      discountPrice: 0,
      isFeatured: false,
      variants: [
        {
          color: { name: "", hex: "" },
          size: "M",
          quantity: 1,
        },
      ],
    },
  });

  const { formState } = form;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    if (files.length + images.length > 4) {
      toast.error("You can upload a maximum of 4 images.");
      return;
    }

    const newImageStates: ImageState[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImageStates]);
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    if (imageToRemove.file) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (images.length < 1) {
      toast.error(
        "Please upload at least one product image before submitting."
      );
      return;
    }

    const newImageFiles = images
      .filter((img) => img.file)
      .map((img) => img.file!);
    const existingImageUrls = images
      .filter((img) => img.url && !img.file)
      .map((img) => img.url!);

    let res: { success: boolean; message?: string };

    if (initialData?.id) {
      res = await updateProductAction({
        productId: initialData.id,
        ...data,
        newImages: newImageFiles,
        existingImageUrls: existingImageUrls,
      });
    } else {
      res = await uploadPoductAction({
        ...data,
        images: newImageFiles,
      });
    }

    if (res.success) {
      toast.success(
        `Product ${initialData ? "updated" : "uploaded"} successfully!`
      );
      !initialData && router.push("/admin/dashboard/products");
    } else {
      toast.error(
        res.message ||
          `Failed to ${initialData ? "update" : "submit"} product form.`
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-4 md:p-6 lg:p-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className=" ">
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Category).map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Gender).map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            isNaN(Number.parseFloat(e.target.value))
                              ? 0
                              : Number.parseFloat(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Price (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : isNaN(Number.parseFloat(e.target.value))
                              ? 0
                              : Number.parseFloat(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mark as featured</FormLabel>
                    <FormDescription>
                      This product will be highlighted on the homepage.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <FormDescription>
              Upload 1 to 4 images for your product.
            </FormDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={image.preview}
                  className="relative w-full aspect-square rounded-lg border border-gray-200 overflow-hidden group"
                >
                  <img
                    src={image.preview || "/placeholder.svg"}
                    alt={`Product preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    size="icon"
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    variant="outline"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              {images.length < 4 && (
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="flex flex-col items-center justify-center w-full aspect-square rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                >
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Add Image</span>
                  <span className="text-xs text-gray-400">
                    ({4 - images.length} remaining)
                  </span>
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Variants</CardTitle>
            <FormDescription>
              Define different colors, sizes, and quantities for your product.
            </FormDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg shadow-sm"
              >
                <FormField
                  control={form.control}
                  name={`variants.${index}.color`}
                  render={({ field: variantField }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <Select
                        onValueChange={(hex) => {
                          const selectedColor = ProductColors.find(
                            (c) => c.hex === hex
                          );
                          variantField.onChange(
                            selectedColor ?? { name: "", hex: "" }
                          );
                        }}
                        value={variantField.value.hex}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ProductColors.map((c) => (
                            <SelectItem key={c.hex} value={c.hex}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: c.hex }}
                                />
                                <span>{c.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`variants.${index}.size`}
                  render={({ field: variantField }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <Select
                        onValueChange={variantField.onChange}
                        defaultValue={variantField.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ProductSizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`variants.${index}.quantity`}
                  render={({ field: variantField }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="1"
                          {...variantField}
                          onChange={(e) =>
                            variantField.onChange(
                              isNaN(Number.parseInt(e.target.value))
                                ? 1
                                : Number.parseInt(e.target.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash className="w-4 h-4" />
                  <span className="sr-only">Remove variant</span>
                </Button>
              </div>
            ))}

            <Button
              type="button"
              onClick={() =>
                append({
                  color: { name: "", hex: "" },
                  size: "M",
                  quantity: 1,
                })
              }
              variant="outline"
              className="bg-black text-white hover:bg-gray-800 hover:text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Variant
            </Button>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {initialData ? "Saving..." : "Uploading..."}
            </div>
          ) : initialData ? (
            "Save Changes"
          ) : (
            "Upload Product"
          )}
        </Button>
      </form>
    </Form>
  );
}
