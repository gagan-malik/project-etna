"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";

const GUEST_PREFERENCES_KEY = "etna_guest_preferences";

export type UpdateAccess = "stable" | "early";

export interface UserSettingsState {
  preferences: Record<string, unknown>;
  plan: string;
  updateAccess: UpdateAccess;
  isEarlyAccess: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
  /** Update preferences; uses API when signed in, localStorage when guest. */
  updatePreferences: (updates: Record<string, unknown>) => Promise<{ success: boolean; error?: string }>;
}

function loadGuestPreferences(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(GUEST_PREFERENCES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function saveGuestPreferences(prefs: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_PREFERENCES_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

const defaultState: UserSettingsState = {
  preferences: {},
  plan: "free",
  updateAccess: "stable",
  isEarlyAccess: false,
  isLoading: true,
  isAuthenticated: false,
  refetch: async () => {},
  updatePreferences: async () => ({ success: false }),
};

const UserSettingsContext = createContext<UserSettingsState>(defaultState);

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [preferences, setPreferences] = useState<Record<string, unknown>>({});
  const [plan, setPlan] = useState("free");
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    if (!session?.user?.id) {
      setPreferences({});
      setPlan("free");
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/settings", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setPreferences(data.preferences ?? {});
        setPlan(data.plan ?? "free");
      }
    } catch {
      // keep previous state
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  const updatePreferences = useCallback(
    async (updates: Record<string, unknown>): Promise<{ success: boolean; error?: string }> => {
      if (session?.user?.id) {
        try {
          const res = await fetch("/api/settings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updates),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            return { success: false, error: (data as { error?: string }).error ?? "Failed to save" };
          }
          await fetchSettings();
          return { success: true };
        } catch (e) {
          return { success: false, error: e instanceof Error ? e.message : "Request failed" };
        }
      }
      // Guest: merge into localStorage and state
      const next = { ...preferences, ...updates };
      setPreferences(next);
      saveGuestPreferences(next);
      return { success: true };
    },
    [session?.user?.id, preferences, fetchSettings]
  );

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setPreferences(loadGuestPreferences());
      setPlan("free");
      setIsLoading(false);
      return;
    }
    fetchSettings();
  }, [status, fetchSettings]);

  const updateAccess = (preferences.updateAccess as UpdateAccess) ?? "stable";
  const isEarlyAccess = updateAccess === "early";
  const isAuthenticated = Boolean(session?.user?.id);

  const value: UserSettingsState = {
    preferences,
    plan,
    updateAccess,
    isEarlyAccess,
    isLoading,
    isAuthenticated,
    refetch: fetchSettings,
    updatePreferences,
  };

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings(): UserSettingsState {
  const ctx = useContext(UserSettingsContext);
  return ctx ?? defaultState;
}
