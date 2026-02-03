"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useUserSettings } from "@/components/user-settings-provider";

/**
 * Syncs theme from user preferences into next-themes.
 * Runs after hydration so it does not conflict with next-themes defaults.
 */
export function ThemeSyncFromPreferences() {
  const { setTheme } = useTheme();
  const { preferences, isLoading } = useUserSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;
    const theme = (preferences.theme as "light" | "dark" | "system" | undefined) ?? "system";
    setTheme(theme);
  }, [mounted, isLoading, preferences.theme, setTheme]);

  return null;
}
