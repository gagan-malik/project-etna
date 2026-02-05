import { clerkMiddleware } from "@clerk/nextjs/server";

// Don't use auth.protect() here: it can run before the session cookie is available
// right after Clerk redirects to /chat, causing a redirect loop back to sign-in.
// Protection is handled client-side by <AuthGuard> (SignedIn/SignedOut + RedirectToSignIn).
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
