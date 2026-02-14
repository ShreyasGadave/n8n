import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Auth routes — redirect to /agent if already logged in
const AUTH_ROUTES = ["/signin", "/signup"];

// Protected routes — redirect to /signin if not logged in
const PROTECTED_ROUTES = ["/agent", "/executions"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const user = token ? verifyToken(token) : null;

  // 🔒 If trying to access a protected route without being logged in
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !user) {
    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🔓 If already logged in, block access to signin/signup
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/agent", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // ✅ Matcher aligned with your actual routes
  matcher: ["/agent/:path*", "/signin/:path*", "/signup/:path*"],
};