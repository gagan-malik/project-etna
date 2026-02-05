"use client";

/**
 * Auth guard: currently bypasses login so all routes are accessible without signing in.
 * To re-enforce auth, restore the previous logic that used useAuth(), RedirectToSignIn,
 * and only rendered children when isSignedIn on protected routes.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
