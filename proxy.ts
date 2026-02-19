import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";

// Allow Clerk to accept requests from the current origin (required for production/Vercel).
// Include both VERCEL_URL (deployment host) and NEXT_PUBLIC_APP_URL (e.g. production alias) when set.
function getAuthorizedParties(): string[] {
  const parties: string[] = [];
  if (process.env.VERCEL_URL) {
    parties.push(`https://${process.env.VERCEL_URL}`);
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    const url = appUrl.startsWith("http") ? appUrl : `https://${appUrl}`;
    if (!parties.includes(url)) parties.push(url);
  }
  if (parties.length === 0) {
    parties.push("http://localhost:3000");
  }
  return parties;
}
const authorizedParties = getAuthorizedParties();

// Don't use auth.protect() here: it can run before the session cookie is available
// right after Clerk redirects to /chat, causing a redirect loop back to sign-in.
// Protection is handled client-side by <AuthGuard> (SignedIn/SignedOut + RedirectToSignIn).
const clerkHandler = clerkMiddleware({
  authorizedParties,
});

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return clerkHandler(request, event);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
