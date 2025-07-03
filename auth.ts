export const runtime = "nodejs";

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import authConfig from "./auth.config";
import { compare } from "bcrypt";
import Credentials from "next-auth/providers/credentials";
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "Password" },
      },
      async authorize(credentials) {
        if (!credentials.password) {
          throw new Error("User not registered with credentials");
        }
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email) },
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isValid = await compare(
          String(credentials?.password),
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],

  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    async jwt({ token, user }) {
      console.log("JWT Callback");
      console.log(user);

      if (user) {
        token.id = user.id;
        token.email = user.email;

        const dbUser = await prisma.user.findUnique({
          where: { email: user.email ?? "" },
        });
        token.role = dbUser?.role ?? "USER";
      }

      return token;
    },

    async session({ session, token }) {
      if (token) session.user.id = token.id as string;
      return session;
    },
  },
});
