"use server";
import { prisma } from "../prisma";
import { UserFormSchema } from "../validations";
import { z } from "zod";
import { auth, signIn } from "@/auth";
import { hash } from "bcrypt";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";
export const LoginAction = async () => {
  await signIn("google");
};

export const LoginWithCredentials = async (email: string, password: string) => {
  await signIn("credentials", {
    email,
    password,
  });
};

export const SignUpWithCredentials = async (
  email: string,
  password: string
) => {
  await signIn("credentials", {
    email,
    password,
  });
};

type CreateUserInput = z.infer<typeof UserFormSchema>;
type UpdateUserInput = z.infer<typeof UserFormSchema> & { id: string };
export const createUserAction = async (data: CreateUserInput) => {
  try {
    const cookieStore = await cookies();
    const req = {
      headers: {
        cookie: cookieStore.toString(),
      },
    } as any;

    const session = await auth();
    const user = session?.user;
    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized to create users." };
    }

    const result = UserFormSchema.safeParse(data);

    if (!result.success) {
      console.error("Validation errors:", result.error.flatten());
      return { success: false, message: "Invalid user details." };
    }

    const { name, email, password, role } = result.data;

    if (!password) {
      return { success: false, message: "Password is required for new users." };
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        role,
      },
    });

    return { success: true, user: newUser };
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return { success: false, message: "Email already exists." };
    }
    console.error("🔥 Error creating user:", error);
    return {
      success: false,
      message: error.message || "Failed to create user.",
    };
  }
};

export const updateUserAction = async (data: UpdateUserInput) => {
  try {
    const cookieStore = await cookies();
    const req = {
      headers: {
        cookie: cookieStore.toString(),
      },
    } as any;
    const session = await auth();
    const user = session?.user;
    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized to update users." };
    }

    const result = UserFormSchema.safeParse(data);

    if (!result.success) {
      console.error("Validation errors:", result.error.flatten());
      return { success: false, message: "Invalid user details." };
    }

    const { id, name, email, password, role } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return { success: false, message: "User not found." };
    }

    const updateData: {
      name?: string | null;
      email?: string;
      password?: string;
      role?: Role;
    } = {
      name: name || null,
      email,
      role,
    };

    if (password && password.length > 0) {
      updateData.password = await hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return { success: true, user: updatedUser };
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return {
        success: false,
        message: "Email already in use by another user.",
      };
    }
    console.error("🔥 Error updating user:", error);
    return {
      success: false,
      message: error.message || "Failed to update user.",
    };
  }
};

export const getUserById = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const req = {
      headers: {
        cookie: cookieStore.toString(),
      },
    } as any;

    const session = await auth();
    const sessionUser = session?.user;
    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};
