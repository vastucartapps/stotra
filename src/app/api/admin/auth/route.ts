import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";

function hashToken(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
    }

    if (!password || !safeCompare(String(password), adminPassword)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Generate a signed session token instead of a static string
    const sessionToken = hashToken(adminPassword + Date.now().toString() + Math.random().toString());

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    // Store the valid token hash for verification
    response.cookies.set("admin_token_hash", hashToken(sessionToken), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_token");
  response.cookies.delete("admin_token_hash");
  return response;
}
