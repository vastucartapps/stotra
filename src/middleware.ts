import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes (except login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken || adminToken !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect admin API routes
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth")) {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken || adminToken !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
