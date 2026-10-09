import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken, getSessionSecret } from "@/lib/admin-session";
import { createLoginThrottle } from "@/lib/login-throttle";

const NO_STORE = { "Cache-Control": "no-store" };

const throttle = createLoginThrottle({
  maxFailuresPerClient: 5,
  maxFailuresGlobal: 30,
  windowMs: 15 * 60 * 1000,
});

function sha256(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

// Hash both sides first so the comparison is constant-time and length-blind.
function passwordMatches(candidate: string, expected: string): boolean {
  return timingSafeEqual(sha256(candidate), sha256(expected));
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return request.headers.get("cf-connecting-ip") ?? forwarded ?? request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = getSessionSecret();
  // Fail closed: without both values nobody can sign in.
  if (!adminPassword || !secret) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503, headers: NO_STORE });
  }

  const client = clientKey(request);
  const retryAfter = throttle.retryAfterSeconds(client);
  if (retryAfter > 0) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { ...NO_STORE, "Retry-After": String(retryAfter) } },
    );
  }

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: NO_STORE });
  }

  if (typeof password !== "string" || password.length === 0 || password.length > 256 || !passwordMatches(password, adminPassword)) {
    throttle.recordFailure(client);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return NextResponse.json({ error: "Invalid password" }, { status: 401, headers: NO_STORE });
  }

  throttle.recordSuccess(client);
  const response = NextResponse.json({ success: true }, { headers: NO_STORE });
  response.cookies.set(SESSION_COOKIE, await createSessionToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true }, { headers: NO_STORE });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}
