import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simplified middleware - proper auth checks happen in API routes
// This prevents Edge Runtime errors with Prisma/Node.js modules
export function middleware(request: NextRequest) {
  // For now, just pass through - auth is handled in API routes
  // TODO: Re-enable proper middleware auth once we have a solution for Edge Runtime
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

