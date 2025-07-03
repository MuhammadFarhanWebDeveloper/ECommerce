export const runtime = "nodejs";

import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import authConfig from "./auth.config";
import { compare } from "bcrypt";
import Credentials from "next-auth/providers/credentials";
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      role?: string;
      id?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  secret: process.env.AUTH_SECRET,
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
     async signIn({ user, account }) {
      // This runs when user signs in
      if (account?.provider === "google") {
        // Check if user exists in your database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email ?? "" },
        });
        
        // If new user, create with default role
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email ?? "",
              name: user.name,
              image: user.image,
              role: "USER", // Default role
            },
          });
        }
      }
      return true;
    },
     async jwt({ token, user }) {
      // Fetch user from database to get role
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role; // Add role to session
      }
      return session;
    },
  },
});
