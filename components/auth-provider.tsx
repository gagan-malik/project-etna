"use client";

import { SessionProvider } from "next-auth/react";
import { UserSettingsProvider } from "@/components/user-settings-provider";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserSettingsProvider>{children}</UserSettingsProvider>
    </SessionProvider>
  );
}

