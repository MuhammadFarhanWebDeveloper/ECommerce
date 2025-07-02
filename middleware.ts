import {  NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { getToken } from "next-auth/jwt";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
  const url = req.nextUrl;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const role = token?.role;

  const isLoggedIn = !!req.auth;
  const path = url.pathname;

  const publicPaths = ["/login", "/signup"];
  const protectedPaths = ["/profile", "/checkout", "/order-success", "/admin"];

  
  if (isLoggedIn && publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  
  if (!isLoggedIn && protectedPaths.some((p) => path.startsWith(p))) {
return NextResponse.rewrite(new URL('/404', req.url))  }

  
  if (isLoggedIn && path.startsWith("/admin") && role !== "ADMIN") {
return NextResponse.rewrite(new URL('/404', req.url))  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
