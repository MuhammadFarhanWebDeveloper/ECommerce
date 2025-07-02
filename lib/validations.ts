import { Category, Gender, Role, Size } from "@prisma/client";
import * as z from "zod";

export const ProductFormSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  category: z.nativeEnum(Category),
  gender: z.nativeEnum(Gender),
  price: z.coerce.number().min(0.1),
  discountPrice: z.coerce.number().optional(),
  isFeatured: z.boolean(),
  variants: z
    .array(
      z.object({
        color: z.object({
          name: z.string().min(1, "Color name is required"),
          hex: z.string(),
        }),
        size: z.nativeEnum(Size),
        quantity: z.coerce.number().min(1),
      })
    )
    .min(1, "At least one variant is required"),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;





export const UserFormSchema = z.object({
  id: z.string().optional(), // Optional for new users, required for updates
  name: z.string().min(1, { message: "Name is required." }).optional().or(z.literal("")),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }).optional().or(z.literal("")), // Optional for updates, can be empty string
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: "Please select a valid role." }),
  }),
})

export type UserFormValues = z.infer<typeof UserFormSchema>
