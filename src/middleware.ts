// Endpoint Used:
//
// https://app.sir.trading/create-vault
//
// Add a Global Throttling Middleware (Prevent Multiplexed HTTP/2 Spam)
//  Use Next.js Middleware to block excessive requests to /create-vault.
//
// ➤ Middleware Code (pages/_middleware.js or app/middleware.ts)

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const RATE_LIMIT = 5; // Max 5 requests per 10 seconds
const WINDOW_MS = 10000; // Time window in milliseconds
const rateLimit = new Map<string, number[]>();

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.includes("/api/trpc/pool")) {
    const ip = req.headers.get("x-forwarded-for");
    if (!ip) {
      return new NextResponse("No IP Provided", { status: 429 });
    }
    const now = Date.now();
    if (!rateLimit.has(ip)) {
      rateLimit.set(ip, []);
    }
    const timestamps = rateLimit.get(ip);
    if (!timestamps)
      return new NextResponse("Something went wrong.", { status: 429 });
    const filteredTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < WINDOW_MS
    );
    filteredTimestamps.push(now);

    rateLimit.set(ip, filteredTimestamps);

    if (filteredTimestamps.length > RATE_LIMIT) {
      return new NextResponse("Too many requests", { status: 429 });
    }
  }
  const res = NextResponse.next();
  res.headers.set("Connection", "close"); // Prevents long-lived HTTP/2 connections
  res.headers.set("Keep-Alive", "timeout=5, max=10"); // Limits keep-alive time
  res.headers.set("X-Frame-Options", "DENY"); // Blocks iframe exploits
  return res;
}

export const config = {
  matcher: ["/api/:path*"], // Apply only to this page
};
