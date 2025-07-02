// app/api/signup/route.ts
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Response.json(
        { success: false, message: "User already exists with email." },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return Response.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to create user.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
