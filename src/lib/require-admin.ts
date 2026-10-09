import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, isValidSessionCookie } from "@/lib/admin-session";

/**
 * Guard for admin route handlers. The middleware already blocks these paths;
 * checking again here means a future change to the middleware matcher cannot
 * silently expose the API.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const store = await cookies();
  if (await isValidSessionCookie(store.get(SESSION_COOKIE)?.value)) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
}
