"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { UserSettingsProvider } from "@/components/user-settings-provider";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!publishableKey) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
        <p className="text-center font-medium text-destructive">
          Clerk is not configured
        </p>
        <p className="max-w-md text-center text-sm text-muted-foreground">
          Set <code className="rounded bg-muted px-1">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> in
          your environment (e.g. Vercel → Project → Settings → Environment Variables for
          Production) and redeploy.
        </p>
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/login"
      signUpUrl="/signup"
      signInForceRedirectUrl="/chat"
      signUpForceRedirectUrl="/chat"
      signInFallbackRedirectUrl="/chat"
      signUpFallbackRedirectUrl="/chat"
    >
      <UserSettingsProvider>{children}</UserSettingsProvider>
    </ClerkProvider>
  );
}
