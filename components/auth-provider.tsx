"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { UserSettingsProvider } from "@/components/user-settings-provider";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
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
