import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` (same mechanics, see
 * node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md).
 *
 * This is an optimistic, cookie-presence check only — it keeps signed-out
 * users off `/dashboard` and signed-in users off `/login` without a network
 * round trip. The real authorization happens server-side wherever
 * `apiClient` is called, same as the original app's NextAuth v4 middleware.
 */
export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith("/dashboard");
  const isAuthPage = pathname === "/login";

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard/modules", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
